import {useColorModeValue, useToken} from "native-base";
import {ConfigHolder} from "kitcheningredients";

export class ColorHelper{

    static useBackgroundColor(){
        const [lightBg, darkBg] = useToken(
            'colors',
            [ConfigHolder.styleConfig.backgroundColor.light, ConfigHolder.styleConfig.backgroundColor.dark],
            'blueGray.900',
        );
        const bgColor = useColorModeValue(lightBg, darkBg);
        return bgColor;
    }

}