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
import { FieldArray, Field, Formik } from "formik";
import KeyboardAvoidingWrapper from "../../components/KeyboardAvoidingWrapper";
import CustomTextInput from "../../components/CustomTextInput";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import RadioForm from "react-native-simple-radio-button";
import url from "../../helpers/url";
import * as yup from "yup";

import { FontAwesome } from "@expo/vector-icons";

const { darkLight, primary, secondary, tertiary, brand } = Colors;

const OldMemberRegistrationValidationSchema = yup.object().shape({
  name: yup
    .string()
    .matches(/(\w.+\s).+/, "Enter at least 2 names")
    .required("Full name is required"),
  age: yup.number().required("Age is required"),
  sex: yup.string().required("Sex is required"),
  address: yup.string().required("Address is required"),
  phone: yup
    .string()
    .matches(/(09)(\d){8}\b/, "Enter a valid phone number")
    .required("Phone number is required"),
  shelterStatus: yup.string().required("Shelter Status is required"),
  jobStatus: yup.string().required("Job Status is required"),
  maritalStatus: yup.string().required("Marital Status is required"),
});

const OldMemberRegistrationScreen = () => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [marital, setMaritalStatus] = useState();
  const [show, setShow] = useState(false);
  const [radioButton, setRadioButton] = useState();
  const [image, setImage] = useState(null);
  const [shelter, setShelter] = useState("");

  const radio_props = [
    { label: "Yes", value: 0 },
    { label: "No", value: 1 },
  ];

  const handleMessage = (message, type = "FAILED") => {
    setMessage(message);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 2000);
  };

  const getFormData = (object) => {
    const formData = new FormData();
    formData.append("image", {
      name: new Date() + "_profile.jpg",
      uri: object.image,
      type: "image/jpg",
    });
    Object.keys(object).forEach((key) => {
      if (key !== "image") {
        formData.append(key, object[key]);
      }
    });
    return formData;
  };

  const handleRegistration = (credentials, setSubmitting) => {
    handleMessage(null);
    //
    const formData = getFormData(credentials);
    console.log(credentials);
    if (credentials.image === "") {
      setSubmitting(false);
      handleMessage("Please select Image");
      return;
    }
    //
    fetch("http://137.184.58.100:8080/api/attendance/client/old-timer", {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setSubmitting(false);
        handleMessage("Successfully Registered", "SUCCESS");
      })
      .catch((err) => {
        setSubmitting(false);
        if (
          err.message === "Network Error" ||
          err.message === "Network request failed"
        ) {
          handleMessage("Successfully added to Attendance", "SUCCESS");
        } else {
          handleMessage(err.message, "ERROR");
        }
      });
  };

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <InnerContainer>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )}
          <Formik
            // enableReinitialize
            initialValues={{
              image: "",
              name: "",
              age: "",
              sex: "",
              address: "",
              phone: "",
              shelterStatus: "",
              rent: "",
              jobStatus: "",
              maritalStatus: "",
              spouse: "",
              children: [{ name: "", age: "", schooling: "" }],
              health: "",
            }}
            validationSchema={OldMemberRegistrationValidationSchema}
            onSubmit={(values, { setSubmitting }) => {
              handleRegistration(values, setSubmitting);
              // Object.keys(values).forEach((key) => {
              //   values[key] = "";
              // });
            }}
          >
            {({
              handleBlur,
              handleSubmit,
              isSubmitting,
              values,
              setFieldValue,
              setFieldTouched,
              setFieldError,
              errors,
              touched,
            }) => (
              <StyledFormArea>
                <View
                  style={[
                    imageUploaderStyles.container,
                    errors.image && touched.image && styles.errorInput,
                  ]}
                >
                  {image && (
                    <Image
                      source={{ uri: image }}
                      style={{ width: 150, height: 150 }}
                    />
                  )}
                  <View style={imageUploaderStyles.uploadBtnContainer}>
                    <TouchableOpacity
                      onPress={async () => {
                        setFieldTouched("image", true);
                        let _image = await ImagePicker.launchImageLibraryAsync({
                          mediaTypes: ImagePicker.MediaTypeOptions.Images,
                          allowsEditing: true,
                          aspect: [4, 4],
                          quality: 0.5,
                        });

                        _image.cancelled &&
                          setFieldError("image", "Image is Required");
                        if (!_image.cancelled) {
                          setImage(_image.uri);
                          setFieldValue("image", _image.uri);
                        }
                      }}
                      style={imageUploaderStyles.uploadBtn}
                    >
                      <Text>{image ? "Edit" : "Upload"} Image</Text>
                      <FontAwesome name="camera" size={20} color={brand} />
                    </TouchableOpacity>
                  </View>
                </View>
                {errors.image && touched.image && (
                  <Text style={styles.errorText}>{errors.image}</Text>
                )}
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
                  label="Age"
                  name="age"
                  icon="calendar"
                  placeholder="age"
                  placeholderTextColor={darkLight}
                  keyboardType="numeric"
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

                <Field
                  component={CustomTextInput}
                  label="Address"
                  name="address"
                  icon="home"
                  placeholder="address"
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

                <StyledInputLabel>Shelter Status</StyledInputLabel>
                <Picker
                  selectedValue={values.shelterStatus}
                  onValueChange={(itemValue, itemIndex) => {
                    setFieldTouched("shelterStatus", true);
                    if (itemValue !== "default") {
                      setFieldValue("shelterStatus", itemValue);
                      setShelter(itemValue);
                    }
                  }}
                  style={[
                    styles.pickerStyle,
                    errors.shelterStatus &&
                      touched.shelterStatus &&
                      styles.errorInput,
                  ]}
                  onBlur={handleBlur("shelterStatus")}
                >
                  <Picker.Item
                    label="Please select shelter status"
                    value="default"
                  />
                  <Picker.Item label="Rent" value="rent" />
                  <Picker.Item label="Private" value="private" />
                  <Picker.Item label="Dependent" value="dependent" />
                  <Picker.Item label="Homeless" value="homeless" />
                </Picker>
                {errors.shelterStatus && touched.shelterStatus && (
                  <Text style={styles.errorText}>{errors.shelterStatus}</Text>
                )}

                {shelter === "rent" && (
                  <Field
                    component={CustomTextInput}
                    label="Rent Amount"
                    name="rent"
                    icon="money"
                    placeholder="rent amount"
                    placeholderTextColor={darkLight}
                    keyboardType="numeric"
                  />
                )}

                <Field
                  component={CustomTextInput}
                  label="Job"
                  name="jobStatus"
                  icon="briefcase"
                  placeholder="jobStatus"
                  placeholderTextColor={darkLight}
                />

                <StyledInputLabel>Marital Status</StyledInputLabel>
                <Picker
                  selectedValue={values.maritalStatus}
                  onValueChange={(itemValue, itemIndex) => {
                    setFieldTouched("maritalStatus", true);
                    if (itemValue !== "default") {
                      setMaritalStatus(itemValue);
                      setFieldValue("maritalStatus", itemValue);
                    }
                  }}
                  style={[
                    styles.pickerStyle,
                    errors.maritalStatus &&
                      touched.maritalStatus &&
                      styles.errorInput,
                  ]}
                  onBlur={handleBlur("maritalStatus")}
                >
                  <Picker.Item
                    label="Please select marital status"
                    value="default"
                  />
                  <Picker.Item label="Divorced" value="Divorced" />
                  <Picker.Item label="Married" value="Married" />
                  <Picker.Item label="Widowed" value="Widowed" />
                  <Picker.Item label="Abandoned" value="Abandoned" />
                </Picker>
                {errors.maritalStatus && touched.maritalStatus && (
                  <Text style={styles.errorText}>{errors.maritalStatus}</Text>
                )}

                <StyledInputLabel>Children</StyledInputLabel>
                <RadioForm
                  radio_props={radio_props}
                  initial={-1}
                  formHorizontal={true}
                  buttonColor={brand}
                  selectedButtonColor={brand}
                  animation={true}
                  onPress={(value) => {
                    setRadioButton(value);
                  }}
                  style={{ marginVertical: 5 }}
                />

                {radioButton == 0 && (
                  <FieldArray name="children">
                    {({ insert, remove, push }) => (
                      <View>
                        {values.children?.length > 0 &&
                          values.children.map((child, index) => (
                            <View key={index}>
                              <Field
                                component={CustomTextInput}
                                label="Child Name"
                                name={`children[${index}].name`}
                                icon="child"
                                placeholder="name"
                                placeholderTextColor={darkLight}
                              />
                              <Field
                                component={CustomTextInput}
                                label="Child Age"
                                name={`children[${index}].age`}
                                icon="child"
                                placeholder="age"
                                placeholderTextColor={darkLight}
                                keyboardType="numeric"
                              />
                              <Field
                                component={CustomTextInput}
                                label="Child Schooling"
                                name={`children[${index}].schooling`}
                                icon="child"
                                placeholder="schooling"
                                placeholderTextColor={darkLight}
                              />
                              <View style={styles.childrenButton}>
                                <TouchableOpacity
                                  onPress={() => remove(index)}
                                  style={{
                                    ...styles.buttonStyle,
                                    backgroundColor: "red",
                                  }}
                                >
                                  <Text
                                    style={{ color: "white", fontSize: 20 }}
                                  >
                                    -
                                  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() =>
                                    push({ name: "", age: "", schooling: "" })
                                  }
                                  style={{
                                    ...styles.buttonStyle,
                                    backgroundColor: "green",
                                  }}
                                >
                                  <Text
                                    style={{ color: "white", fontSize: 20 }}
                                  >
                                    +
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          ))}
                      </View>
                    )}
                  </FieldArray>
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
  },
  childrenButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  buttonStyle: {
    padding: 10,
    width: 50,
    height: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 999,
    marginRight: 20,
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
const imageUploaderStyles = StyleSheet.create({
  container: {
    elevation: 2,
    height: 150,
    width: 150,
    backgroundColor: "#efefef",
    position: "relative",
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 20,
  },
  uploadBtnContainer: {
    opacity: 0.7,
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "lightgrey",
    width: "100%",
    height: "40%",
  },
  uploadBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
});

export default OldMemberRegistrationScreen;
