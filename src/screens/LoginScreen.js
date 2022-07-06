import React, { useEffect, useState } from "react";
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
  const userRef = React.useRef();

  const [hidePassword, setHidePassword] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, [userRef.current]);

  const handleLogin = (credentials, setSubmitting) => {
    setErrorMsg(null);
    url
      .post("/api/session", credentials)
      .then((res) => {
        if (res.status == 200) {
          navigation.navigate(res.data.type);
          console.log("loginreponse:", res.data);
        }
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
            validationSchema={LoginValidationSchema}
            onSubmit={(values, { setSubmitting }) => {
              handleLogin(values, setSubmitting);
              values.username = null;
              values.password = null;
            }}
          >
            {({ handleChange, handleSubmit, isSubmitting, values }) => (
              <StyledFormArea>
                <Field
                  component={CustomTextInput}
                  ref={userRef}
                  label="Username"
                  name="username"
                  icon="user"
                  placeholder="username"
                  placeholderTextColor={darkLight}
                />
                <Field
                  component={CustomTextInput}
                  label="Password"
                  name="password"
                  icon="lock"
                  placeholder="* * * * * * * *"
                  placeholderTextColor={darkLight}
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
