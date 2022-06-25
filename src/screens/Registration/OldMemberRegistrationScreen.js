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
import { FieldArray, Formik } from "formik";
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

import { FontAwesome } from "@expo/vector-icons";

const { darkLight, primary, secondary, tertiary, brand } = Colors;

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
      formData.append(key, object[key]);
    });
    console.log(formData);
    return formData;
  };

  const handleRegistration = (credentials, setSubmitting) => {
    handleMessage(null);
    //
    const formData = getFormData(credentials);
    console.log(formData);
    //
    fetch("https://muntaha.herokuapp.com/api/attendance/client/old-timer", {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setSubmitting(false);
        handleMessage("Successfully Registered", "SUCCESS");
      })
      .catch((err) => {
        console.log("catch:", err.message);
        handleMessage(err.message, "ERROR");
        setSubmitting(false);
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
              name: "",
              age: "",
              sex: "",
              address: "",
              phone: "",
              shetlerStatus: "",
              rent: "",
              jobStatus: "",
              maritalStatus: "",
              spouse: "",
              children: [{ name: "", age: "", schooling: "" }],
              health: "",
            }}
            onSubmit={(values, { setSubmitting }) => {
              if (
                values.name == "" ||
                values.phone == "" ||
                values.sex == "" ||
                values.address == "" ||
                values.jobStatus == "" ||
                values.maritalStatus == "" ||
                values.shetlerStatus == ""
              ) {
                handleMessage("Please fill all the fields");
                console.log("value", values);
                setTimeout(() => {
                  handleMessage("");
                }, 2000);
                setSubmitting(false);
              } else {
                console.log(values);
                handleRegistration(values, setSubmitting);
                // values.name = null;
                // values.age = null;
                // values.sex = null;
                // values.maritalStatus = null;
                // values.spouse = null;
                // values.children = null;
                // values.jobStatus = null;
                // values.shetlerStatus = null;
                // values.address = null;
                // values.phone = null;
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
                <View style={imageUploaderStyles.container}>
                  {image && (
                    <Image
                      source={{ uri: image }}
                      style={{ width: 150, height: 150 }}
                    />
                  )}
                  <View style={imageUploaderStyles.uploadBtnContainer}>
                    <TouchableOpacity
                      onPress={async () => {
                        let _image = await ImagePicker.launchImageLibraryAsync({
                          mediaTypes: ImagePicker.MediaTypeOptions.Images,
                          allowsEditing: true,
                          aspect: [4, 4],
                          quality: 0.5,
                        });

                        console.log(JSON.stringify(_image));

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
                <CustomTextInput
                  label="Full Name"
                  name="name"
                  icon="user"
                  placeholder="Name"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange("name")}
                  value={values.name}
                />

                <CustomTextInput
                  label="Age"
                  name="age"
                  icon="calendar"
                  placeholder="age"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange("age")}
                  value={values.age}
                />

                <StyledInputLabel>Sex</StyledInputLabel>
                <Picker
                  selectedValue={values.sex}
                  onValueChange={(itemValue, itemIndex) => {
                    // setSelectedSex(itemValue);
                    setFieldValue("sex", itemValue);
                    console.log(itemValue);
                  }}
                  style={styles.pickerStyle}
                >
                  <Picker.Item label="Please select gender" value="unknown" />
                  <Picker.Item label="Male" value="Male" />
                  <Picker.Item label="Female" value="Female" />
                </Picker>

                <CustomTextInput
                  label="Address"
                  name="address"
                  icon="home"
                  placeholder="address"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange("address")}
                  value={values.address}
                />

                <CustomTextInput
                  label="Phone Number"
                  name="phone"
                  icon="phone"
                  placeholder="phone number"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange("phone")}
                  value={values.phone}
                  keyboardType="numeric"
                />

                <StyledInputLabel>Shelter Status</StyledInputLabel>
                <Picker
                  prompt={"Select"}
                  selectedValue={values.shetlerStatus}
                  onValueChange={(itemValue, itemIndex) => {
                    setFieldValue("shetlerStatus", itemValue);
                  }}
                  style={styles.pickerStyle}
                >
                  <Picker.Item
                    label="Please select shelter status"
                    value={null}
                  />
                  <Picker.Item label="Rent" value="rent" />
                  <Picker.Item label="Private" value="private" />
                  <Picker.Item label="Dependent" value="dependent" />
                  <Picker.Item label="Homeless" value="homeless" />
                </Picker>

                {shelter === "rent" && (
                  <CustomTextInput
                    label="Rent Amount"
                    name="rent"
                    icon="money"
                    placeholder="rent amount"
                    placeholderTextColor={darkLight}
                    onChangeText={handleChange("rent")}
                    value={values.rent}
                  />
                )}

                <CustomTextInput
                  label="Job"
                  name="jobStatus"
                  icon="briefcase"
                  placeholder="jobStatus"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange("jobStatus")}
                  value={values.jobStatus}
                />

                <StyledInputLabel>Marital Status</StyledInputLabel>
                <Picker
                  prompt={"Select Marital"}
                  selectedValue={values.maritalStatus}
                  onValueChange={(itemValue, itemIndex) => {
                    setMaritalStatus(itemValue);
                    setFieldValue("maritalStatus", itemValue);
                  }}
                  style={styles.pickerStyle}
                >
                  <Picker.Item
                    label="Please select marital status"
                    value={null}
                  />
                  <Picker.Item label="Divorced" value="Divorced" />
                  <Picker.Item label="Married" value="Married" />
                  <Picker.Item label="Widowed" value="Widowed" />
                  <Picker.Item label="Abandoned" value="Abandoned" />
                </Picker>

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
                              <CustomTextInput
                                label="Child Name"
                                name={`children[${index}].name`}
                                icon="child"
                                placeholder="children"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange(
                                  `children[${index}].name`
                                )}
                                value={child.name}
                              />
                              <CustomTextInput
                                label="Child Age"
                                name={`children[${index}].age`}
                                icon="child"
                                placeholder="children"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange(
                                  `children[${index}].age`
                                )}
                                value={child.age}
                                keyboardType="numeric"
                              />
                              <CustomTextInput
                                label="Child Schooling"
                                name={`children[${index}].schooling`}
                                icon="child"
                                placeholder="children"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange(
                                  `children[${index}].schooling`
                                )}
                                value={child.schooling}
                              />
                              <View style={styles.childrenButton}>
                                <StyledButton onPress={() => remove(index)}>
                                  <ButtonText>Remove</ButtonText>
                                </StyledButton>
                                <StyledButton
                                  onPress={() =>
                                    push({ name: "", age: "", schooling: "" })
                                  }
                                >
                                  <ButtonText>Add Child</ButtonText>
                                </StyledButton>
                              </View>
                            </View>
                          ))}
                      </View>
                    )}
                  </FieldArray>
                )}

                {/* <StyledInputLabel>Health Status</StyledInputLabel>
                <Picker
                  prompt={"Health Status"}
                  selectedValue={values.health}
                  onValueChange={(itemValue, itemIndex) => {
                    setHealthStatus(itemValue);
                    setFieldValue("health", itemValue);
                  }}
                  style={styles.pickerStyle}
                >
                  <Picker.Item
                    label="Please select health status"
                    enabled={false}
                  />
                  <Picker.Item label="Healthy" value="Healthy" />
                  <Picker.Item label="On Medication" value="Medication" />
                </Picker> */}

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
