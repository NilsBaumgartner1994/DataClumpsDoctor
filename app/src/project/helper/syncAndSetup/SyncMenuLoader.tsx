import React, {useEffect} from "react";
import {Icon, MenuItem, Navigation} from "kitcheningredients";

import {MaterialIcons} from "@expo/vector-icons";
import {WikiMenuContent} from "../../screens/wiki/WikiMenuContent";
import {WikiLoader} from "../../components/wiki/WikiLoader";
import {useAppTranslation} from "../../components/translations/AppTranslation";
import Project from "../../Project";
import {Wikis} from "../../screens/wiki/Wikis";
import {
	useDebugMode,
	useSynchedWikis
} from "../synchedJSONState";
import {StringHelper} from "../StringHelper";

export const SyncMenuLoader = (props) => {
	const setSyncedMenu = props?.setSyncedMenu || (() => {});

	const translationScreenNameLegalRequirements = useAppTranslation("legalRequirements")

	const [debug, setDebug] = useDebugMode()
	const [wikis, setWikis] = useSynchedWikis();

	function getMenuItemFromWiki(wiki){
		let items = [];
		let children = wiki?.children || [];
		for(let child of children){
			items.push(getMenuItemFromWiki(child));
		}

		let content = <WikiMenuContent wiki={wiki} />;

		let icon = wiki?.icon;
		let renderIcon = undefined;
		if(icon){
			let transformedIcon = StringHelper.replaceAll(icon, "_", "-") // Directus gives us underscores, but we need dashes
			renderIcon = () => <Icon as={MaterialIcons} name={transformedIcon} />
		}

		let menu = new MenuItem({
			key: "wiki"+wiki?.id,
			content: content,
			command: () => {Navigation.navigateTo(Wikis, {id: wiki?.id})},
			icon: renderIcon,
		})
		menu.addChildMenuItems(items);
		return menu;
	}

	function loadMenus(){

		let registeredMenus = Navigation.menuGetRegisteredDict();
		let legalRequirementMenu = registeredMenus[Navigation.DEFAULT_MENU_KEY_LEGAL_REQUIREMENTS];
		if(!!translationScreenNameLegalRequirements && !!legalRequirementMenu){
			legalRequirementMenu.label = translationScreenNameLegalRequirements;
		}


/**
		let registeredMenuKeys = Object.keys(registeredMenus);
		for (let menuKey of registeredMenuKeys) {
			Menu.unregisterMenuForRoleId(Menu.ROLE_PUBLIC, registeredMenus[menuKey]);
			delete registeredMenus[menuKey];
		}
*/

		let wikisMenuItems = WikiLoader.getWikisMenuItems(wikis);
		if (!!wikisMenuItems) {
			for (let wiki of wikisMenuItems) {
				let menu = getMenuItemFromWiki(wiki);
				Navigation.menuRegister(menu);
			}
		}

		if(debug){
			let menuItem = Project.getDebugMenu()
			Navigation.menuRegister(menuItem);
		}

		setSyncedMenu(true);
	}

	useEffect(() => {
		loadMenus();
	}, [props, debug, wikis]);

	return null;

}
