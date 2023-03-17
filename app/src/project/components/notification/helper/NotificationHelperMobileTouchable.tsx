import {MyActionsheet} from "kitcheningredients";
import React, {FunctionComponent} from "react";
import {Text, View} from "native-base";
import {AppTranslation} from "../../translations/AppTranslation";
import {TouchableOpacityIgnoreChildEvents} from "../../../helper/overlay/TouchableOpacityIgnoreChildEvents";
import {SystemActionHelper} from "../../../helper/SystemActionHelper";
import {AnimationNotificationBell} from "../../animations/AnimationNotificationBell";
import {DeviceInformationHelper} from "../../../helper/DeviceInformationHelper";
import {NotificationHelper} from "../../../helper/notification/NotificationHelper";
import {TouchableOpacity} from "react-native";

export type NotificationHelperComponentProps = {
    onPress?: () => any;
    style?: any;
}
export const NotificationHelperMobileTouchable: FunctionComponent<NotificationHelperComponentProps> = (props) => {

    const [notificationObj, setNotificationObj] = NotificationHelper.useNotificationPermission();
    const [deviceInformation, setDeviceInformation] = DeviceInformationHelper.useLocalDeviceInformation();
    const isSimulator = deviceInformation?.isSimulator;

    const touchableStyle = props?.style;

    const actionsheet = MyActionsheet.useActionsheet();

    let actionsheetOptions = {};

    const notificationTokenSet = !!notificationObj?.pushtokenObj?.data;
    const deviceSupportsNotification = !isSimulator;
    const permissionExplicitlyDenied = NotificationHelper.isDeviceNotificationPermissionDenied(notificationObj);
    const permissionUndetermined = NotificationHelper.isDeviceNotificationPermissionUndetermined(notificationObj);

    function renderTouchableActionSheet(actionsheetOptions, withoutOpacity = false){
        return (
            <TouchableOpacityIgnoreChildEvents style={touchableStyle}
                useDefaultOpacity={!withoutOpacity}
                onPress={() => {
                    actionsheet.show(actionsheetOptions);
                }}
            >
                {props.children}
            </TouchableOpacityIgnoreChildEvents>
        )
    }

    if(!deviceSupportsNotification){
        actionsheetOptions = {
            title: "Notification",
            acceptLabel: "Sorry",
            cancelLabel: <AppTranslation id={"cancel"} />,
            renderDescription: () => {
                return(
                    <View>
                        <AnimationNotificationBell />
                        <Text>{"TODO: Your device does not support notifications."}</Text>
                    </View>
                )
            }
        }
        return renderTouchableActionSheet(actionsheetOptions);
    }

    if(permissionExplicitlyDenied){
        actionsheetOptions = {
            title: "Notification",
            onAccept: () => {
                SystemActionHelper.mobileSystemActionHelper.openSystemAppSettings()
            },
            acceptLabel: "Open Settings",
            cancelLabel: <AppTranslation id={"cancel"} />,
            renderDescription: () => {
                return(
                    <View>
                        <AnimationNotificationBell />
                        <Text>{"TODO: Please allow Notifications in your system settings"}</Text>
                    </View>
                )
            }
        }
        return renderTouchableActionSheet(actionsheetOptions);
    }

    if(notificationTokenSet){
        return (
            <TouchableOpacity style={touchableStyle} onPress={async () => {
                if(props?.onPress){
                    await props.onPress();
                }
            }}>
                {props.children}
            </TouchableOpacity>
        )
    } else {
        if(permissionUndetermined){
            actionsheetOptions = {
                title: "Notification",
                onAccept: async () => {
                    await NotificationHelper.requestDeviceNotificationPermission();
                    let newNotificationObj = await NotificationHelper.loadDeviceNotificationPermission();
                    setNotificationObj(newNotificationObj);
                },
                acceptLabel: "Okay!",
                cancelLabel: <AppTranslation id={"cancel"} />,
                renderDescription: () => {
                    return(
                        <View>
                            <AnimationNotificationBell />
                            <Text>{"TODO: Before we can notify you, we need your permission :-)"}</Text>
                        </View>
                    )
                }
            }
            return renderTouchableActionSheet(actionsheetOptions, true);
        } else {
            actionsheetOptions = {
                title: "Notification",
                onAccept: async () => {

                },
                acceptLabel: "Hmmm?",
                cancelLabel: <AppTranslation id={"cancel"} />,
                renderDescription: () => {
                    return(
                        <View>
                            <AnimationNotificationBell />
                            <Text>{"Please be patient. We are issuing to receive information for push notifications"}</Text>
                        </View>
                    )
                }
            }
            return renderTouchableActionSheet(actionsheetOptions, true);
        }
    }

    return null;

}
