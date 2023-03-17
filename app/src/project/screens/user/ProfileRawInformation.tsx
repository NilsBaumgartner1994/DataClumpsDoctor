// @ts-nocheck
import React, {FunctionComponent, useEffect, useRef, useState} from "react";
import {View, Text, useToast, ScrollView, Divider, useClipboard} from "native-base";
import {ConfigHolder, Icon} from "kitcheningredients";
import {useSynchedProfile} from "../../components/profile/ProfileAPI";
import {Share, TouchableOpacity} from "react-native";
import {AppTranslation} from "../../components/translations/AppTranslation";

interface AppState {

}
export const ProfileRawInformation: FunctionComponent<AppState> = (props) => {

    const [profile, setProfile] = useSynchedProfile();
    let stringifiedProfile = JSON.stringify(profile, null, 2);

    const user_instance = ConfigHolder.instance.getUser()
    const stringifiedUser = JSON.stringify(user_instance, null, 2);

    const toast = useToast();
    const clipboard = useClipboard();

    // corresponding componentDidMount
    useEffect(() => {

    }, [props?.route?.params])

    function renderCopyButton(name, content){
        return(
            <TouchableOpacity style={{flex: 1}} onPress={async () => {
                await clipboard.onCopy(content);
                toast.show({
                    description: "Copied"
                });
            }} >
                <View style={{padding: 10, backgroundColor: "orange", flexDirection: "row"}}>
                    <Icon name={"content-copy"} />
                    <View style={{width: 18}}></View>
                    <View><AppTranslation id={"copy"} /><Text>{" "+name}</Text></View>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={{width: "100%"}}>
            <View style={{paddingBottom: 30, justifyContent: "center", flexDirection: "row"}}>
                {renderCopyButton("Profile", stringifiedProfile)}
                <View style={{width: 30}}></View>
                {renderCopyButton("User", stringifiedUser)}
            </View>
            <Text fontSize={"2xl"}>{"User:"}</Text>
            <Text selectable={true}>{stringifiedUser}</Text>
            <Divider />
            <Text fontSize={"2xl"}>{"Profile:"}</Text>
            <Text selectable={true}>{stringifiedProfile}</Text>
        </View>
    )
}
