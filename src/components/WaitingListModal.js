import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Button,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

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
import { Formik, FieldArray, Field } from "formik";
import RadioForm from "react-native-simple-radio-button";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { Audio } from "expo-av";
import * as yup from "yup";

const { brand, tertiary, darkLight, primary, secondary } = Colors;

const WaitingListValidationSchema = yup.object().shape({
  age: yup.number().required("Age is required"),
  shelterStatus: yup.string().required("Shelter Status is required"),
  jobStatus: yup.string().required("Job Status is required"),
  maritalStatus: yup.string().required("Marital Status is required"),
});

const WaitingListModal = ({ name, id, fetchWaitingList, toggleOverlay }) => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [marital, setMarital] = useState();
  const [shelter, setShelter] = useState("");
  const [radioButton, setRadioButton] = useState();
  const [image, setImage] = useState(null);

  const [recording, setRecording] = useState();
  const [audio, setSound] = useState();
  const [playing, setPlaying] = useState(false);
  const [audioUri, setAudioUri] = useState();

  async function startRecording() {
    try {
      // Requesting permissions
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      // Starting recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      // Recording started
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    //  Recording stopped and stored at", uri
    setAudioUri(uri);
  }

  async function playSound() {
    // Loading Sound
    const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
    setSound(sound);
    // Souncd loaded

    // Playing Sound
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate(async (status) => {
      status.isPlaying && setPlaying(true);
      if (status.didJustFinish) {
        // Finished
        setPlaying(false);
        await sound.unloadAsync();
      }
    });
  }

  async function pauseSound() {
    // Pausing Sound
    await audio.pauseAsync();
    setPlaying(false);
  }

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
      toggleOverlay();
    }, 2000);
  };

  function getFormData(object) {
    const formData = new FormData();
    formData.append("image", {
      name: new Date() + "_profile.jpg",
      uri: object.image,
      type: "image/jpg",
    });
    formData.append("recording_1", {
      name: new Date() + "_audio.m4a",
      uri: audioUri,
      type: "audio/m4a",
    });
    Object.keys(object).forEach((key) => {
      if (key !== "image" && key !== "recording") {
        formData.append(key, object[key]);
      }
    });
    return formData;
  }
  const handleWaitingListForm = (data, setSubmitting) => {
    let bodyData = getFormData(data);

    fetch("http://137.184.58.100:8080/api/attendance/registration/visit", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      body: bodyData,
    })
      .then((res) => {
        handleMessage("Successfully added to visited list", "SUCCESS");
      })
      .catch((err) => {
        if (
          err.message === "Network Error" ||
          err.message === "Network request failed"
        ) {
          handleMessage("Successfully added to visited list", "SUCCESS");
        } else {
          handleMessage(err.message, "ERROR");
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <StyledModal>
      <SubTitle>{name}</SubTitle>
      <Formik
        initialValues={{
          id: id,
          image: "",
          age: "",
          maritalStatus: "",
          children: [{ name: "", age: "", schooling: "" }],
          jobStatus: "",
          shelterStatus: "",
          rent: "",
          // health: "",
          remark: "",
        }}
        validationSchema={WaitingListValidationSchema}
        onSubmit={(values, { setSubmitting }) => {
          handleWaitingListForm(values, setSubmitting);
        }}
      >
        {({
          handleSubmit,
          handleBlur,
          isSubmitting,
          values,
          errors,
          touched,
          setFieldValue,
          setFieldTouched,
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
                  <FontAwesome name="camera" size={20} color="black" />
                </TouchableOpacity>
              </View>
            </View>

            <StyledInputLabel>Record Audio</StyledInputLabel>
            <View style={styles.centeredView}>
              <TouchableOpacity
                onPress={recording ? stopRecording : startRecording}
                style={{
                  ...styles.buttonStyle,
                  backgroundColor: recording ? "red" : "green",
                }}
              >
                <Text style={{ color: "white" }}>
                  {recording ? (
                    <FontAwesome name="stop" size={20} color="white" />
                  ) : (
                    <FontAwesome name="microphone" size={20} color="white" />
                  )}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={playing ? pauseSound : playSound}
                style={{ ...styles.buttonStyle, backgroundColor: brand }}
              >
                {playing ? (
                  <FontAwesome name="pause" size={20} color="white" />
                ) : (
                  <FontAwesome name="play" size={20} color="white" />
                )}
              </TouchableOpacity>
            </View>

            <Field
              component={CustomTextInput}
              label="Age"
              name="age"
              icon="calendar"
              placeholder="age"
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

            <StyledInputLabel>Marital Status</StyledInputLabel>
            <Picker
              selectedValue={values.maritalStatus}
              onValueChange={(itemValue, itemIndex) => {
                setFieldTouched("maritalStatus", true);
                if (itemValue !== "default") {
                  setMarital(itemValue);
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

            {marital === "Married" && (
              <Field
                component={CustomTextInput}
                label="Spouse"
                name="spouse"
                icon="male"
                placeholder="spouse"
                placeholderTextColor={darkLight}
              />
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
                            placeholder="Name"
                            placeholderTextColor={darkLight}
                          />
                          <Field
                            component={CustomTextInput}
                            label="Child Age"
                            name={`children[${index}].age`}
                            icon="child"
                            placeholder="Age"
                            placeholderTextColor={darkLight}
                            keyboardType="numeric"
                          />
                          <Field
                            component={CustomTextInput}
                            label="Child Schooling"
                            name={`children[${index}].schooling`}
                            icon="child"
                            placeholder="Schooling"
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
                              <Text style={{ color: "white", fontSize: 20 }}>
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
                              <Text style={{ color: "white", fontSize: 20 }}>
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

            <Field
              component={CustomTextInput}
              label="JobType"
              name="jobStatus"
              icon="briefcase"
              placeholder="jobStatus"
              placeholderTextColor={darkLight}
            />

            <Field
              component={CustomTextInput}
              label="Remark"
              name="remark"
              icon="home"
              placeholder="remark"
              placeholderTextColor={darkLight}
            />

            <MsgBox type={messageType}>{message}</MsgBox>
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
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 22,
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
    borderWidth: 1,
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

export default WaitingListModal;
