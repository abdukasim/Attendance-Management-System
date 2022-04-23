import React, { useState } from "react";
import {
  InnerContainer,
  StyledContainer,
  StyledFormArea,
  Colors,
  StyledButton,
  ButtonText,
  MsgBox,
  StyledInputLabel,
} from "../../components/styles";
import { Formik } from "formik";
import KeyboardAvoidingWrapper from "../../components/KeyboardAvoidingWrapper";
import CustomTextInput from "../../components/CustomTextInput";
import { ActivityIndicator, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import url from "../../helpers/url";

const { darkLight, primary, secondary, tertiary } = Colors;

// const baseUrl = 'http://192.168.234.216:3000';

const NewMemberRegistrationScreen = () => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleMessage = (message, type = "FAILED") => {
    setMessage(message);
    setMessageType(type);
  };

  const handleRegistration = (credentials, setSubmitting) => {
    handleMessage(null);
    url
      .post("/api/attendance/registration/new", credentials)
      .then((res) => {
        if (res.status === 200) {
          handleMessage("Successfully registered", "SUCCESS");
          setSubmitting(false);
        }
      })
      .catch();
  };

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <InnerContainer>
          <Formik
            initialValues={{
              name: "",
              phone: "",
              address: "",
              sex: "",
            }}
            onSubmit={(values, { setSubmitting }) => {
              // add to waiting list
              if (
                values.name == "" ||
                values.phone == "" ||
                values.sex == "" ||
                values.address == ""
              ) {
                handleMessage("Please fill all the fields");
                setSubmitting(false);
              } else {
                handleRegistration(values, setSubmitting);
                values.name = null;
                values.phone = null;
                values.address = null;
                values.sex = null;
              }
            }}
          >
            {({
              handleChange,
              handleSubmit,
              isSubmitting,
              values,
              setFieldValue,
            }) => (
              <StyledFormArea>
                <CustomTextInput
                  label="Full Name"
                  name="name"
                  icon="user"
                  placeholder="Name"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange("name")}
                  // onBlur={handleBlur}
                  value={values.name}
                />
                <CustomTextInput
                  label="Phone Number"
                  name="phone"
                  icon="phone"
                  placeholder="phone number"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange("phone")}
                  // onBlur={handleBlur}
                  value={values.phone}
                  keyboardType="numeric"
                />
                <CustomTextInput
                  label="Address"
                  name="address"
                  icon="home"
                  placeholder="address"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange("address")}
                  // onBlur={handleBlur}
                  value={values.address}
                />
                <StyledInputLabel>Sex</StyledInputLabel>
                <Picker
                  prompt={"Select Gender"}
                  selectedValue={values.sex}
                  onValueChange={(itemValue, itemIndex) => {
                    // setSelectedSex(itemValue);
                    setFieldValue("sex", itemValue);
                    console.log(itemValue);
                  }}
                  style={styles.pickerStyle}
                >
                  <Picker.Item label="Male" value="Male" />
                  <Picker.Item label="Female" value="Female" />
                </Picker>

                <MsgBox type={messageType}> {message} </MsgBox>
                {!isSubmitting && (
                  <StyledButton onPress={handleSubmit}>
                    <ButtonText>Register</ButtonText>
                  </StyledButton>
                )}

                {isSubmitting && (
                  <StyledButton disabled={true}>
                    <ActivityIndicator size="large" color={primary} />
                  </StyledButton>
                )}
              </StyledFormArea>
            )}
          </Formik>
        </InnerContainer>
      </StyledContainer>
    </KeyboardAvoidingWrapper>
  );
};

const styles = StyleSheet.create({
  pickerStyle: {
    backgroundColor: secondary,
    padding: 15,
    paddingLeft: 55,
    paddingRight: 55,
    borderRadius: 5,
    fontSize: 16,
    height: 60,
    marginVertical: 3,
    marginBottom: 10,
    color: tertiary,
  },
});

export default NewMemberRegistrationScreen;
