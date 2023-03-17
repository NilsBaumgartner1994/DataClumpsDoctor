import React, {FunctionComponent, useEffect, useState} from "react";
import {Input, Text, View} from "native-base";
import Rectangle from "../../helper/Rectangle";
import {FoodImage} from "./FoodImage";
import {StringHelper} from "../../helper/StringHelper";
import {TouchableWithFeedback} from "../TouchableWithFeedback";
import {NavigatorHelper} from "kitcheningredients";
import {FoodDetails} from "../../screens/food/FoodDetails";
import {Dimensions} from "react-native";
import {ParentDimension} from "../../helper/ParentDimension";
import {Foodoffers, Foods} from "../../directusTypes/types";
import {FormatedPriceText} from "./FormatedPriceText";
import {ViewPixelRatio} from "../../helper/ViewPixelRatio";
import {MyThemedBox} from "kitcheningredients";
import {FoodRatingSingle} from "./foodfeedback/foodrating/FoodRatingSingle";
import {FoodFeedbackAPI} from "./foodfeedback/FoodFeedbackAPI";
import {FoodRatingConstant} from "./foodfeedback/foodrating/FoodRatingConstant";
import {DefaultComponentBorderColors} from "./DefaultComponentBorderColors";
import {ViewPercentageBorderradius} from "../../helper/ViewPercentageBorderradius";


interface AppState {
	hideBottomPartAndQuickRate?: boolean,
	borderRadius?: string | number,
	borderWidth?: number,
	borderColor?: string,
	like?: boolean,
	dislike?: boolean,
}
export const DetailsCardBorder: FunctionComponent<AppState> = (props) => {

	let overlayBorderWidth = 2;
	if(props?.borderWidth !== undefined && props?.borderWidth !== null){
		overlayBorderWidth = props?.borderWidth;
	}

	const borderOverlayStyle = {
		height: "100%",
		width: "100%",
		position: "absolute",
		borderRadius: props?.borderRadius,
		borderBottomLeftRadius: props?.borderRadius,
		borderBottomRightRadius: props?.borderRadius,
		pointerEvents: "box-none", //for web PointerEvents is a style not a prop
		borderWidth: overlayBorderWidth,
        borderColor: "transparent"
	}

	if(props?.hideBottomPartAndQuickRate){
		borderOverlayStyle.borderBottomLeftRadius = 0;
		borderOverlayStyle.borderBottomRightRadius = 0;
	}

	if(!!props?.borderColor){
		borderOverlayStyle.borderColor = props?.borderColor;
	}
	if(props?.like === true){
		borderOverlayStyle.borderColor = DefaultComponentBorderColors.like;
	}
	if(props?.dislike === true){
		borderOverlayStyle.borderColor = DefaultComponentBorderColors.dislike;
	}

	// in react-native PointerEvents is a prop not a style
	return(
		<ViewPercentageBorderradius style={borderOverlayStyle} pointerEvents="box-none" />
	)
}
