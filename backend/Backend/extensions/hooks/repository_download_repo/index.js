const { spawn } = require('node:child_process');

/**
const pwd = spawn('pwd');
pwd.stdout.on('data', (data) => {
    console.log(`pwd: ${data}`);
});
 */

const customFiles = "/directus/CustomFiles";
const baseProcessFolder = customFiles+"/"+"Repo_temp";
const baseProcessFolderRepo = "repository";

const TABLE_ANALYSE_JOBS = "repositories"
const FIELD_REPOSITORY_URL = "repository_url";

const FIELD_REPOSITORY_DOWNLOAD_STATE = "repo_download_state";
const FIELD_REPOSITORY_DOWNLOAD_STATE_NOT_STARTED = "not_started";
const FIELD_REPOSITORY_DOWNLOAD_STATE_DOWNLOADING = "downloading";
const FIELD_REPOSITORY_DOWNLOAD_STATE_UPDATED = "updated";
const FIELD_REPOSITORY_DOWNLOAD_STATE_ERROR = "error";

const FIELD_REPOSITORY_DOWNLOAD_PROGRESS = "repo_download_progress";

async function cmd(command, params, onData, customOnError) {
    console.log("cmd: " + command + " " + params.join(" "));
    if(!params){
        params = []
    }
    let p = spawn(command, params);
    return new Promise((resolveFunc, rejectFunc) => {
        p.stdout.on("data", (x) => {
             console.log("CMD onData: "+x.toString());
            //process.stdout.write(x.toString());
            if(onData){
                onData(x);
            }
        });
        p.stderr.on("data", (x) => {
            console.log("Error");
            console.log(x.toString());
            if(customOnError){
                customOnError(x);
            } else {
                //process.stderr.write(x.toString());
                rejectFunc(x.toString());
            }
        });
        p.on("exit", (code) => {
            console.log("Exit");
            resolveFunc(code);
        });
    });
}

function getJobTempFolder(job_id){
    return baseProcessFolder+"/"+job_id
}

async function deleteTempFiles(database, job_id){
    const temp_folder = getJobTempFolder(job_id)
    if(!!job_id && !!temp_folder){
        await cmd('rm', ['-rf', temp_folder], (data) => {});
    } else {
        await updateDownloadProgress(database, job_id, "Error deleting temp folder for: "+job_id);
    }
}

async function shouldStartDownload(payload, isNewItem){
    console.log("checking shouldStartDownload");
    let repo_download_state = payload?.[FIELD_REPOSITORY_DOWNLOAD_STATE];
    console.log(" - repo_download_state: "+repo_download_state);

    if(isNewItem){
        return repo_download_state===FIELD_REPOSITORY_DOWNLOAD_STATE_NOT_STARTED || !repo_download_state;
    } else {
        return repo_download_state===FIELD_REPOSITORY_DOWNLOAD_STATE_NOT_STARTED;
    }
}

async function getRepoURL(payload, job_id, database){
    let payload_repository_url = payload?.[FIELD_REPOSITORY_URL];
    if(!!payload_repository_url){
        return payload_repository_url
    } else {
        let current_instance = await database(TABLE_ANALYSE_JOBS).where({id: job_id}).first();
        if(!!current_instance){
            return current_instance?.[FIELD_REPOSITORY_URL];
        } else {
            return null;
        }
    }
}

function downloadGitRepo(gitRepoUrl, folderPath, onProgress) {
    return new Promise((resolve, reject) => {
        const gitClone = spawn('git', ['clone', gitRepoUrl, folderPath]);
        gitClone.stderr.on('data', (data) => { // this is no error but an information
            if(onProgress){
                onProgress(data.toString())
            }
            //reject(data); // we therefore ignore rejecting this
        });

        gitClone.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            if (code === 0) {
                resolve();
            } else {
                reject(`Git clone failed with code ${code}`);
            }
        });
    });
}

async function handleDownloadRepo(job_id, payload, context, database){
    console.log("handlePreprocessSales");

    const temp_folder = getJobTempFolder(job_id)

    await updateDownloadProgress(database, job_id, "Deleting temp folder");
    await deleteTempFiles(database, job_id);
    await updateDownloadProgress(database, job_id, "Create temp folder");
    await cmd('mkdir', [temp_folder], (data) => {});
    await updateDownloadProgress(database, job_id, "Created temp folder");


    // repository_url
    await updateDownloadProgress(database, job_id, "Checking for repository url ...");

    let repository_url = await getRepoURL(payload, job_id, database);

    await updateDownloadProgress(database, job_id, "Starting downloading from: "+repository_url+" into folder: "+temp_folder);
    let repo_download_path = temp_folder+"/"+baseProcessFolderRepo;

    try{
        const onProgess = async (msg) => {
            await updateDownloadProgress(database, job_id, msg);
        }
        await downloadGitRepo(repository_url, repo_download_path, onProgess);
        await updateDownloadProgress(database, job_id, "Download finished");
        await updateDownloadState(database, job_id, FIELD_REPOSITORY_DOWNLOAD_STATE_UPDATED);
    } catch (err){
        console.log("Whoops some error was found")
        console.log(err);
        console.log(err.toString())
        await updateDownloadProgress(database, job_id, "Download error:");
        await updateDownloadProgress(database, job_id, err.toString());
        await updateDownloadState(database, job_id, FIELD_REPOSITORY_DOWNLOAD_STATE_ERROR);
    }
}

function getJobIdFromInput(input){
    if(input?.key!==undefined){
        return input?.key;
    }
    return input?.keys[0];
}

async function updateDownloadProgress(database, job_id, text){
    console.log("updateProgress");
    console.log(" - "+job_id);
    console.log(" - "+text);
    await database(TABLE_ANALYSE_JOBS).where({id: job_id}).update({
        [FIELD_REPOSITORY_DOWNLOAD_PROGRESS]: text
    });
}

async function updateDownloadState(database, job_id, text){
    await database(TABLE_ANALYSE_JOBS).where({id: job_id}).update({
        [FIELD_REPOSITORY_DOWNLOAD_STATE]: text
    });
}

async function checkIfStartDownload(input, context, database, isNewItem) {
    console.log("checkIfStartDownload");
    console.log(JSON.stringify(input, null, 2));

    const job_id = getJobIdFromInput(input);
    console.log("job_id: " + job_id);

    await updateDownloadProgress(database, job_id, "check: shouldStartDownload");

    const payload = input?.payload;

    const statusShouldStartDownload = await shouldStartDownload(payload, isNewItem);
    console.log("statusShouldStartDownload: " + statusShouldStartDownload);
    await updateDownloadProgress(database, job_id, "statusShouldStartDownload: "+statusShouldStartDownload);
    if(statusShouldStartDownload){
        await updateDownloadState(database, job_id, FIELD_REPOSITORY_DOWNLOAD_STATE_DOWNLOADING);
        await handleDownloadRepo(job_id, payload, context, database);
        return;
    }
}

async function handleDeleteJob(input, context, database){
    console.log("handleDeleteJob");
    console.log(input);
    let keys = input?.keys;
    for(let i=0; i<keys.length; i++){
        let key = keys[i];
        await deleteTempFiles(database, key);
    }
}

async function checkIfStartDownloadOnCreate(input, context, database) {
    /**
directussmell-check | {
directussmell-check |   "event": "analyse_jobs.items.create",
directussmell-check |   "payload": {
directussmell-check |     "repository_url": "https://github.com/argouml-tigris-org/argouml",
directussmell-check |     "start_repo_download": true
directussmell-check |   },
directussmell-check |   "key": 9,
directussmell-check |   "collection": "analyse_jobs"
directussmell-check | }
     */
    return await checkIfStartDownload(input, context, database, true)
}

async function checkIfStartDownloadOnUpdate(input, context, database) {
    return await checkIfStartDownload(input, context, database, false)
}

async function registerHooks({filter, action, init, schedule}, {
    services,
    exceptions,
    database,
    getSchema,
    logger
}){
    let fullSchema = await getSchema();

    action(
        TABLE_ANALYSE_JOBS + '.items.update',
        async (input, context) => {
            await checkIfStartDownloadOnUpdate(input, context, database);
        }
    );

    action(
        TABLE_ANALYSE_JOBS + '.items.create',
        async (input, context) => {
            await checkIfStartDownloadOnCreate(input, context, database);
        }
    );

    action(
        TABLE_ANALYSE_JOBS + '.items.delete',
        async (input, context) => {
            await handleDeleteJob(input, context, database);
        }
    );



}

module.exports = registerHooks.bind(null);
