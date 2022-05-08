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
      }, 1000);
    } catch (error) {
      console.error(error.response.data.description);
      setMsgType("ERROR");
      setMessage("Status Change Failed!");
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
      }, 1000);
    } catch (error) {
      console.error(error.response.data.description);
      setMsgType("ERROR");
      setMessage("Status Change Failed!");
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

      {dayStatus.present === true && (
        <MsgBox>
          {" "}
          <Text>Present</Text>{" "}
        </MsgBox>
      )}
      {dayStatus.reason?.excused === true && (
        <MsgBox>
          {" "}
          <Text>Permission</Text>{" "}
        </MsgBox>
      )}
      <ButtonWrapper>
        <Button
          color={green}
          onPress={() => {
            setPresent(true);
          }}
        >
          <ButtonText>Present</ButtonText>
        </Button>
        <Button color={red}>
          <ButtonText>Absent</ButtonText>
        </Button>
        <Button
          color={brand}
          onPress={() => {
            setPermission(true);
          }}
        >
          <ButtonText>Permission</ButtonText>
        </Button>
        <MsgBox type={msgType}>{message}</MsgBox>
      </ButtonWrapper>
    </AttendanceModal>
  );
}
