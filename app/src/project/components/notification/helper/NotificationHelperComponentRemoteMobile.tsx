import {ConfigHolder, MyActionsheet, PlatformHelper} from "kitcheningredients";
import React, {FunctionComponent} from "react";
import {Text, View} from "native-base";
import {useSynchedSettingsNotifications} from "../../../helper/synchedJSONState";
import {AppTranslation} from "../../translations/AppTranslation";
import {TouchableOpacityIgnoreChildEvents} from "../../../helper/overlay/TouchableOpacityIgnoreChildEvents";
import {SystemActionHelper} from "../../../helper/SystemActionHelper";
import {AnimationNotificationBell} from "../../animations/AnimationNotificationBell";
import {DeviceInformationHelper} from "../../../helper/DeviceInformationHelper";
import {NotificationHelper} from "../../../helper/notification/NotificationHelper";

export type NotificationHelperComponentProps = {

}
export const NotificationHelperComponentRemoteMobile: FunctionComponent<NotificationHelperComponentProps> = (props) => {

    const [notificationSettings, setNotificationSettings] = useSynchedSettingsNotifications()
    const [notificationObj, setNotificationObj] = NotificationHelper.useNotificationPermission();
    const [deviceInformation, setDeviceInformation] = DeviceInformationHelper.useLocalDeviceInformation();
    const isSimulator = deviceInformation?.isSimulator;

    const serverEnabledNotifications = PlatformHelper.isIOS() ? notificationSettings?.ios_enabled : notificationSettings?.android_enabled;
    const platformName = PlatformHelper.getPlatformDisplayName();

    const user = ConfigHolder.instance.getUser();
    const actionsheet = MyActionsheet.useActionsheet();

    let actionsheetOptions = {};

    const notificationTokenSet = !!notificationObj?.pushtokenObj?.data;
    const deviceSupportsNotification = !isSimulator;
    const permissionExplicitlyDenied = NotificationHelper.isDeviceNotificationPermissionDenied(notificationObj);
    const permissionUndetermined = NotificationHelper.isDeviceNotificationPermissionUndetermined(notificationObj);

    function renderTouchable(actionsheetOptions, withoutOpacity = false){
        return (
            <TouchableOpacityIgnoreChildEvents
                useDefaultOpacity={!withoutOpacity}
                onPress={() => {
                    actionsheet.show(actionsheetOptions);
                }}
            >
                {props.children}
            </TouchableOpacityIgnoreChildEvents>
        )
    }

    if(!serverEnabledNotifications){
        actionsheetOptions = {
            title: "Notification",
            acceptLabel: "Sorry",
            cancelLabel: <AppTranslation id={"cancel"} />,
            renderDescription: () => {
                return(
                    <View>
                        <AnimationNotificationBell />
                        <Text>{"TODO: We currently dont support notifications for: "+platformName}</Text>
                    </View>
                )
            }
        }

        return renderTouchable(actionsheetOptions);
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
        return renderTouchable(actionsheetOptions);
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
        return renderTouchable(actionsheetOptions);
    }

    if(notificationTokenSet){
        return (
            <>
                {props.children}
            </>
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
            return renderTouchable(actionsheetOptions, true);
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
            return renderTouchable(actionsheetOptions, true);
        }
    }

    return null;

}
