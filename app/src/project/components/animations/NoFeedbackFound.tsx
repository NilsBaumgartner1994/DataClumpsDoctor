// @ts-nocheck
import React, {useEffect, useState} from "react";
import Rectangle from "../../helper/Rectangle";
import {CrossLottie, Layout} from "kitcheningredients";
import {useBreakpointValue, View, Text} from "native-base";
import notFound from "../../assets/noFeedbackFound.json";
import {AppTranslation} from "../translations/AppTranslation";

export const NoFeedbackFound = ({children,...props}: any) => {

	const noFoundWidths = {
		base: "100%",
		md: Layout.WIDTH_MD*0.7,
		lg: Layout.WIDTH_LG*0.6,
		xl: Layout.WIDTH_XL*0.5
	}
	const noFoundWidth = useBreakpointValue(noFoundWidths);

	return (
		<View style={{width: "100%", alignItems: "center"}}>
			<View style={{height: 30}}></View>
			<AppTranslation id={"noFeedbacksFound"} />
			<View style={{width: noFoundWidth}}>
				<Rectangle>
					<CrossLottie source={notFound} flex={1} />
				</Rectangle>
			</View>
		</View>
	)
}
