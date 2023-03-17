import {useSynchedState} from "kitcheningredients";
import {StorageKeys} from "./synchedVariables/StorageKeys";
import {Apartments} from "../directusTypes/types";

export function useJSONState(storageKey): [value: any, setValue: (value) => {}] {
    let [jsonStateAsString, setJsonStateAsString] = useSynchedState(storageKey);
    if(jsonStateAsString === undefined || jsonStateAsString === "undefined") {
        jsonStateAsString = "{}";
    }
    const parsedJSON = JSON.parse(jsonStateAsString || "{}");
    const setValue = (dict) => setJsonStateAsString(JSON.stringify(dict))
    return [
        parsedJSON,
        setValue
    ]
}

export function useDebugMode(): [value: any, setValue: (value) => {}] {
    let [debug, setDebug] = useJSONState(StorageKeys.CACHED_DEBUG_MODE);
    return [debug===true, setDebug]; //why ever demo is an object?
}

export function useDemoMode(): [value: any, setValue: (value) => {}] {
    return useJSONState(StorageKeys.CACHED_DEMO_MODE);
//    const [demo, setDemo] = useJSONState(StorageKeys.CACHED_DEMO_MODE);
  //  return [true, setDemo];
}

export function useSynchedRemoteSettings(): [value: any, setValue: (value) => {}] {
    return useJSONState(StorageKeys.CACHED_REMOTEAPPSETTINGS)
}

export function useSynchedDirectusSettings(): [value: any, setValue: (value) => {}] {
    return useJSONState(StorageKeys.CACHED_DIRECTUSSETTINGS)
}

export function useSynchedDirectusLanguage(): [value: any, setValue: (value) => {}] {
    return useJSONState(StorageKeys.CACHED_DIRECTUS_LANGUAGES)
}

export function useSynchedAppTranslations(): [value: any, setValue: (value) => {}] {
    return useJSONState(StorageKeys.CACHED_APP_TRANSLATIONS)
}

export function useSynchedRemoteFields(): [value: any, setValue: (value) => {}] {
    return useJSONState(StorageKeys.CACHED_REMOTEAPPFIELDS)
}

export function useSynchedWikis(): [value: any, setValue: (value) => {}] {
    return useJSONState(StorageKeys.CACHED_WIKIS)
}

export function useSynchedNotificationsLocalDict(): [value: Record<string, Apartments>, setValue: (value) => {}] {
    return useJSONState(StorageKeys.CACHED_NOTIFICATIONS_LOCAL)
}

export function useSynchedImageOverlays(resource_id): any {
    const [resourceDict, setResourcesDict] = useSynchedImageOverlaysDict();
    return resourceDict?.[resource_id];
}

export function useSynchedImageOverlaysDict(): [value: Record<string, Apartments>, setValue: (value) => {}] {
    return useJSONState(StorageKeys.CACHED_IMAGE_OVERLAYS)
}
