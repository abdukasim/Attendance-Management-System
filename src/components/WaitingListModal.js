import React, { useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import {
  Colors,
  StyledModal,
  SubTitle,
  StyledFormArea,
  StyledInputLabel,
  StyledButton,
  ButtonText,
  MsgBox,
} from "./styles";
import CustomTextInput from "./CustomTextInput";
import { Formik, FieldArray } from "formik";
// import { Audio } from "expo-av";
import RadioForm from "react-native-simple-radio-button";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import url from "../helpers/url";

const { brand, tertiary, darkLight, primary, secondary } = Colors;

const WaitingListModal = ({ name, id, fetchWaitingList, toggleOverlay }) => {
  // const [recording, setRecording] = useState();
  // const [recordings, setRecordings] = useState([]);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("");
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date(2000, 0, 1));
  const [dob, setDob] = useState();
  const [marital, setMaritalStatus] = useState();
  const [radioButton, setRadioButton] = useState();

  const radio_props = [
    { label: "Yes", value: 0 },
    { label: "No", value: 1 },
  ];

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    setDob(currentDate);
  };

  const showDatePicker = () => {
    setShow(true);
  };

  const handleWaitingListForm = (data, setSubmitting) => {
    url
      .post("/api/attendance/registration/visit", data)
      .then((res) => {
        res.status === 200 && setSubmitting(false);
        console.log(res.status);
        setMsgType("SUCCESS");
        setMessage("Successfully added to waiting list");
        setTimeout(() => {
          toggleOverlay();
          fetchWaitingList();
        }, 1000);
      })
      .catch((err) => {
        console.log(err.response.data.description);
        setMsgType("ERROR");
        setMessage("Failed to update user!");
        setSubmitting(false);
      });
  };

  return (
    <StyledModal>
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
      <SubTitle>{name}</SubTitle>
      <Formik
        initialValues={{
          id: id,
          birthday: "",
          maritalStatus: "",
          children: [{ name: "", age: "", schooling: "" }],
          jobStatus: "",
          rent: "",
          health: "",
          remark: "",
        }}
        onSubmit={(values, { setSubmitting }) => {
          console.log(values);
          handleWaitingListForm(values, setSubmitting);
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
                    {values.children?.length > 0 &&
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

            <CustomTextInput
              label="JobType"
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
              label="Health"
              name="health"
              icon="home"
              placeholder="health"
              placeholderTextColor={darkLight}
              onChangeText={handleChange("health")}
              // onBlur={handleBlur}
              value={values.health}
            />
            <CustomTextInput
              label="remark"
              name="remark"
              icon="home"
              placeholder="remark"
              placeholderTextColor={darkLight}
              onChangeText={handleChange("remark")}
              // onBlur={handleBlur}
              value={values.remark}
            />
            <MsgBox type={msgType}>{message}</MsgBox>
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
    </StyledModal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  fill: {
    flex: 1,
    margin: 16,
  },
  button: {
    margin: 16,
  },
});

export default WaitingListModal;
