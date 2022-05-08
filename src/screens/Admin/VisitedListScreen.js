import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
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
} from "../../components/styles";
import url from "../../helpers/url";

export default function VisitedListScreen({ visitedListFunc }) {
  const [inVisitedList, setInVisitedList] = useState();
  const [visitedUser, setVisitedUser] = useState({});
  const [visible, setVisible] = useState(false);

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

  const addToAttendance = async (id) => {
    try {
      const res = await url.post("/api/attendance/registration/accept", {
        id: id,
      });
      console.log(res.data);
      fetchVisitedList();
      toggleOverlay();
    } catch (error) {
      console.log(error);
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
              <>
                <StyledInputLabel>{key}</StyledInputLabel>
                <StyledTextDisplay>no children</StyledTextDisplay>
              </>
            )
          : content.push(
              <>
                <StyledInputLabel>{key}</StyledInputLabel>
                <StyledTextDisplay>
                  {childrenNumber.toString()}
                </StyledTextDisplay>
              </>
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
          <>
            <StyledInputLabel>{key}</StyledInputLabel>
            <StyledTextDisplay>{details[key]}</StyledTextDisplay>
          </>
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
          <SubTitle>{visitedUser.name}</SubTitle>
          <ScrollView>{renderDetails(visitedUser)}</ScrollView>
          <StyledButton onPress={() => addToAttendance(visitedUser.id)}>
            <ButtonText>Accept</ButtonText>
          </StyledButton>
        </StyledModal>
      </Overlay>
    </View>
  );
}
