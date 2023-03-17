import React, {FunctionComponent} from "react";
import {NotificationIcon} from "./NotificationIcon";
import {NotificationHelperComponentRemote} from "./helper/NotificationHelperComponentRemote";
import {PlatformHelper} from "kitcheningredients";
import {NotificationHelperComponentLocal} from "./helper/NotificationHelperComponentLocal";

export interface AppState{
	accountRequired?: boolean;
	localNotificationKey?: string;
	localNotificationEnabledNative?: boolean;
	localNotificationEnabledWeb?: boolean;
	getNotificationMessageObject?: () => any;
	style?: any;
}
export const NotificationItem: FunctionComponent<AppState> = (props) => {

	const localNotificationKey = props.localNotificationKey || "";

	// native: local notification
	// native: push notification
	// web: local notification?
	// web: mail notification?

	const isWebAndShowLocalNotification = PlatformHelper.isWeb() && props?.localNotificationEnabledWeb;
	const isNativeAndShowLocalNotification = PlatformHelper.isSmartPhone() && props?.localNotificationEnabledNative;
	const showLocalNotification = isWebAndShowLocalNotification || isNativeAndShowLocalNotification;

	if(!!localNotificationKey && showLocalNotification){
			return (
				<NotificationHelperComponentLocal localNotificationKey={localNotificationKey} getNotificationMessageObject={props?.getNotificationMessageObject} style={props?.style}>
					{props.children}
				</NotificationHelperComponentLocal>
			)
	}

	return(
		<NotificationHelperComponentRemote accountRequired={props?.accountRequired}>
			<NotificationIcon active={false} />
		</NotificationHelperComponentRemote>
	)
}
