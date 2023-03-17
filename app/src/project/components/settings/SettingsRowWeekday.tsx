import React, {FunctionComponent} from "react";
import {Text, View} from "native-base";
import {Icon, MyActionsheet} from "kitcheningredients";
import {DateHelper, Weekday} from "../../helper/DateHelper";
import {SettingsRow} from "./SettingsRow";
import {useAppTranslation} from "../translations/AppTranslation";

interface AppState {
	locale: string,
	weekday: Weekday,
	description: any,
	onChange: (newWeekday: Weekday) => void,
}
export const SettingsRowWeekday: FunctionComponent<AppState> = (props) => {

	const description = props?.description || "weekday";
	const weekday = props?.weekday || Weekday.MONDAY;

	const actionsheet = MyActionsheet.useActionsheet();

	let translationEdit = useAppTranslation("edit") || "";
	// capitalise first letter
	translationEdit = translationEdit.charAt(0).toUpperCase() + translationEdit.slice(1);

	const locale = props?.locale || "en-US";
	const translatedFirstDayOfWeek = DateHelper.getWeekdayTranslationByWeekday(weekday, locale);
	const weekdayEnumValues = DateHelper.getWeekdayEnumsValues();
	const firstDayOfWeekOptions = {}
	for(let weekdayEnumValue of weekdayEnumValues){
		firstDayOfWeekOptions[weekdayEnumValue] = {
			label: DateHelper.getWeekdayTranslationByWeekday(weekdayEnumValue, locale),
		}
	}

	function onSelectFirstDayOfWeek(key){
		if(props.onChange){
			props.onChange(key);
		}
	}

	return(
			<SettingsRow
				accessibilityLabel={translationEdit+": "+description}
				onPress={() => {
				try{
					actionsheet.show({
						title: description,
						onOptionSelect: onSelectFirstDayOfWeek,
					}, firstDayOfWeekOptions);
				} catch (e) {
					//console.log(e);
				}
			}} leftContent={description} rightContent={translatedFirstDayOfWeek} leftIcon={<Icon name={"calendar-arrow-right"}  />} />
	)
}
