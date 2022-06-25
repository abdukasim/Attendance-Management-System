import React, { forwardRef } from "react";
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

const CustomTextInput = forwardRef(
  (
    { label, icon, isPassword, hidePassword, setHidePassword, ...props },
    ref
  ) => {
    return (
      <View>
        <LeftIcon>
          <FontAwesome name={icon} size={30} color={brand} />
        </LeftIcon>
        <StyledInputLabel>{label}</StyledInputLabel>
        <StyledTextInput {...props} ref={ref} />
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
  }
);

export default CustomTextInput;
