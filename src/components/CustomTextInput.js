import React, { forwardRef } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
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
    {
      label,
      icon,
      isPassword,
      hidePassword,
      setHidePassword,
      field: { name, onBlur, onChange, value },
      form: { errors, touched, setFieldTouched },
      ...props
    },
    ref
  ) => {
    const hasError = errors[name] && touched[name];
    return (
      <View>
        <LeftIcon>
          <FontAwesome name={icon} size={30} color={brand} />
        </LeftIcon>
        <StyledInputLabel>{label}</StyledInputLabel>
        <StyledTextInput
          value={value}
          onChangeText={(text) => onChange(name)(text)}
          onBlur={() => {
            setFieldTouched(name);
            onBlur(name);
          }}
          {...props}
          style={hasError && styles.errorInput}
          ref={ref}
        />
        {hasError && <Text style={styles.errorText}>{errors[name]}</Text>}
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

const styles = StyleSheet.create({
  errorText: {
    fontSize: 10,
    color: "red",
  },
  errorInput: {
    borderColor: "red",
    borderWidth: 1,
  },
});
export default CustomTextInput;
