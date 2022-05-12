import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import CustomList from "../../components/CustomList";
import { Overlay } from "react-native-elements";
import url from "../../helpers/url";
import AttendanceListModal from "../../components/AttendanceListModal";
import { useFocusEffect } from "@react-navigation/native";
import {
  ButtonText,
  MsgBox,
  StyledButton,
  StyledInputLabel,
  StyledModal,
  StyledTextDisplay,
  StyledTextInput,
  Colors,
  SubTitle,
} from "../../components/styles";

const { brand } = Colors;

export default function AttendanceScreen() {
  const [inAttendanceList, setInAttendanceList] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [AttendanceUser, setAttendanceUser] = useState({});
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("");
  const [edit, setEdit] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
    setEdit(false);
  };

  const toggleSwitch = () => {
    setEdit(!edit);
  };

  async function fetchAttendanceList() {
    try {
      const res = await url.get("/api/attendance/client");
      console.log("attendance", res.data.list);
      setInAttendanceList(res.data.list);
    } catch (err) {
      console.log(err);
      setHasError(err);
    }
  }

  useEffect(() => {
    fetchAttendanceList();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchAttendanceList();
    }, [])
  );

  const renderDetails = (details) => {
    let content = [];
    for (const key in details) {
      if (key == "children") {
        let childrenNumber = details.children.length;
        console.log(childrenNumber);
        childrenNumber == null
          ? content.push(
              <React.Fragment key={key}>
                <StyledInputLabel>{key}</StyledInputLabel>
                <StyledTextDisplay editable={edit}>
                  no children
                </StyledTextDisplay>
              </React.Fragment>
            )
          : content.push(
              <React.Fragment key={key}>
                <StyledInputLabel>{key}</StyledInputLabel>
                <StyledTextDisplay editable={edit}>
                  {childrenNumber.toString()}
                </StyledTextDisplay>
              </React.Fragment>
            );
      } else if (
        key == "id" ||
        key == "image" ||
        key == "registrationDate" ||
        key == "recording" ||
        key == "visitDate" ||
        key == "muntahaID" ||
        key == "attendance" ||
        key == "swap"
      ) {
        console.log("nth");
      } else {
        content.push(
          <React.Fragment key={key}>
            <StyledInputLabel>{key}</StyledInputLabel>
            <StyledTextDisplay editable={edit}>
              {details[key]}
            </StyledTextDisplay>
          </React.Fragment>
        );
      }
    }
    return content;
  };

  return (
    <View>
      <CustomList
        data={inAttendanceList}
        getUser={setAttendanceUser}
        toggleOverlay={toggleOverlay}
        fetchAttendanceList={fetchAttendanceList}
      />

      <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
        <StyledModal>
          <ScrollView>
            {/* <SubTitle>{AttendanceUser.name}</SubTitle> */}
            <SubTitle>{AttendanceUser.muntahaID}</SubTitle>
            <Switch
              trackColor={{ false: "#767577", true: "#f9a12eff" }}
              thumbColor={edit ? brand : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={edit}
            />
            {renderDetails(AttendanceUser)}
            <MsgBox type={msgType}>{message}</MsgBox>
            {edit && (
              <StyledButton onPress={() => console.log("Submit")}>
                <ButtonText>Edit</ButtonText>
              </StyledButton>
            )}
          </ScrollView>
        </StyledModal>
      </Overlay>
    </View>
  );
}
