import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Overlay } from "react-native-elements";
import CustomList from "../../components/CustomList";
import CustomTextInput from "../../components/CustomTextInput";
import {
  StyledModal,
  SubTitle,
  StyledButton,
  ButtonText,
  StyledInputLabel,
  StyledTextDisplay,
  MsgBox,
} from "../../components/styles";
import url from "../../helpers/url";

export default function VisitedListScreen({ visitedListFunc }) {
  const [inVisitedList, setInVisitedList] = useState([]);
  const [visitedUser, setVisitedUser] = useState({});
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("");

  const toggleOverlay = () => {
    setVisible(!visible);
  };
  const fetchVisitedList = async () => {
    try {
      const res = await url.get("/api/attendance/registration/visit");
      console.log(res.data.list);
      setInVisitedList(res.data.list);
    } catch (err) {
      console.log(err);
      // setHasError(err);
    }
  };
  useEffect(() => {
    fetchVisitedList();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchVisitedList();
    }, [])
  );

  const addToAttendance = async (id) => {
    try {
      const res = await url.post("/api/attendance/registration/accept", {
        id: id,
      });
      console.log(res.data);
      setMsgType("SUCCESS");
      setMessage("Added to Attendance Successfully!");
      setTimeout(() => {
        toggleOverlay();
        fetchVisitedList();
        setMessage("");
        setMsgType("");
      }, 1000);
    } catch (error) {
      console.error(error.response.data.description);
      setMsgType("ERROR");
      setMessage("Status Change Failed!");
    }
  };

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
                <StyledTextDisplay>no children</StyledTextDisplay>
              </React.Fragment>
            )
          : content.push(
              <React.Fragment key={key}>
                <StyledInputLabel>{key}</StyledInputLabel>
                <StyledTextDisplay>
                  {childrenNumber.toString()}
                </StyledTextDisplay>
              </React.Fragment>
            );
      } else if (
        key == "id" ||
        key == "image" ||
        key == "registrationDate" ||
        key == "recording" ||
        key == "birthday" ||
        key == "visitDate"
      ) {
        console.log("nth");
      } else {
        content.push(
          <React.Fragment key={key}>
            <StyledInputLabel>{key}</StyledInputLabel>
            <StyledTextDisplay>{details[key]}</StyledTextDisplay>
          </React.Fragment>
        );
      }
    }
    return content;
  };

  return (
    <View>
      <CustomList
        data={inVisitedList}
        getUser={setVisitedUser}
        toggleOverlay={toggleOverlay}
        fetchVisitedList={fetchVisitedList}
      />
      <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
        <StyledModal>
          <ScrollView>
            <SubTitle>{visitedUser.name}</SubTitle>
            {renderDetails(visitedUser)}
            <MsgBox type={msgType}>{message}</MsgBox>
            <StyledButton onPress={() => addToAttendance(visitedUser.id)}>
              <ButtonText>Accept</ButtonText>
            </StyledButton>
          </ScrollView>
        </StyledModal>
      </Overlay>
    </View>
  );
}
