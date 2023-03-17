import {ConfigHolder, ServerAPI, useSynchedState} from "kitcheningredients";
import {StorageKeys} from "../../helper/synchedVariables/StorageKeys";
import {useJSONState} from "../../helper/synchedJSONState";
import {PermissionHelper} from "../../helper/PermissionHelper";
import {DirectusUsers, Markings, Profiles} from "../../directusTypes/types";
import {SynchedStateKeys} from "../../helper/synchedVariables/SynchedStateKeys";
import {DeviceInformationHelper} from "../../helper/DeviceInformationHelper";


const profileRelations = ["markings", "foods_feedbacks", "devices", "buildings_favorites", "buildings_last_visited"]
const profileFields = ["*"];
for(let relation of profileRelations) {
    profileFields.push(relation+".*");
}

const deepFields = {};
for(let relation of profileRelations) {
    deepFields[relation] = { _limit: -1 };
}


export async function loadProfileRemote(){
    let userInstance = ConfigHolder.instance.getUser();
    if(!!userInstance && userInstance?.id  && userInstance?.profile) {
        let directus = ServerAPI.getClient();
        try {
            let remoteProfileListAnswer = await directus.items("profiles").readByQuery({
                limit: -1,
                filter: {
                    _and: [
                        {
                            id: {
                                _eq: userInstance?.profile
                            }
                        }
                    ]
                },
                fields: profileFields,
                deep: deepFields,
            })
            let remoteProfile = remoteProfileListAnswer?.data[0]
            return remoteProfile
        } catch (err) {
            //console.log("Error at loading profile");
            //console.log(err);
        }
    }
    return null;
}

export class ProfileAPI{

    static getObjToResetProfile(profile){
        let profile_id = profile?.id;
        let user_id = profile?.user;
        let profileKeys = Object.keys(profile);
        let newProfile = {
            id: profile_id,
            user: user_id
        };
        for(let i=0; i<profileKeys.length; i++){
            let key = profileKeys[i];
            if(key!=="status"){
                newProfile[key] = null;
            }
        }
        newProfile.id = profile_id;
        newProfile.user = user_id;
        return newProfile;
    }

    static loadGuestProfile(){
        return {};
    }

    static loadFakeDirectusUser(){
        let fakeUser: DirectusUsers = {
            admin_divider: "",
            id: "123456-abcdefg-987654-zyxwai",
            preferences_divider: "",
            provider: "Default",
            status: ""
        }
        return fakeUser;
    }

    static loadFakeProfile(){
        let profile: Profiles = {
            id: 0,
            markings: undefined,
            canteen: 1,
            nickname: "FakeProfile",
            user_created: ProfileAPI.loadFakeDirectusUser().id,
            date_created: "2022-07-15T06:56:39.274Z",
            user_updated: ProfileAPI.loadFakeDirectusUser().id,
            date_updated: "2022-07-15T06:56:39.274Z",
            status: ""
        }
        return profile;
    }

    static getLanguageFieldName(){
        return "language";
    }

    static getCourseTimetableFieldName(){
        return "course_timetable";
    }

    static getLocaleForJSDates(passedProfile?: Profiles){
        const [profile, setProfile] = useSynchedProfile();
        const usedProfile = passedProfile ? passedProfile : profile;

        const profilesLanguageCode = usedProfile[ProfileAPI.getLanguageFieldName()];
        let locale = undefined;
        if(!!profilesLanguageCode && profilesLanguageCode.length > 0){
            locale = profilesLanguageCode.toLowerCase() //"en-US" --> "en-us";
        }
        return locale;
    }
}


export function useSynchedProfile(): [value: Profiles, setValue: (value, offline?) => {}] {
    const [jsonState, setJsonState] = useJSONState(StorageKeys.CACHED_PROFILE);

    const setValue = async (newProfile, offline?) => {
        if(!!offline) {
            setJsonState(newProfile);
            return true;
        } else {
            if(!!newProfile && !!newProfile?.id){
                let directus = ServerAPI.getClient();
                let permissions = ConfigHolder.instance.getPermissions();
                let role = ConfigHolder.instance.getRole();
                let filteredProfile = PermissionHelper.filterForAllowedUpdateFields(role, permissions, "profiles", newProfile)
                let answer = await directus.items("profiles").updateOne(newProfile?.id, filteredProfile, {fields: profileFields});
                if(!!answer){
                    await setJsonState(answer);
                    return true;
                }
                return false;
            } else {
                //console.log("Profile has no id");
                await setJsonState(newProfile);
                return true;
            }
        }
    }

    const user = ConfigHolder.instance.getUser()
    let fallbackProfile = null;
    if(!!user && !jsonState){
        fallbackProfile = {}
    }

    return [
        jsonState || fallbackProfile,
        setValue
    ]
}

export function useSynchedProfileCanteen(): [value: string, setValue: (value, offline?) => {}] {
    const [profile, setProfile] = useSynchedProfile();
    const setValue = async (newCanteen, offline?) => {
        if(!!profile){
            let newProfile = {...profile};
            newProfile.canteen = newCanteen;
            await setProfile(newProfile, offline);
        }
    }
    return [
        profile?.canteen,
        setValue
    ];
}

export function useSynchedDevices() {
    const [profile, setProfile] = useSynchedProfile();
    const deviceUniqueIdentifierField = "deviceFingerprint";

    let devices = profile?.devices || [];
    const setDevices = async (newDevices) => {
        let newProfile = {...profile, devices: newDevices};
        await setProfile(newProfile);
    }
    const isDeviceUpToDateOrUpdate = async (deviceInformations) => {
        if(deviceInformations?.[deviceUniqueIdentifierField]){
            let foundDevice = undefined;
            for(let device of devices){
                if(device?.[deviceUniqueIdentifierField] === deviceInformations?.[deviceUniqueIdentifierField]){
                    foundDevice = device;
                    break;
                }
            }
            if(!foundDevice){
                await setDevices([...devices, deviceInformations]);
                return false;
            } else {
                // we want to check if we have the latest device information
                let remoteKeys = Object.keys(foundDevice); // e.g. ["id", "internalId", "brand", "createdAt", "updatedAt"]
                let localKeys = Object.keys(deviceInformations); // e.g. ["internalId", "brand", "extraInformation"]

                let keysForComparison = remoteKeys.filter(key => localKeys.includes(key)); // e.g. ["internalId", "brand"]
                let foundDifference = false;
                for(let key of keysForComparison){
                    let remoteValue = foundDevice[key];
                    let remoteValueForComparison = JSON.stringify(remoteValue);
                    //check if is not object
                    if(typeof remoteValue !== "object"){ // e.g. 200 would be to '200' but "200" would be to '"200"'
                        remoteValueForComparison = remoteValue+""; // therefore we only convert to string
                    }

                    let localValue = deviceInformations[key];
                    let localValueForComparison = JSON.stringify(localValue);
                    //check if is not object
                    if(typeof localValue !== "object") { // e.g. 200 would be to '200' but "200" would be to '"200"'
                        localValueForComparison = localValue+"";
                    }

                    if(remoteValueForComparison !== localValueForComparison){
                        foundDifference = true;
                        break;
                    }
                }
                if(foundDifference){
                    let deviceInformationsForUpdate = {...foundDevice, ...deviceInformations}; // we want to keep id or createdAt
                    let newDevices = devices.map(device => {
                        if(device?.[deviceUniqueIdentifierField] === deviceInformationsForUpdate?.[deviceUniqueIdentifierField]){
                            return deviceInformationsForUpdate;
                        }
                        return device;
                    });
                    await setDevices(newDevices);
                    return false;
                }

            }
        }
        return true;
    }

    return [devices, setDevices, isDeviceUpToDateOrUpdate];
}
