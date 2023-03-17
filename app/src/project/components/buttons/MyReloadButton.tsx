import React, {FunctionComponent} from "react";
import {Text, View} from "native-base";
import {SettingsRowInner} from "../settings/SettingsRowInner";
import {Icon, MyActionsheet} from "kitcheningredients";
import {MyAlertProps} from "kitcheningredients/src/ignoreCoverage/KitchenHelper/helper/MyActionsheet";
import {MyTouchableOpacity} from "./MyTouchableOpacity";
import {useAppTranslation} from "../translations/AppTranslation";
import {MyButton} from "./MyButton";
import {ReloadIcon} from "../icons/ReloadIcon";

export interface AppState{
	onPress?: () => Promise<boolean | undefined>, // an async onPress function that returns a boolean or undefined
	disabled?: boolean,
}
export const MyReloadButton: FunctionComponent<AppState> = (props) => {

	const translationReload = useAppTranslation("reload");

	return <MyButton accessibilityLabel={translationReload} onPress={props?.onPress} icon={<ReloadIcon />} >
		<Text>{translationReload}</Text>
	</MyButton>

}
