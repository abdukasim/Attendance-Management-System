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
import { Field, Formik } from "formik";
import KeyboardAvoidingWrapper from "../../components/KeyboardAvoidingWrapper";
import CustomTextInput from "../../components/CustomTextInput";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import url from "../../helpers/url";
import * as yup from "yup";

const { darkLight, primary, secondary, tertiary } = Colors;

const NewMemberRegistrationValidationSchema = yup.object().shape({
  name: yup
    .string()
    .matches(/(\w.+\s).+/, "Enter at least 2 names")
    .required("Full name is required"),
  phone: yup
    .string()
    .matches(/(09)(\d){8}\b/, "Enter a valid phone number")
    .required("Phone number is required"),
  address: yup.string().required("Address is required"),
  sex: yup.string().matches(/Male/i).required("Sex is required"),
});

const NewMemberRegistrationScreen = () => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [selected, setSelected] = useState();
  const data = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];
  const handleMessage = (message, type = "FAILED") => {
    setMessage(message);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 2000);
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
      .catch((err) => console.error(err.message));
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
            validationSchema={NewMemberRegistrationValidationSchema}
            onSubmit={(values, { setSubmitting }) => {
              handleRegistration(values, setSubmitting);
              Object.keys(values).forEach((key) => {
                values[key] = "";
              });
            }}
          >
            {({
              handleBlur,
              handleSubmit,
              isSubmitting,
              values,
              setFieldValue,
              setFieldTouched,
              errors,
              touched,
            }) => (
              <StyledFormArea>
                <Field
                  component={CustomTextInput}
                  label="Full Name"
                  name="name"
                  icon="user"
                  placeholder="name"
                  placeholderTextColor={darkLight}
                />
                <Field
                  component={CustomTextInput}
                  label="Phone Number"
                  name="phone"
                  icon="phone"
                  placeholder="phone number"
                  placeholderTextColor={darkLight}
                  keyboardType="numeric"
                />
                <Field
                  component={CustomTextInput}
                  label="Address"
                  name="address"
                  icon="home"
                  placeholder="address"
                  placeholderTextColor={darkLight}
                />
                <StyledInputLabel>Sex</StyledInputLabel>
                <Picker
                  selectedValue={values.sex}
                  onValueChange={(itemValue, itemIndex) => {
                    setFieldTouched("sex", true);
                    if (itemValue !== "default") {
                      setFieldValue("sex", itemValue);
                    }
                  }}
                  style={[
                    styles.pickerStyle,
                    errors.sex && touched.sex && styles.errorInput,
                  ]}
                  onBlur={handleBlur("sex")}
                >
                  <Picker.Item label="Please select gender" value="default" />
                  <Picker.Item label="Male" value="Male" />
                  <Picker.Item label="Female" value="Female" />
                </Picker>
                {errors.sex && touched.sex && (
                  <Text style={styles.errorText}>{errors.sex}</Text>
                )}

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
    borderWidth: 0,
  },
  errorText: {
    fontSize: 10,
    color: "red",
  },
  errorInput: {
    borderColor: "red",
    borderWidth: 1,
  },
});

export default NewMemberRegistrationScreen;
