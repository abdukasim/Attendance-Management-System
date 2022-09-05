import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import url from "../helpers/url";
import {
  Button,
  ButtonText,
  ButtonWrapper,
  SubTitle,
  Colors,
  AttendanceModal,
  MsgBox,
} from "./styles";

const { green, red, brand } = Colors;

export default function AttendanceListModal({
  name,
  id,
  dbId,
  toggleOverlay,
  dayStatus,
  fetchAttendanceList,
}) {
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePresentAttendance = (status) => {
    try {
      const res = url.post("/api/attendance/client/attendance/check", {
        id: dbId,
        present: status,
      });
      setMsgType("SUCCESS");
      setMessage("Status Changed to Present Successfully!");
      setTimeout(() => {
        toggleOverlay();
        setIsLoading(false);
      }, 1000);
      fetchAttendanceList();
    } catch (error) {
      console.error(error.response.data.description);
      setMsgType("ERROR");
      setMessage("Status Change Failed!");
      setIsLoading(false);
    }
  };
  const handlePermissionAttendance = (status) => {
    try {
      const res = url.post("/api/attendance/client/attendance/check", {
        id: dbId,
        permission: status,
      });
      setMsgType("SUCCESS");
      setMessage("Status Changed to Permission Successfully!");
      setTimeout(() => {
        toggleOverlay();
        setIsLoading(false);
      }, 1000);
      fetchAttendanceList();
    } catch (error) {
      console.error(error.response.data.description);
      setMsgType("ERROR");
      setMessage("Status Change Failed!");
      setIsLoading(false);
    }
  };

  return (
    <AttendanceModal>
      <SubTitle>{name}</SubTitle>
      <SubTitle>{id}</SubTitle>

      {dayStatus.present === true && <MsgBox>Present</MsgBox>}
      {dayStatus.reason?.excused === true && <MsgBox>Permission</MsgBox>}
      <ButtonWrapper>
        <Button
          color={green}
          onPress={() => {
            setIsLoading(true);
            handlePresentAttendance(true);
          }}
          disabled={
            dayStatus.present === true ||
            isLoading === true ||
            dayStatus.reason?.excused === true
              ? true
              : false
          }
        >
          <ButtonText>Present</ButtonText>
        </Button>
        <Button
          color={brand}
          onPress={() => {
            setIsLoading(true);
            handlePermissionAttendance(true);
          }}
          disabled={
            dayStatus.present === true ||
            isLoading === true ||
            dayStatus.reason?.excused === true
              ? true
              : false
          }
        >
          <ButtonText>Permission</ButtonText>
        </Button>
        <MsgBox type={msgType}>{message}</MsgBox>
      </ButtonWrapper>
    </AttendanceModal>
  );
}
