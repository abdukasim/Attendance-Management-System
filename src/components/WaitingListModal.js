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
import { Formik, FieldArray } from "formik";
import RadioForm from "react-native-simple-radio-button";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { Audio } from "expo-av";

const { brand, tertiary, darkLight, primary, secondary } = Colors;

const WaitingListModal = ({ name, id, fetchWaitingList, toggleOverlay }) => {
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("");
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
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);
    setAudioUri(uri);
    console.log(typeof audioUri);
    // FormikProps.setFieldValue("audio", uri);
  }

  async function playSound() {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
    setSound(sound);
    console.log("Souncd loaded", audio);

    console.log("Playing Sound");
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate(async (status) => {
      console.log("Status", status);
      status.isPlaying && setPlaying(true);
      if (status.didJustFinish) {
        console.log("Finished");
        setPlaying(false);
        await sound.unloadAsync();
      }
    });
  }

  async function pauseSound() {
    console.log("Pausing Sound");
    await audio.pauseAsync();
    setPlaying(false);
  }
  // React.useEffect(() => {
  //   return audio
  //     ? () => {
  //         console.log("Unloading Sound");
  //         audio.unloadAsync();
  //       }
  //     : undefined;
  // }, [audio]);

  const radio_props = [
    { label: "Yes", value: 0 },
    { label: "No", value: 1 },
  ];

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
    console.log(formData);
    return formData;
  }
  const handleWaitingListForm = (data, setSubmitting) => {
    console.log("data: ", data);
    let bodyData = getFormData(data);

    fetch("https://muntaha.herokuapp.com/api/attendance/registration/visit", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      body: bodyData,
    })
      .then((res) => {
        console.log(res.status);
        setMsgType("SUCCESS");
        setMessage("Successfully added to visited list");
        setTimeout(() => {
          toggleOverlay();
          fetchWaitingList();
        }, 1000);
      })
      .catch((err) => {
        if (
          err.message === "Network Error" ||
          err.message === "Network request failed"
        ) {
          setMsgType("SUCCESS");
          setMessage("Successfully added to visited list");
          setTimeout(() => {
            toggleOverlay();
            fetchWaitingList();
          }, 1000);
        } else {
          setMsgType("ERROR");
          setMessage(err.message);
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  useEffect(() => {
    console.log("image: ", image);
  }, [image]);
  return (
    <StyledModal>
      <SubTitle>{name}</SubTitle>
      <Formik
        initialValues={{
          id: id,
          age: "",
          maritalStatus: "",
          children: [{ name: "", age: "", schooling: "" }],
          jobStatus: "",
          shelterStatus: "",
          rent: "",
          // health: "",
          remark: "",
        }}
        onSubmit={(values, { setSubmitting }) => {
          // check if values are empty
          if (
            values.maritalStatus === "" ||
            values.jobStatus === "" ||
            values.shelterStatus === ""
          ) {
            setMsgType("ERROR");
            setMessage("Please fill all the fields");
            setTimeout(() => {
              setMsgType("");
              setMessage("");
            }, 2000);
            setSubmitting(false);
          } else {
            handleWaitingListForm(values, setSubmitting);
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

            <CustomTextInput
              label="Age"
              name="age"
              icon="calendar"
              placeholder="age"
              placeholderTextColor={darkLight}
              onChangeText={handleChange("age")}
              value={values.age}
              keyboardType="numeric"
              // onBlur={handleBlur}
            />

            <StyledInputLabel>Shelter Status</StyledInputLabel>
            <Picker
              prompt={"Select"}
              selectedValue={values.shelterStatus}
              onValueChange={(itemValue, itemIndex) => {
                if (itemValue !== "default") {
                  setFieldValue("shelterStatus", itemValue);
                  setShelter(itemValue);
                }
              }}
              style={styles.pickerStyle}
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

            {shelter === "rent" && (
              <CustomTextInput
                label="Rent Amount"
                name="rent"
                icon="money"
                placeholder="rent amount"
                placeholderTextColor={darkLight}
                onChangeText={handleChange("rent")}
                value={values.rent}
                keyboardType="numeric"
              />
            )}

            <StyledInputLabel>Marital Status</StyledInputLabel>
            <Picker
              prompt={"Select Marital"}
              selectedValue={values.maritalStatus}
              onValueChange={(itemValue, itemIndex) => {
                if (itemValue !== "default") {
                  setMarital(itemValue);
                  setFieldValue("maritalStatus", itemValue);
                }
              }}
              style={styles.pickerStyle}
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
                            name={`children[${index}].name`}
                            icon="child"
                            placeholder="Name"
                            placeholderTextColor={darkLight}
                            onChangeText={handleChange(
                              `children[${index}].name`
                            )}
                            value={child.name}
                            // onBlur={handleBlur}
                          />
                          <CustomTextInput
                            label="Child Age"
                            name={`children[${index}].age`}
                            icon="child"
                            placeholder="Age"
                            placeholderTextColor={darkLight}
                            onChangeText={handleChange(
                              `children[${index}].age`
                            )}
                            value={child.age}
                            keyboardType="numeric"
                            // onBlur={handleBlur}
                          />
                          <CustomTextInput
                            label="Child Schooling"
                            name={`children[${index}].schooling`}
                            icon="child"
                            placeholder="Schooling"
                            placeholderTextColor={darkLight}
                            onChangeText={handleChange(
                              `children[${index}].schooling`
                            )}
                            value={child.schooling}
                            // onBlur={handleBlur}
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
              label="Remark"
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
