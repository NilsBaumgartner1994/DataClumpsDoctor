import React, {FunctionComponent} from "react";
import {ViewPixelRatio} from "../../helper/ViewPixelRatio";
import {View} from "native-base";
import {ImageOverlayPosition} from "../imageOverlays/ImageOverlays";
import {ImageOverlayPaddingStyle} from "../imageOverlays/ImageOverlay";

interface AppState {
	width?: number,
	position?: ImageOverlayPosition,
	withouthPadding?: boolean,
	backgroundColor?: string
}
export const DefaultComponentCardOverlayBox: FunctionComponent<AppState> = (props) => {

	const width = props?.width;

	let borderRadius = getBorderRadius(width);

	function getBorderRadius(width){
		return width ? Math.round(width*0.05) : 0;
	}

	function getPositionStyle(position: ImageOverlayPosition){
		let style = {};
		if(props?.position === ImageOverlayPosition.TOP_LEFT){
			style = {
				borderTopRightRadius: borderRadius,
				borderBottomRightRadius: borderRadius,
				paddingLeft: borderRadius/4,
			}
		}
		if(props?.position === ImageOverlayPosition.TOP_RIGHT){
			style = {
				borderTopLeftRadius: borderRadius,
				borderBottomLeftRadius: borderRadius,
				paddingRight: borderRadius/4,
			}
		}
		if(props?.position === ImageOverlayPosition.BOTTOM_LEFT){
			style = {
				borderTopRightRadius: borderRadius,
				borderBottomRightRadius: borderRadius,
				paddingLeft: borderRadius/4,
			}
		}
		if(props?.position === ImageOverlayPosition.BOTTOM_RIGHT){
			style = {
				borderTopLeftRadius: borderRadius,
				borderBottomLeftRadius: borderRadius,
				paddingRight: borderRadius/4,
			}
		}
		return style;
	}

	const position = props?.position;
	const positionStyle = getPositionStyle(position);

	const withouthPadding = props?.withouthPadding;

	function renderContent(content){
		if(withouthPadding){
			return content;
		}
		return <View style={ImageOverlayPaddingStyle}>{content}</View>
	}

	const backgroundColor = props?.backgroundColor || "orange";

	return (
		<ViewPixelRatio style={{flexDirection: "row", justifyContent: "center", backgroundColor: backgroundColor, alignItems: "flex-end", ...positionStyle}}>
			{renderContent(
				<View style={[{flexDirection: "row"}]}>
					{props.children}
				</View>
			)}
		</ViewPixelRatio>
	)

}
