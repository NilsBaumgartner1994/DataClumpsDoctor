import React, {useEffect, useState} from "react";
import {SyncCollectionLoader} from "./SyncCollectionLoader";
import {ConfigHolder, ServerAPI, useCustomHeaderTextColor, useProjectColor} from "kitcheningredients";

import {SyncMenuLoader} from "./SyncMenuLoader";
import {Text, View} from "native-base";
import {loadProfileRemote, useSynchedProfile} from "../../components/profile/ProfileAPI";
import {DeviceInformationHelper} from "../DeviceInformationHelper";
import {RemoteDirectusSettingsLoader} from "../../components/settings/RemoteDirectusSettingsLoader";
import {ViewPercentageBorderradius} from "../ViewPercentageBorderradius";
import {AppTranslation} from "../../components/translations/AppTranslation";
import {UpdateScreen} from "../../codepush/UpdateScreen";
import {DebugConsole} from "../../components/console/DebugConsole";
import {
	useSynchedAppTranslations,
	useSynchedDirectusLanguage,
	useSynchedDirectusSettings,
	useSynchedRemoteFields,
	useSynchedRemoteSettings,
	useSynchedWikis,
} from "../synchedJSONState";
import {CollectionHelper} from "../CollectionHelper";
import {MyTouchableOpacity} from "../../components/buttons/MyTouchableOpacity";

let rendering = 1;

export const SyncComponent = (props) => {

	let userInstance = ConfigHolder.instance.getUser();
	let isOffline = ConfigHolder.instance.isOffline();

	rendering++;

	const [cancelVisible, setCancelVisible] = useState(false);
	const cancelVisibleTime = 10; // 10 seconds response time after Robert B. Miller https://dl.acm.org/doi/10.1145/1476589.1476628

	const [directusSettings, setDirectusSettings] = useSynchedDirectusSettings();
	const [directusLanguages, setDirectusLanguages] = useSynchedDirectusLanguage();
	const [remoteAppTranslations, setRemoteAppTranslations] = useSynchedAppTranslations();
	const [remoteAppSettings, setRemoteAppSettings] = useSynchedRemoteSettings();
	const [remoteAppFields, setRemoteAppFields] = useSynchedRemoteFields();
	const [wikis, setWikis] = useSynchedWikis();
	const [profile, setProfile] = useSynchedProfile();

	const [deviceInformation, setDeviceInformation] = DeviceInformationHelper.useLocalDeviceInformation();

	const textColor = useCustomHeaderTextColor();
	const textBackground = useProjectColor()

	const [profileNotFound, setProfileNotFound] = useState(false);
	const [remoteProfileLoaded, setRemoteProfileLoaded] = useState(undefined);

	const remoteLoadedProfileSameAsLocal = JSON.stringify(remoteProfileLoaded)===JSON.stringify(profile)
	const profileLoadingFinished = (isOffline || profileNotFound || remoteLoadedProfileSameAsLocal);

	const [syncedMenu, setSyncedMenu] = useState(false)
	const syncedMenuStatus = syncedMenu;

	const [status, setStatus] = useState("Starting")

	if(!!props?.getSetProfileFunction){
		props.getSetProfileFunction((newProfile, offline) => {
			setProfile(newProfile, offline);
			//setSyncingFinished(false);
		});
	}

	const variablesToBeLoadedDict = {
		syncedMenuStatus: syncedMenuStatus,
		deviceInformation: deviceInformation,
		remoteAppTranslations: remoteAppTranslations,
		directusLanguages: directusLanguages,
		directusSettings: directusSettings,
		remoteAppSettings: remoteAppSettings,
		remoteAppFields: remoteAppFields,
		profileLoadingFinished: profileLoadingFinished,
		wikis: wikis,
	}

	const variablesToBeLoaded = [];
	for(let key in variablesToBeLoadedDict){
		variablesToBeLoaded.push(variablesToBeLoadedDict[key]);
	}

	const amountVariablesToBeLoaded = variablesToBeLoaded.length;
	const amountVariablesLoaded = countNotNull(variablesToBeLoaded)
	const allVariablesLoaded = amountVariablesLoaded === amountVariablesToBeLoaded;
	const percentage = amountVariablesLoaded*100/amountVariablesToBeLoaded;


	function countNotNull(variables){
		if(!!variables){
			let notNull = 0;
			for(let variable of variables){
				if(!!variable){
					notNull+=1;
				} else {

				}
			}
			return notNull;
		} else {
			return 0;
		}
	}

	async function loadDirectusFields(){
		let directus = ServerAPI.getClient();
		try{
			let fields = await directus.fields.readAll()
			if(!!fields && fields?.data){
				fields = fields.data;
			}
			let fieldsByCollection = {};
			if(!!fields){
				//console.log("loadDirectusFields", fields)
				for(let field of fields){
					let collection = field.collection;
					let fieldname = field?.field;
					let fieldsInCollection = fieldsByCollection[collection] || {};
					fieldsInCollection[fieldname] = field;
					fieldsByCollection[collection] = fieldsInCollection;
				}
			}
			//console.log("loadDirectusFields", fieldsByCollection)
			setRemoteAppFields(fieldsByCollection);
		} catch (err){
			//console.log(err);
		}
	}

	async function loadDirectusSettings(){
		let remoteDirectusSettingsLoaded = await RemoteDirectusSettingsLoader.getRemoteDirectusSettings();
		if(!!remoteDirectusSettingsLoaded){
			let asString = JSON.stringify(remoteDirectusSettingsLoaded)
			if(asString!==JSON.stringify(directusSettings)){
				setDirectusSettings(remoteDirectusSettingsLoaded);
			}
		}
	}

	async function loadProfile(){
		let remoteProfile = await loadProfileRemote();

		if(!!remoteProfile){
			setProfile(remoteProfile, true); // we want to save it locally, because otherwise the field "updated_at" would be updated
			setRemoteProfileLoaded(remoteProfile)
		} else {
			setProfileNotFound(true)
		}
	}

	async function loadDeviceInformation(){
		let deviceInformation = await DeviceInformationHelper.getDeviceInformation();
		setDeviceInformation(deviceInformation);
	}

	async function load(){
		if(!isOffline){
			SyncCollectionLoader.setCacheOfRemoteCollection("app_settings", remoteAppSettings, setRemoteAppSettings, SyncCollectionLoader.getFieldsForAllAndTranslations());
			SyncCollectionLoader.setCacheOfRemoteCollection("app_translations", remoteAppTranslations, setRemoteAppTranslations, SyncCollectionLoader.getFieldsForAllAndTranslations(), CollectionHelper.transformCollectionToDict, undefined);
			SyncCollectionLoader.setCacheOfRemoteCollection("languages", directusLanguages, setDirectusLanguages);
			SyncCollectionLoader.setCacheOfRemoteCollection("wikis", wikis, setWikis ,SyncCollectionLoader.getFieldsForAllAndTranslations(), CollectionHelper.transformCollectionToDict, undefined);
			loadDeviceInformation();
			loadDirectusSettings();
			loadDirectusFields();
			loadProfile();
		}
	}


	function checkSyncOrder(){
		if(isOffline){
			if(syncedMenuStatus){
				ConfigHolder.instance.setSyncFinished(true);
			}
		}
		if(!isOffline){
			//authenthicated user
			if(!!userInstance && allVariablesLoaded && syncedMenuStatus){
				ConfigHolder.instance.setSyncFinished(true);
			}
			if(!userInstance && syncedMenuStatus){ // an unauthenticated user
				ConfigHolder.instance.setSyncFinished(true);
			}
		}
	}

	checkSyncOrder()

	function renderCancelButton(){
		if(!cancelVisible){
			return null;
		}

		return(
			<View style={{width: "100%", height: "100%", flex: 1, justifyContent: "flex-end"}}>
				<View style={{padding: "10%", alignItems: "center"}}>
					<MyTouchableOpacity
						onPress={async () => {
							try{
								await ServerAPI.handleLogout();
							} catch (err){
								//console.log(err);
							}
						}}
						style={{flex: 1, width: "100%"}}>
						<ViewPercentageBorderradius style={{padding: 10, borderRadius: "10%", width: "100%", backgroundColor: "orange", alignItems: "center"}} >
							<AppTranslation color={"white"} id={"cancel"} />
						</ViewPercentageBorderradius>
					</MyTouchableOpacity>
				</View>
			</View>
		)
	}

	function renderNotLoadedVariables(){
		return null;
		let output = [];
		for(let key in variablesToBeLoadedDict){
			if(!variablesToBeLoadedDict[key]){
				output.push(
					<Text>{"Not loaded: "+key}</Text>
				)
			}
		}
		return output;
	}

	function renderLoading(){
		let message = profileLoadingFinished ? "Profile loaded" : "Loading profile";

		return <View style={{width: "100%", height: "100%"}}>
			<UpdateScreen receivedBytes={percentage} totalBytes={100} message={status+"\n"+message} ignoreBytes={true} >
				{renderNotLoadedVariables()}
			</UpdateScreen>
			{renderCancelButton()}
		</View>
	}

	useEffect(() => {
		setTimeout(() => {
			load();
		}, 0);
		setTimeout(() => {
			setCancelVisible(true);
		}, cancelVisibleTime*1000);
	}, [props])

	const renderedMenuLoader = profileLoadingFinished ? <SyncMenuLoader setSyncedMenu={setSyncedMenu} /> : null;



	return [
		renderLoading(),
		<DebugConsole />,
		renderedMenuLoader
	];

}
