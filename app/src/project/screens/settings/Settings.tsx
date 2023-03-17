// @ts-nocheck
import React, {FunctionComponent, useEffect} from "react";
import {View} from "native-base";
import {SettingsRowNavigator} from "../../components/settings/SettingsRowNavigator";
import {SettingsSpacer} from "../../components/settings/SettingsSpacer";
import {SettingsRowThemeSwitch} from "../../components/settings/SettingsRowThemeSwitch";
import {Users} from "../user/Users";
import {UsersAvatar} from "../user/UsersAvatar";
import {ConfigHolder} from "kitcheningredients";
import {SettingsRowSynchedBooleanSwitch} from "../../components/settings/SettingsRowSynchedBooleanSwitch";
import {SettingsProfileLanguageComponent} from "../../components/settings/SettingsProfileLanguageComponent";
import {AppTranslation, useAppTranslation} from "../../components/translations/AppTranslation";
import {StorageKeys} from "../../helper/synchedVariables/StorageKeys";
import {useDebugMode} from "../../helper/synchedJSONState";
import {DebugIcon} from "../../components/icons/DebugIcon";
import {DemoIcon} from "../../components/icons/DemoIcon";

interface AppState {

}
export const Settings: FunctionComponent<AppState> = (props) => {

    let userInstance = ConfigHolder.instance.getUser();
    const [debug, setDebug] = useDebugMode();

    // corresponding componentDidMount
    useEffect(() => {

    }, [props?.route?.params])

    function renderAccountRow(){
        if(!!userInstance){
            return <SettingsRowNavigator accessibilityLabel={useAppTranslation("account")} destinationComponent={Users} leftContent={<AppTranslation id={"account"} />} leftIcon={<UsersAvatar />} />
        }
        return null;
    }

    function renderDemoModeSetting(){
        if(debug){
            return <SettingsRowSynchedBooleanSwitch accessibilityLabel={useAppTranslation("demoMode")} variable={StorageKeys.CACHED_DEMO_MODE} leftContent={<AppTranslation id={"demoMode"} />} leftIcon={<DemoIcon />} />
        }
    }

  return (
      <View style={{width: "100%"}}>
          {renderAccountRow()}
          <SettingsSpacer />
          <SettingsProfileLanguageComponent />
          <SettingsRowThemeSwitch />
          <SettingsSpacer />
          <SettingsRowSynchedBooleanSwitch accessibilityLabel={useAppTranslation("debugMode")} variable={StorageKeys.CACHED_DEBUG_MODE} onPress={(debugMode) => {
              ConfigHolder.instance.reload()
          }} leftContent={<AppTranslation id={"debugMode"} />} leftIcon={<DebugIcon />} />
          {renderDemoModeSetting()}
      </View>
  )
}
