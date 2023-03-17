function getBackendURL(){
    let fallbackBackendUrl = "https://nilsbaumgartner.de/dataclumpsdoctor/api";

    let backendUrl = process.env.BACKEND_URL

    let customBackendUrl = process.env.CUSTOM_BACKEND_URL;
    if(!!customBackendUrl && customBackendUrl!==""){
        backendUrl = customBackendUrl
    }

    if(!backendUrl){
        backendUrl = fallbackBackendUrl
    }
    return backendUrl;
}

export default {
    extra: {
        BACKEND_URL: getBackendURL(),
        BASE_PATH: process.env.BASE_PATH || "dataclumpsdoctor/app/",
    },
        "scheme": "myapp",
        "name": "dataclumpsdoctor-app",
        "slug": "dataclumpsdoctor-app",
        "version": "1.0.2",
        "orientation": "portrait",
        "icon": "./assets/icon.png",
        "splash": {
            "image": "./assets/splash.png",
            "resizeMode": "contain",
            "backgroundColor": "#ffffff"
        },
        "updates": {
            "fallbackToCacheTimeout": 0
        },
        "assetBundlePatterns": ["**/*"],
        "ios": {
            "supportsTablet": true,
            "bundleIdentifier": "de.nilsbaumgartner.dataclumpsdoctordemo"
        },
        "android": {
            "googleServicesFile": "./google-services.json",
            "adaptiveIcon": {
                "foregroundImage": "./assets/adaptive-icon.png",
                "backgroundColor": "#FFFFFF"
            },
            "package": "de.nilsbaumgartner.dataclumpsdoctor"
        },
        "web": {
            "favicon": "./assets/favicon.png",
            "description": "A sample application that showcases various components that come built-in with NativeBase v3."
        },
        "description": ""
}
