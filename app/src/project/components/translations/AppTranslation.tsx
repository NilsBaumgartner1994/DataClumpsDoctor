import React, {FunctionComponent, useEffect, useState} from "react";
import {useDirectusTranslation} from "./DirectusTranslationUseFunction";
import {useSynchedAppTranslations} from "../../helper/synchedJSONState";
import {Text, useContrastText} from "native-base";
import {useBackgroundColor} from "kitcheningredients";

interface AppState {
	id: string;
	params?: any;
	prefix?: string;
	postfix?: string;
	ignoreFallbackLanguage?: boolean;
	backgroundColor?: string;
	color?: string;
}
export const AppTranslation: FunctionComponent<AppState> = ({id, params, postfix, ignoreFallbackLanguage, prefix, children, backgroundColor, color, ...rest}) => {
	const content = useAppTranslation(id, ignoreFallbackLanguage, params);
	const dynamicBackgroundColor = useBackgroundColor()
	const contrastColor = useContrastText(backgroundColor || dynamicBackgroundColor);
	const dynamicColor = color || contrastColor;
	return <Text color={dynamicColor} {...rest} >{prefix}{content}{postfix}</Text>
}

export function useAppTranslationMarkdown(id, ignoreFallbackLanguage?, params?){
	return useAppTranslationRaw(id, "markdown", ignoreFallbackLanguage, params);
}

export function useAppTranslation(id, ignoreFallbackLanguage?, params?): string {
	return useAppTranslationRaw(id, "content", ignoreFallbackLanguage, params);
}

export function useAppTranslationRaw(id, field, ignoreFallbackLanguage?, params?): string {
	const [remoteAppTranslations, setRemoteAppTranslations] = useSynchedAppTranslations();
	let translations = [];
	if(!!remoteAppTranslations){
		let appTranslation = remoteAppTranslations[id];
		translations = appTranslation?.translations || [];
	}

	let content = useDirectusTranslation(translations, field, ignoreFallbackLanguage);
	if(!!params){
		let keys = Object.keys(params);
		for(let key of keys){
			let value = params[key];
			content = content.replace(key, value);
		}
	}

	return content;
}
