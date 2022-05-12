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
  const [present, setPresent] = useState(false);
  const [permission, setPermission] = useState(false);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePresentAttendance = async (status) => {
    try {
      const res = await url.post("/api/attendance/client/attendance/check", {
        id: dbId,
        present: status,
      });
      console.log(res.data);
      setMsgType("SUCCESS");
      setMessage("Status Changed to Present Successfully!");
      setTimeout(() => {
        toggleOverlay();
        fetchAttendanceList();
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error(error.response.data.description);
      setMsgType("ERROR");
      setMessage("Status Change Failed!");
      setIsLoading(false);
    }
  };
  const handlePermissionAttendance = async (status) => {
    try {
      const res = await url.post("/api/attendance/client/attendance/check", {
        id: dbId,
        permission: status,
      });
      console.log(res.data);
      setMsgType("SUCCESS");
      setMessage("Status Changed to Permission Successfully!");
      setTimeout(() => {
        toggleOverlay();
        fetchAttendanceList();
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error(error.response.data.description);
      setMsgType("ERROR");
      setMessage("Status Change Failed!");
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (present) {
      handlePresentAttendance(present);
    }
  }, [present]);
  useEffect(() => {
    if (permission) {
      handlePermissionAttendance(permission);
    }
  }, [permission]);

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
            setPresent(true);
            setIsLoading(true);
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
            setPermission(true);
            setIsLoading(true);
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
