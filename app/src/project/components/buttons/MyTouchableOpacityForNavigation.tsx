import React, {FunctionComponent, useState} from "react";
import {Text, Tooltip, View} from "native-base";
import {TouchableOpacity} from "react-native";
import {SettingsRowInner} from "../settings/SettingsRowInner";
import {SettingsSpacer} from "../settings/SettingsSpacer";
import {Icon, MyActionsheet} from "kitcheningredients";
import {MyAlertProps} from "kitcheningredients/src/ignoreCoverage/KitchenHelper/helper/MyActionsheet";
import {useAppTranslation} from "../translations/AppTranslation";
import {MyTouchableOpacity} from "./MyTouchableOpacity";

export interface AppState{
	disabled?: boolean,
	accessibilityLabel: string,
	accessibilityRole?: string,
	style?: any
}
export const MyTouchableOpacityForNavigation: FunctionComponent<AppState> = ({disabled, accessibilityRole, accessibilityLabel, style ,...props}) => {

	const translationNavigateTo = useAppTranslation("navigateTo")
	const accessibilityLabelWithNavigation = translationNavigateTo+": "+accessibilityLabel;

	return(
		<MyTouchableOpacity accessibilityRole={"link"} accessibilityLabel={accessibilityLabelWithNavigation} disabled={disabled} style={style} {...props}>
			{props?.children}
		</MyTouchableOpacity>
	)

}
