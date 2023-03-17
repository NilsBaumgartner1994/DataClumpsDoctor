import React, {FunctionComponent, useState} from "react";
import {Text, Tooltip, View} from "native-base";
import {TouchableOpacity} from "react-native";
import {SettingsRowInner} from "../settings/SettingsRowInner";
import {SettingsSpacer} from "../settings/SettingsSpacer";
import {Icon, MyActionsheet} from "kitcheningredients";
import {MyAlertProps} from "kitcheningredients/src/ignoreCoverage/KitchenHelper/helper/MyActionsheet";
import {useAppTranslation} from "../translations/AppTranslation";

export interface AppState{
	disabled?: boolean,
	accessibilityLabel: string,
	accessibilityRole?: string,
	style?: any
}
export const MyTouchableOpacity: FunctionComponent<AppState> = ({disabled, accessibilityRole, accessibilityLabel, style ,...props}) => {

	let mergedStyle = []
	if(Array.isArray(style)){
		mergedStyle = style
	} else {
		mergedStyle.push(style)
	}
	if(disabled){
		mergedStyle.push({
			cursor: "not-allowed",
			opacity: 0.5
		});
	}



	return(
		<Tooltip label={accessibilityLabel} >
			<TouchableOpacity accessibilityRole={accessibilityRole ?? 'button'} accessibilityLabel={accessibilityLabel} disabled={disabled} style={mergedStyle} {...props}>
				{props?.children}
			</TouchableOpacity>
		</Tooltip>
	)

}
