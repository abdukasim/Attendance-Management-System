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
import { ActivityIndicator, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import RadioForm from "react-native-simple-radio-button";
import url from "../../helpers/url";

// import { View, Text } from "react-native";

const { darkLight, primary, secondary, tertiary, brand } = Colors;

const OldMemberRegistrationScreen = () => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [marital, setMaritalStatus] = useState();
  const [health, setHealthStatus] = useState();
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date(2000, 0, 1));
  const [radioButton, setRadioButton] = useState();

  const radio_props = [
    { label: "Yes", value: 0 },
    { label: "No", value: 1 },
  ];

  // Actual date of birth
  const [dob, setDob] = useState();

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    setDob(currentDate);
  };

  const showDatePicker = () => {
    setShow(true);
  };

  const handleMessage = (message, type = "FAILED") => {
    setMessage(message);
    setMessageType(type);
  };

  const handleRegistration = (credentials, setSubmitting) => {
    handleMessage(null);
    url
      .post("/api/attendance/client/old-timer", credentials)
      .then((res) => {
        if (res.status === 200) {
          handleMessage("Successfully registered", "SUCCESS");
          setSubmitting(false);
        }
      })
      .catch((err) => {
        console.log("error: ", err.response.data.description);
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
              birthday: "",
              sex: "",
              maritalStatus: "",
              spouse: "",
              children: [{ name: "", age: "", schooling: "" }],
              jobStatus: "",
              rent: "",
              address: "",
              phone: "",
              health: "",
              skills: "",
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
                console.log(values);
                handleRegistration(values, setSubmitting);
                values.name = null;
                values.birthday = null;
                values.sex = null;
                values.maritalStatus = null;
                values.spouse = null;
                values.children = null;
                values.jobStatus = null;
                values.rent = null;
                values.address = null;
                values.phone = null;
                values.health = null;
                values.skills = null;
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
                  label="Birthday"
                  name="birthday"
                  icon="calendar"
                  placeholder="birthday"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange("birthday")}
                  // onBlur={handleBlur}
                  value={dob ? dob.toDateString() : ""}
                  isDate={true}
                  editable={false}
                  showDatePicker={showDatePicker}
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
                  <Picker.Item label="--Select Gender--" enabled={false} />
                  <Picker.Item label="Male" value="Male" />
                  <Picker.Item label="Female" value="Female" />
                </Picker>

                <StyledInputLabel>Marital Status</StyledInputLabel>
                <Picker
                  prompt={"Select Marital"}
                  selectedValue={values.maritalStatus}
                  onValueChange={(itemValue, itemIndex) => {
                    // setSelectedSex(itemValue);
                    setMaritalStatus(itemValue);
                    console.log(marital);
                    setFieldValue("maritalStatus", itemValue);
                    // console.log(itemValue);
                  }}
                  style={styles.pickerStyle}
                >
                  <Picker.Item label="" value="" />
                  <Picker.Item label="Divorced" value="Divorced" />
                  <Picker.Item label="Married" value="Married" />
                  <Picker.Item label="Widowed" value="Widowed" />
                  <Picker.Item label="Abandoned" value="Abandoned" />
                </Picker>

                {marital === "Married" && (
                  <CustomTextInput
                    label="Spouse"
                    name="spouse"
                    icon="male"
                    placeholder="spouse"
                    placeholderTextColor={darkLight}
                    onChangeText={handleChange("spouse")}
                    // onBlur={handleBlur}
                    value={values.spouse}
                  />
                )}

                <StyledInputLabel>Children</StyledInputLabel>
                <RadioForm
                  radio_props={radio_props}
                  initial={-1}
                  formHorizontal={true}
                  // labelHorizontal={true}
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
                        {console.log(values.children)}
                        {values.children.length > 0 &&
                          values.children.map((child, index) => (
                            <View key={index}>
                              <CustomTextInput
                                label="Child Name"
                                name={`children.${index}.name`}
                                icon="child"
                                placeholder="children"
                                placeholderTextColor={darkLight}
                                // onChangeText={handleChange("children")}
                                // onBlur={handleBlur}
                              />
                              <CustomTextInput
                                label="Child Age"
                                name={`children.${index}.age`}
                                icon="child"
                                placeholder="children"
                                placeholderTextColor={darkLight}
                                // onChangeText={handleChange("children")}
                                // onBlur={handleBlur}
                              />
                              <CustomTextInput
                                label="Child Schooling"
                                name={`children.${index}.schooling`}
                                icon="child"
                                placeholder="children"
                                placeholderTextColor={darkLight}
                                // onChangeText={handleChange("children")}
                                // onBlur={handleBlur}
                              />
                              <View style={styles.childrenButton}>
                                <StyledButton onPress={() => remove(index)}>
                                  <ButtonText>Remove</ButtonText>
                                </StyledButton>
                                <StyledButton
                                  onPress={() =>
                                    push({ name: "", schooling: "" })
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

                <CustomTextInput
                  label="Job"
                  name="jobStatus"
                  icon="briefcase"
                  placeholder="jobStatus"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange("jobStatus")}
                  // onBlur={handleBlur}
                  value={values.jobStatus}
                />

                <CustomTextInput
                  label="Rent"
                  name="rent"
                  icon="money"
                  placeholder="rent"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange("rent")}
                  // onBlur={handleBlur}
                  value={values.rent}
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

                <StyledInputLabel>Health Status</StyledInputLabel>
                <Picker
                  prompt={"Health Status"}
                  selectedValue={values.health}
                  onValueChange={(itemValue, itemIndex) => {
                    // setSelectedSex(itemValue);
                    setHealthStatus(itemValue);
                    // console.log(marital);
                    setFieldValue("health", itemValue);
                    // console.log(itemValue);
                  }}
                  style={styles.pickerStyle}
                >
                  <Picker.Item label="Healthy" value="Healthy" />
                  <Picker.Item label="On Medication" value="Medication" />
                </Picker>

                <CustomTextInput
                  label="Skills"
                  name="skills"
                  icon="tasks"
                  placeholder="skills"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange("skills")}
                  // onBlur={handleBlur}
                  value={values.skills}
                />

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

export default OldMemberRegistrationScreen;
