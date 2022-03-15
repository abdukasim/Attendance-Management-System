import React from "react";
import { View, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import {
  Colors,
  LeftIcon,
  StyledInputLabel,
  StyledTextInput,
  RightIcon,
} from "./styles";

const { brand, darkLight } = Colors;

const CustomTextInput = ({
  label,
  icon,
  isPassword,
  hidePassword,
  setHidePassword,
  isSex,
  showPicker,
  isDate,
  showDatePicker,
  ...props
}) => {
  return (
    <View>
      <LeftIcon>
        <FontAwesome name={icon} size={30} color={brand} />
      </LeftIcon>
      <StyledInputLabel>{label}</StyledInputLabel>
      {/* {!isSex && <StyledTextInput {...props} />} */}
      {isSex && (
        <TouchableOpacity onPress={showPicker}>
          <StyledTextInput {...props} />
        </TouchableOpacity>
      )}
      {!isDate && <StyledTextInput {...props} />}
      {isDate && (
        <TouchableOpacity onPress={showDatePicker}>
          <StyledTextInput {...props} />
        </TouchableOpacity>
      )}
      {isPassword && (
        <RightIcon onPress={() => setHidePassword(!hidePassword)}>
          <FontAwesome
            size={30}
            color={darkLight}
            name={hidePassword ? "eye" : "eye-slash"}
          />
        </RightIcon>
      )}
    </View>
  );
};

export default CustomTextInput;
