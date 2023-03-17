import React, {FunctionComponent, useEffect, useState} from "react";

import * as RNLocalize from "react-native-localize";
import {DirectusTranslationHelper} from "../../components/translations/DirectusTranslationHelper";
import {ProfileAPI} from "../../components/profile/ProfileAPI";

export class SetupLanguageHelper {

	static getUsersInstalledLanguages(){
		let userPreferredLocales = RNLocalize.getLocales(); //get preferred locales of the user
		return userPreferredLocales || [];
	}

	static getUsersInstalledLanguageCodes(){
		let preferedLocales = SetupLanguageHelper.getUsersInstalledLanguages();
		let codes = [];
		for(let i=0; i<preferedLocales.length; i++){
			let preferedLocale = preferedLocales[i];
			let languageCode = preferedLocale.languageTag; // !languageCode would be "de" where we want languageTag "de-DE"
			codes.push(languageCode);
		}
		return codes;
	}

	static doesSelectedLanguageExistInLanguages(profileLanguage, availableLanguageDict){
		return !!availableLanguageDict[profileLanguage];
	}

	static getClosesLangCode(langCode, availableLanguageDict){
		let availableLangCodes = Object.keys(availableLanguageDict);
		if(!!langCode){ // e. G. langCode = "de-US" or "de-DE"
			let firstPart = langCode.split("-")[0]; // e. G. de
			for(let i=0; i<availableLangCodes.length; i++){
				let availableLangCode = availableLangCodes[i]; // e. G. "de-DE"
				if(availableLangCode.startsWith(firstPart)){ //
					return availableLangCode;
				}
			}
		}
		return false;
	}

	static getBestLanguageCodeForUser(usersInstalledLanguageCodes, availableLanguageDict){
		let defaultLanguageCode = DirectusTranslationHelper.DEFAULT_LANGUAGE_CODE;

		let bestOptionForUser = undefined;
		for(let i=0; i<usersInstalledLanguageCodes.length; i++){ //loop all languages user knows
			let usersInstalledLanguageCode = usersInstalledLanguageCodes[i];
			let closesLangCode = SetupLanguageHelper.getClosesLangCode(usersInstalledLanguageCode, availableLanguageDict)
			if(!!closesLangCode){ //is users language known by the server
				if(!bestOptionForUser){ //if no best option found yet
					bestOptionForUser = closesLangCode; //we save it
				} else if(closesLangCode!==defaultLanguageCode) { //if we have an option but the new language is not english
					bestOptionForUser = closesLangCode; //we replace it
				}
			}
		}
		return bestOptionForUser;
	}

	static getAvailableLanguageCodeDict(availableLanguages){
		let langCodeDict = {};
		for(let i=0; i<availableLanguages.length; i++){
			let availableLanguage = availableLanguages[i]; // {code: "de-DE", name: "German"}
			let languageCode = availableLanguage.code; // "de-DE"
			langCodeDict[languageCode] = languageCode;
		}
		return langCodeDict;
	}

	static getNewProfileWithDefaultLanguageSet(profile, availableLanguages){
		let profileCopy = {...profile};
		//console.log("setDefaultLanguage");
		let profileLanguage = profile[ProfileAPI.getLanguageFieldName()];
		let availableLanguageDict = SetupLanguageHelper.getAvailableLanguageCodeDict(availableLanguages);

		if(!profileLanguage || !SetupLanguageHelper.doesSelectedLanguageExistInLanguages(profileLanguage, availableLanguageDict)){
			//console.log("No available language selected")
			let usersInstalledLanguageCodes = SetupLanguageHelper.getUsersInstalledLanguageCodes();
			//console.log("usersInstalledLanguageCodes");
			//console.log(usersInstalledLanguageCodes);
			let bestLanguageCodeForUser = SetupLanguageHelper.getBestLanguageCodeForUser(usersInstalledLanguageCodes, availableLanguageDict)
			//console.log("bestLanguageCodeForUser");
			//console.log(bestLanguageCodeForUser)
			if(!!bestLanguageCodeForUser){
				profileCopy[ProfileAPI.getLanguageFieldName()] = bestLanguageCodeForUser;
			}
		}
		return profileCopy;
	}

}
