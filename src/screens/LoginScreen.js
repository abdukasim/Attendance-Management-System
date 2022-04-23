import React, { useState } from "react";
import {
  InnerContainer,
  PageLogo,
  PageTitle,
  StyledContainer,
  StyledFormArea,
  SubTitle,
  Colors,
  StyledButton,
  ButtonText,
  MsgBox,
} from "../components/styles";
import { Formik } from "formik";
import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper";
import CustomTextInput from "../components/CustomTextInput";
import url from "../helpers/url";
import { ActivityIndicator } from "react-native";

const { primary, darkLight } = Colors;

// const baseUrl = 'http://192.168.234.216:3000';

const LoginScreen = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = (credentials, setSubmitting) => {
    setErrorMsg(null);
    url
      .post("/api/session", credentials)
      .then((res) => {
        if (res.status == 200) navigation.navigate(res.data.type);
        setSubmitting(false);
      })
      .catch((err) => {
        if (!err.response) {
          setErrorMsg(err.message);
        } else setErrorMsg(err.response.data.description);
        setSubmitting(false);
      });
  };

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <InnerContainer>
          <PageLogo
            resizeMode="contain"
            source={require("../../assets/MuntahaFoundationLogo.png")}
          />
          <PageTitle>Attendance Management</PageTitle>
          <SubTitle>Login</SubTitle>
          <Formik
            initialValues={{ username: "", password: "" }}
            onSubmit={(values, { setSubmitting }) => {
              if (values.username == "" || values.password == "") {
                setErrorMsg("Please fill all the fields");
                setSubmitting(false);
              } else {
                handleLogin(values, setSubmitting);
                values.username = null;
                values.password = null;
              }
            }}
          >
            {({ handleChange, handleSubmit, isSubmitting, values }) => (
              <StyledFormArea>
                <CustomTextInput
                  label="Username"
                  name="username"
                  icon="user"
                  placeholder="username"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange("username")}
                  value={values.username}
                />
                <CustomTextInput
                  label="Password"
                  name="password"
                  icon="lock"
                  placeholder="* * * * * * * *"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange("password")}
                  value={values.password}
                  secureTextEntry={hidePassword}
                  isPassword={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                />
                <MsgBox> {errorMsg} </MsgBox>
                {!isSubmitting && (
                  <StyledButton onPress={handleSubmit}>
                    <ButtonText>Login</ButtonText>
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

export default LoginScreen;
