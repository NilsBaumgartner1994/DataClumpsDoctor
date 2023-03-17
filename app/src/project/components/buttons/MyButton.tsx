import React, {FunctionComponent} from "react";
import {Text, View} from "native-base";
import {SettingsRowInner} from "../settings/SettingsRowInner";
import {Icon, MyActionsheet} from "kitcheningredients";
import {MyAlertProps} from "kitcheningredients/src/ignoreCoverage/KitchenHelper/helper/MyActionsheet";
import {MyTouchableOpacity} from "./MyTouchableOpacity";

export interface AppState{
	color?: string,
	accessibilityLabel: string,
	isSelected?: boolean,
	hideSelection?: boolean,
	activeColor?: string,
	onPress?: () => Promise<boolean | undefined>, // an async onPress function that returns a boolean or undefined
	onPressShowActionsheet?: [params: MyAlertProps, options?: any],
	element?: JSX.Element,
	icon?: JSX.Element,
	amount?: number,
	disabled?: boolean,
}
export const MyButton: FunctionComponent<AppState> = (props) => {

	const actionsheet = MyActionsheet.useActionsheet();

	// ToDo: Idea
	//			<ViewPercentageBorderradius style={{borderRadius: "5%", overflow: "hidden"}} >
	// 				<MyThemedBox _shadeLevel={disabledShadeLevel} >

	const defaultColor = "orange";
	let defaultActiveColor = "darkorange";
	if(props?.hideSelection) {
		defaultActiveColor = defaultColor;
	}

	let isSelected = props?.isSelected;

	let color = props?.color || defaultColor;
	let activeColor = props?.activeColor || defaultActiveColor;

	const actionsheetContent = props?.onPressShowActionsheet;
	const onPressMenu = props?.onPress;

	let amount = props?.amount;
	let amountText = "";
	if(amount!==undefined){
		amountText = " ("+amount+")";
	}

	let icon = props?.icon;
	let renderedIcon = null;
	if(!!icon){
		if(typeof icon === "string"){
			renderedIcon = <Icon name={icon} />
		} else {
			renderedIcon = icon;
		}
	}

	let additionalStyle = {};
	if(isSelected && !props?.hideSelection){
		let selectedStyle = {
			borderWidth: 2,
			borderColor: "white",
			backgroundColor: activeColor,
		}
		additionalStyle = selectedStyle;
	}

	return(
		<View style={{marginHorizontal: 5, marginVertical: 5}}>
				<MyTouchableOpacity accessibilityLabel={props?.accessibilityLabel} disabled={props?.disabled} style={[{borderColor: "transparent", borderWidth: 2,justifyContent: "center", backgroundColor: color, borderRadius: 10}, additionalStyle]}
								  onPress={async () => {
									  if(actionsheetContent){
										  const params = actionsheetContent[0];
										  const options = actionsheetContent[1];
										  actionsheet.show(params, options);
									  } else {
										  if(onPressMenu){
											  await onPressMenu();
										  }
									  }
								  }}
				>
					<SettingsRowInner flex={1} leftContent={props?.children
					} leftIcon={renderedIcon} rightIcon={<Text>{amountText}</Text>} />
				</MyTouchableOpacity>
		</View>
	)

}
