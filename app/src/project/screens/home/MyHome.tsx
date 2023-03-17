import React, {FunctionComponent, useEffect, useState} from "react";
import {Navigation, NavigatorHelper, useSynchedState} from "kitcheningredients";
import {View, Text} from "native-base";
import {useSynchedProfile} from "../../components/profile/ProfileAPI";

export const MyHome: FunctionComponent = (props) => {


	const [profile, setProfile] = useSynchedProfile();

	// corresponding componentDidMount
	useEffect(() => {
		//Navigation.navigateTo(FoodOfferList, {key: Math.random()});
	}, [props?.route?.params]);

	//NavigatorHelper.navigateWithoutParams(FoodOfferList, true, {});

	return(
		<View style={{width: "100%", height: "100%"}}>
			<Text>{"Loading"}</Text>
		</View>
	)
}
