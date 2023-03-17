import React, {FunctionComponent, useState} from "react";
import {Icon} from "kitcheningredients";

export interface AppState{
	active?: boolean;

}
export const NotificationIcon: FunctionComponent<AppState> = ({active, ...props}) => {

	const iconName = active ? "bell" : "bell-off";
	return <Icon name={iconName} {...props} />
}
