import React, {FunctionComponent} from "react";
import {DetailsComponentMenus, DetailsComponentMenuType} from "./DetailsComponentMenus";
import {ScrollView, Text, View} from "native-base";
import {MyActionsheet} from "kitcheningredients";
import {useDebugMode} from "../../helper/synchedJSONState";
import {DebugIcon} from "../icons/DebugIcon";

export type DetailsComponentMenuRelationType = {
	customTitle?: any,
	title: string,
	amount?: number | string,
	icon?: any
	renderContent?: (onClose?: () => void) => any,
	onPress?: () => Promise<boolean | undefined>, // an async onPress function that returns a boolean or undefined
}
export interface AppState{
	// menus are a dict with DetailsComponentMenuType as value and a string as key
	menus?: Record<string, DetailsComponentMenuType>,
	relations: Record<string, DetailsComponentMenuRelationType>,
	getOnClose?: (onClose: any) => void,
}
export const DetailsComponentMenusForRelations: FunctionComponent<AppState> = (props) => {

	const actionsheet = MyActionsheet.useActionsheet();
	const [debug, setDebug] = useDebugMode()

	function getDetailsComponentMenuForRelation(relation: DetailsComponentMenuRelationType){
		let icon = relation?.icon;

		if(relation?.amount === 0){
			if(debug){ // if debug mode is enabled, show the amount of relations
				icon = <DebugIcon />
			} else { // if not in debug mode, don't show the menu
				return null;
			}
		}

		return {
			icon: icon,
			menuButtonContent: relation?.title,
			amount: relation?.amount,
			onPress: async () => {
				if(relation.onPress){
					return await relation.onPress();
				} else {
					const onClose = actionsheet.show({
						title: relation?.title,
						renderCustomContent: (onClose) => {
							return <ScrollView style={{width: "100%"}} >{relation?.renderContent(onClose)}</ScrollView>
						}
					});
					if(props?.getOnClose){
						//console.log("getOnClose");
						onClose();
						props.getOnClose(onClose);
					}
				}
			}
		}
	}

	function getMenusForRelations(){
		const relations = props.relations;
		const relationKeys = Object.keys(relations);
		const menus = {};
		for(let relationKey of relationKeys){
			const relation = relations[relationKey];
			menus[relationKey] = getDetailsComponentMenuForRelation(relation);
		}
		return menus;
	}

	const menusForRelations = getMenusForRelations();
	const menusFromProps = props.menus || {};
	const menus = {...menusFromProps, ...menusForRelations};

	return(
		<DetailsComponentMenus menus={menus} spacer={null} style={{width: "100%", flexDirection: "row", flexWrap: "wrap", alignItems: "center"}} hideSelection={true} />
	)

}
