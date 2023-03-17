// @ts-nocheck
import React, {FunctionComponent, useEffect, useRef, useState} from "react";
import {Input, Text, View} from "native-base";
import {Icon, useThemeTextColor} from "kitcheningredients";
import {SettingsRow} from "../../components/settings/SettingsRow";
import {ParentSpacer} from "../../helper/ParentSpacer";
import {SaveIcon} from "../icons/SaveIcon";
import {MyButton} from "../buttons/MyButton";

interface AppState {
    icon?: any;
    initialValue?: number;
    emptyValue?: number;
    description?: string;
    placeholder?: string;
    onChange?: (value: number) => boolean;
    saveText?: any;
    cancelText?: any;
}
export const SettingsRowNumberEditComponent: FunctionComponent<AppState> = (props) => {

    const textColor = useThemeTextColor();
    const [editText, setEditText] = useState(false);
    const [loading, setLoading] = useState(false);
    const initialValue = props.initialValue || "";
    const description = props.description || "";
    const [textValue, textTextValue] = useState(initialValue);
    const textInput = useRef(null);
    const shownValueInNoEdit = initialValue || props?.emptyValue;

    let accessibilityLabel = description+": "+shownValueInNoEdit;

    //load user with corresponding profile?

    // corresponding componentDidMount
    useEffect(() => {
        if(editText){
            textInput.current.focus()

        }
    }, [props?.route?.params, editText])

    async function handleSave() {
        //console.log("ROW: save")
        let asNumber = parseFloat(textValue);
        if(isNaN(asNumber)){
            asNumber = undefined;
        }

        let success = await props.onChange(asNumber);
        //console.log("ROW: save success: " + success)
        if(success) {
            setEditText(false);
            textTextValue(asNumber || "")
        }
        setLoading(false);
    }

    // corresponding componentDidMount
    useEffect(() => {
        if(loading){
            handleSave();
        }
    }, [loading])

    function renderContent(){
        let textPlaceholder = <View style={{flexDirection: "row", alignItems: "center"}}><Text>{shownValueInNoEdit}</Text></View>;
        let displayStyle = "none";
        if(editText) {
            textPlaceholder = null;
            displayStyle = null;
        }

        let saveEnabled = (textValue.length > 0 || textValue==="") && textValue !== initialValue && !loading;

        return(
            <View style={{width: "100%", alignItems: "flex-end"}}>
                {textPlaceholder}
                <View style={{display: displayStyle, width: "100%"}}>
                    <Input ref={textInput}
                           keyboardType={"numeric"}
                           //inputMode={"numeric"}
                           _input={{ // https://github.com/GeekyAnts/NativeBase/issues/5420
                               selectionColor: textColor,
                               // @ts-ignore
                               cursorColor: textColor,
                           }}

                           placeholder={props?.placeholder} value={textValue} onChangeText={(text) => {
                                textTextValue(text);
                           }} />
                    <ParentSpacer space={10} style={{marginTop: 20, width: "100%", flex: 1, flexDirection: "row"}}>
                        <MyButton accessibilityLabel={props?.saveText} disabled={!saveEnabled} onPress={async () => {
                            if(!!props.onChange){
                                setLoading(true);
                            } else {
                                //TODO: error handling
                            }
                        }}>
                            <SaveIcon />
                            <Text>{props?.saveText}</Text>
                        </MyButton>
                        <MyButton accessibilityLabel={props?.cancelText} disabled={loading} onPress={() => {
                                setEditText(false);
                                textTextValue(initialValue);
                        }}>
                            <Icon name={"cancel"} />
                            <Text>{props?.cancelText}</Text>
                        </MyButton>
                    </ParentSpacer>
                </View>
            </View>
        )
    }

  return (
          <SettingsRow accessibilityLabel={accessibilityLabel} onPress={editText ? undefined : () => {if(!editText) {setEditText(!editText)}}} leftContent={description} rightContent={renderContent()} leftIcon={props?.icon} />
  )
}
