import React, {FunctionComponent} from "react";
import {NotificationHelperComponentRemoteWeb} from "./NotificationHelperComponentRemoteWeb";
import {NotificationHelperComponentRemoteMobile} from "./NotificationHelperComponentRemoteMobile";
import {ConfigHolder, PlatformHelper} from "kitcheningredients";
import {useSynchedProfile} from "../../profile/ProfileAPI";
import {AccountRequiredComponent} from "../../../helper/AccountRequiredComponent";

export type NotificationHelperComponentProps = {
    accountRequired?: boolean;
}
export const NotificationHelperComponentRemote: FunctionComponent<NotificationHelperComponentProps> = (props) => {

    const user = ConfigHolder.instance.getUser();
    const [profile, setProfile] = useSynchedProfile();

    const accountRequired = props.accountRequired ?? true; // default to true if not set explicitly to false

    if(accountRequired){
        if(user.isGuest || !profile?.id){ // guests dont have provided a mail, so they cant be notified
            return(
                <AccountRequiredComponent>
                    {props.children}
                </AccountRequiredComponent>
            )
        }
    }

    if(PlatformHelper.isWeb()){
        return (
            <NotificationHelperComponentRemoteWeb>
                {props.children}
            </NotificationHelperComponentRemoteWeb>
        )
    } else {
       return(
           <NotificationHelperComponentRemoteMobile>
               {props.children}
           </NotificationHelperComponentRemoteMobile>
       )
    }

}
