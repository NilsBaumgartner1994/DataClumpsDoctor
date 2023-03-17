import React from "react";
import {useSynchedJSONState, DeviceHelper} from "kitcheningredients";
import {SynchedStateKeys} from "./synchedVariables/SynchedStateKeys";

export class DeviceInformationHelper {

	static useLocalDeviceInformation(): any{
		return useSynchedJSONState(SynchedStateKeys.SYNCHED_DeviceInformations);
	}

	static async getDeviceInformation(): Promise<any>{ // Promise<DeviceInformationType>
		const baseInformation = await DeviceHelper.getInformations();

		let informations = {
			...baseInformation,
		}

		return informations
	}

}
