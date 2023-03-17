// @ts-nocheck
import React, {FunctionComponent, useEffect, useRef, useState} from "react";
import {Icon, MyActionsheet, MyThemedBox, ServerAPI} from "kitcheningredients";
import {ProfileAPI, useSynchedProfile} from "../../components/profile/ProfileAPI";

import {SettingsRow} from "../../components/settings/SettingsRow";
import {useSynchedDirectusLanguage} from "../../helper/synchedJSONState";
import {ScrollView, View, Text} from "native-base";
import {useAppTranslation} from "../translations/AppTranslation";

interface AppState {
    onChange?: (value: string) => void;
}
export const SettingsProfileLanguageComponent: FunctionComponent<AppState> = (props) => {

    const actionsheet = MyActionsheet.useActionsheet();
    const [profile, setProfile] = useSynchedProfile();
    const profilesLanguageCode = profile[ProfileAPI.getLanguageFieldName()];
    const [directusLanguages, setDirectusLanguages] = useSynchedDirectusLanguage();
    const languageTitle = useAppTranslation("language");
    const translationEdit = useAppTranslation("edit");

    const languageOptions = {}
    if(!!directusLanguages){
        for(let directusLanguage of directusLanguages){
            languageOptions[directusLanguage?.code] = {
                label: directusLanguage.name,
            }
        }
    }

    let profilesLanguageName = null;
    if(!!languageOptions[profilesLanguageCode]){
        profilesLanguageName = languageOptions[profilesLanguageCode].label;
    }
    let profileSelectedLanguageName = profilesLanguageName || profilesLanguageCode;

    function onSelectLanguage(language){
        profile[ProfileAPI.getLanguageFieldName()] = language;
        setProfile(profile);
    }

  return (
          <SettingsRow
              accessibilityLabel={translationEdit+": "+languageTitle + " " + profileSelectedLanguageName}
              onPress={() => {
              actionsheet.show({
                  title: "Select language",
                  onOptionSelect: onSelectLanguage,
              }, languageOptions);
          }} leftContent={languageTitle} rightContent={profileSelectedLanguageName} leftIcon={<Icon name={"translate"}  />} />
  )
}
