import {MyActionsheet} from "kitcheningredients";
import React, {FunctionComponent} from "react";
import {Text, View} from "native-base";
import {useSynchedSettingsNotifications} from "../../../helper/synchedJSONState";
import {AppTranslation} from "../../translations/AppTranslation";
import {TouchableOpacityIgnoreChildEvents} from "../../../helper/overlay/TouchableOpacityIgnoreChildEvents";
import {AnimationNotificationBell} from "../../animations/AnimationNotificationBell";

export type NotificationHelperComponentProps = {
    onPress?: () => any;
}
export const NotificationHelperComponentRemoteWeb: FunctionComponent<NotificationHelperComponentProps> = (props) => {

    const [notficationSettings, setNotficationSettings] = useSynchedSettingsNotifications()
    const actionsheet = MyActionsheet.useActionsheet();
    const server_notification_email = notficationSettings?.email_enabled;

    let actionsheetOptions = {};

    function renderTouchable(actionsheetOptions, withoutOpacity = false){
        return (
            <TouchableOpacityIgnoreChildEvents
                useDefaultOpacity={!withoutOpacity}
                onPress={() => {
                actionsheet.show(actionsheetOptions);
            }}>
                    {props.children}
            </TouchableOpacityIgnoreChildEvents>
        )
    }

    if(!server_notification_email || true){
        actionsheetOptions = {
            title: "Notification",
            acceptLabel: "Sorry",
            cancelLabel: <AppTranslation id={"cancel"} />,
            renderDescription: () => {
                return(
                    <View>
                        <AnimationNotificationBell />
                        <Text>{"TODO: We currently dont support email notifications."}</Text>
                    </View>
                )
            }
        }
        return renderTouchable(actionsheetOptions);
    } else {
        return (
            <>
                {props.children}
            </>
        )
    }
}
