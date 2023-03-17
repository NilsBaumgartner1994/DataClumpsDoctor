import React, {useEffect} from "react";
import {ConfigHolder, KitchenSafeAreaView, Navigation} from "kitcheningredients";
import {SetupLanguageHelper} from "./SetupLanguageHelper";
import {useSynchedDevices, useSynchedProfile, useSynchedProfileCanteen} from "../../components/profile/ProfileAPI";
import {useDemoMode, useSynchedDirectusLanguage} from "../synchedJSONState";
import {SettingProfile} from "../../screens/settings/SettingProfile";
import {DeviceInformationHelper} from "../DeviceInformationHelper";
import {View} from "native-base";
import {DemoModeLogo} from "./DemoModeLogo";

export const SetupComponent = (props) => {

	const [history, setHistory] = Navigation.useNavigationHistory();
	const [profile, setProfile] = useSynchedProfile();
	const [directusLanguages, setDirectusLanguages] = useSynchedDirectusLanguage();

	const [demo, setDemo] = useDemoMode();

	let userInstance = ConfigHolder.instance.getUser();

	function getLatestRoute(){
		//let history = Navigation.getHistory() || [];
		let currentRoute = history[history?.length - 1]?.key || ""; // e.g. "settingsprofile-eoiufhsoiuef"
		return currentRoute;
	}

	function getLatestRouteFirstPart(){
		return getLatestRoute().split("-")[0]; // e.g. "settingsprofile" from "settingsprofile-eoiufhsoiuef"
	}

	function isUserAtRouteComponent(component){
		//let routeName = RouteHelper.getNameOfComponent(component)
		let bestName = component.displayName || component.name;
		//let componentRoute = Navigation.getRouteByComponent(component); // e.g. "settingsprofile"
		return isUserAtRouteName(bestName)
	}

	function isUserAtRouteName(routeName){
		//console.log("isUserAtRouteName")
		let currentRouteName = Navigation.getCurrentRouteName() || "";
		//console.log("currentRouteName", currentRouteName)
		let firstPart = currentRouteName.split("-")[0]
		//let firstPart = getLatestRouteFirstPart()
		//console.log("firstPart", firstPart)
		//console.log("routeName", routeName)
		return firstPart === routeName;	// e.g. "settingsprofile" === "settingsprofile"
	}

	function isLanguageCorrectSet(){
		const oldProfileJSON = JSON.stringify(profile);
		let newProfile = SetupLanguageHelper.getNewProfileWithDefaultLanguageSet(profile, directusLanguages);
		if(JSON.stringify(newProfile) !== oldProfileJSON){
			setProfile(newProfile);
			return false;
		}
		return true;
	}

	function isProfileCorrectSet(){
		if(!!profile?.id){
			let nicknameSet = !!profile?.nickname;
			if(!nicknameSet){
				if(!isUserAtRouteComponent(SettingProfile)){
					Navigation.navigateTo(SettingProfile, {goHome: true});
//					NavigatorHelper.navigateWithoutParams(SettingProfile, true, {goHome: true});
				}
				return false;
			}
		}
		return true;
	}

	async function checkSyncOrder(functions){
		let continueChecking = true;
		for(let i=0; i<functions.length; i++){
			let func = functions[i];
			if(continueChecking){
				let result = await func();
				continueChecking = result;
			}
		}
		if(continueChecking && isUserAtRouteName("home")){
			//Navigation.navigateTo(FoodOfferList);
//			NavigatorHelper.navigateWithoutParams(FoodOfferList, true, {});
		}
	}

	useEffect(() => {
		let syncFinished = ConfigHolder.instance.state.syncFinished;
		if(!isUserAtRouteName("login") && syncFinished && !!userInstance){
			checkSyncOrder([
				isLanguageCorrectSet,
				isProfileCorrectSet,
			])
		}
	}, [props, profile, history]);

	function renderDemoModeLogo(){
		if(demo){
			return <View style={{
				position: "absolute", top: 0, width: "100%", opacity: 0.5,
                padding: 20,
				alignItems: "center",
				pointerEvents: "none",
			}}
						 pointerEvents={'none'}
			>
				<KitchenSafeAreaView>
					<DemoModeLogo/>
				</KitchenSafeAreaView>
			</View>
		}
	}

	return [
		props.children,
		renderDemoModeLogo()
	];

}
