const { spawn } = require('node:child_process');
const { parse } = require("java-parser");
const fs = require( 'fs' );
const path = require( 'path' );

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

const FIELD_ANALYSE_STATE = "analyse_state";
const FIELD_ANALYSE_STATE_NOT_STARTED = "not_started";
const FIELD_ANALYSE_STATE_START = "start";
const FIELD_ANALYSE_STATE_ANALYSING = "analysing";
const FIELD_ANALYSE_STATE_ANALYSED = "analysed";
const FIELD_ANALYSE_STATE_ERROR = "error";

const FIELD_ANALYSE_PROGRESS = "analyse_progress";

function getJobTempFolder(job_id){
    return baseProcessFolder+"/"+job_id
}

function getDownloadedRepoFolder(job_id){
    const temp_folder = getJobTempFolder(job_id)
    let repo_download_path = temp_folder+"/"+baseProcessFolderRepo
    return repo_download_path;
}

async function shouldStartAnalyse(payload){
    return payload?.[FIELD_ANALYSE_STATE]===FIELD_ANALYSE_STATE_START;
}

async function runScanForDataClumps(database, job_id){
    console.log("runScanForDataClumps");
    const repo_download_path = getDownloadedRepoFolder(job_id);

    let amountFiles = await countAmountFilesInFolder(repo_download_path);
    await updateProgress(database, job_id, "Amount Files total: "+amountFiles);

    let result = await runScanForDataClumpsForFolder(database, job_id, repo_download_path);
    if(!!result){

    }
}

async function runScanForFataClumpsForFile(path_to_file){
    console.log("runScanForFataClumpsForFile");
    try {
        console.log("Reading file content");
        const data = fs.readFileSync(path_to_file, 'utf8');
        let javaText = data;
        console.log(data);
        const cst = parse(javaText);
        console.log("Parsed successfully the java file");
    } catch (err) {
        console.error(err);
    }
}

async function visitEachFileInFolder(path_to_folder, asyncVisitorFunction){
    try {
        // Get the files as an array
        const files = await fs.promises.readdir( path_to_folder );

        let continueVisit = true;

        // Loop them all with the new for...of
        for( const file of files ) {
            // Get the full paths
            const folderOrFileInGivenPath = path.join( path_to_folder, file );

            // Stat the file to see if we have a file or dir
            const stat = await fs.promises.stat( folderOrFileInGivenPath );

            if( stat.isFile() ){
                continueVisit = await asyncVisitorFunction(folderOrFileInGivenPath);
            } else if( stat.isDirectory() ){
                continueVisit = await visitEachFileInFolder(folderOrFileInGivenPath, asyncVisitorFunction);
            }
            if(!continueVisit){
                return false
            }
        } // End for...of
        return continueVisit;
    }
    catch( e ) {
        // Catch anything bad that happens
        console.error( "We've thrown! Whoops!", e );
        return false;
    }
}

async function countAmountFilesInFolder(path_to_folder){
    let amountFiles = 0;
    await visitEachFileInFolder(path_to_folder, async (path_to_file) => {
        amountFiles++;
        return true;
    })
    console.log("Amount files: "+amountFiles);
    return amountFiles;
}

async function runScanForDataClumpsForFolder(database, job_id, path_to_folder){

}

function getJobIdFromInput(input){
    if(input?.key!==undefined){
        return input?.key;
    }
    return input?.keys[0];
}

async function updateProgress(database, job_id, text){
    console.log("updateProgress");
    console.log(" - "+job_id);
    console.log(" - "+text);
    await database(TABLE_ANALYSE_JOBS).where({id: job_id}).update({
        [FIELD_ANALYSE_PROGRESS]: text
    });
}

async function updateAnalyseState(database, job_id, state){
    console.log("updateAnalyseState");
    console.log(" - "+job_id);
    console.log(" - "+state);
    await database(TABLE_ANALYSE_JOBS).where({id: job_id}).update({
        [FIELD_ANALYSE_STATE]: state
    });
}

async function checkIfStartAnalyse(input, context, database) {
    const job_id = getJobIdFromInput(input);

    const payload = input?.payload;

    const shouldStartAnalyseValue = await shouldStartAnalyse(payload);
    if(shouldStartAnalyseValue){
        await updateAnalyseState(database, job_id, FIELD_ANALYSE_STATE_ANALYSING);
        await updateProgress(database, job_id, "");
        try{
            await runScanForDataClumps(database, job_id);
        } catch (err){
            await updateAnalyseState(database, job_id, FIELD_ANALYSE_STATE_ERROR);
            return;
        }
        await updateAnalyseState(database, job_id, FIELD_ANALYSE_STATE_ANALYSED);
        return;
    }
}

async function checkIfStartAnalyseOnUpdate(input, context, database) {
    return await checkIfStartAnalyse(input, context, database)
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
            await checkIfStartAnalyseOnUpdate(input, context, database);
        }
    );

}

module.exports = registerHooks.bind(null);
