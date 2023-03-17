const demoPizza = require("./../../assets/demoImages/demoFoods/demoPizza.jpeg")
const demoNoodle = require("./../../assets/demoImages/demoFoods/demoNoodle.jpeg")
const demoSalad = require("./../../assets/demoImages/demoFoods/demoSalad.jpeg")

import React from "react";
import {Image, View} from "native-base";

export class CollectionImageDev {

	static renderRemoteImage(imageURL, children){
		return CollectionImageDev.renderImage({uri: imageURL}, children);
	}

	static renderImage(source, children){
		return(
			<View style={{ width: '100%', height: '100%' }}>
				<Image source={source} alt={""} style={{ width: '100%', height: '100%' }}
				/>
				{children}
			</View>
		)
	}

	static getImageFromListById(itemId: number, list: any[]){
		return list[itemId%list.length];
	}

	static renderLocalImage(collection, item, children){
		let imageURL = null;

		let itemId = item?.id;
		if(collection==="foods" && item && itemId){
			imageURL = "https://swosy.sw-os.de:3001/api/foods/"+itemId+"/photos?resTag=medium";
			let foodImage = CollectionImageDev.getImageFromListById(itemId, [demoNoodle, demoPizza, demoSalad])
			return CollectionImageDev.renderImage(foodImage, children);
		}

		if(imageURL){
			return CollectionImageDev.renderRemoteImage(imageURL, children);
		} else {
			return null;
		}
	}

}
