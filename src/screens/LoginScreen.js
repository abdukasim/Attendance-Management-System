import React, { useState, useRef } from "react";
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
import { Field, Formik } from "formik";
import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper";
import CustomTextInput from "../components/CustomTextInput";
import url from "../helpers/url";
import { ActivityIndicator } from "react-native";
import * as yup from "yup";
const { primary, darkLight } = Colors;

const LoginValidationSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

const LoginScreen = ({ navigation }) => {
  const passwordRef = useRef(null);

  const [hidePassword, setHidePassword] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleMessage = (message, type = "ERROR") => {
    setMessage(message);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 2000);
  };

  const handleLogin = (credentials, setSubmitting) => {
    handleMessage(null);
    url
      .post("/api/session", credentials)
      .then((res) => {
        if (res.status == 200) {
          navigation.replace(res.data.type);
        }
        setSubmitting(false);
      })
      .catch((err) => {
        if (!err.response) {
          handleMessage(err.message);
        } else handleMessage(err.response.data.description);
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
            validationSchema={LoginValidationSchema}
            onSubmit={(values, { setSubmitting }) => {
              handleLogin(values, setSubmitting);
            }}
          >
            {({ handleChange, handleSubmit, isSubmitting, values }) => (
              <StyledFormArea>
                <Field
                  component={CustomTextInput}
                  label="Username"
                  name="username"
                  icon="user"
                  placeholder="username"
                  placeholderTextColor={darkLight}
                  autoFocus={true}
                  onSubmitEditing={() => {
                    passwordRef.current.focus();
                  }}
                  blurOnSubmit={false}
                />
                <Field
                  id="pass"
                  component={CustomTextInput}
                  innerRef={(el) => (passwordRef.current = el)}
                  label="Password"
                  name="password"
                  icon="lock"
                  placeholder="* * * * * * * *"
                  placeholderTextColor={darkLight}
                  secureTextEntry={hidePassword}
                  isPassword={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                  onSubmitEditing={() => handleSubmit()}
                />
                <MsgBox> {message} </MsgBox>
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
