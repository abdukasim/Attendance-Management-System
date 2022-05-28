import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import CustomList from "../../components/CustomList";
import { Overlay } from "react-native-elements";
import url from "../../helpers/url";
import AttendanceListModal from "../../components/AttendanceListModal";
import { useFocusEffect } from "@react-navigation/native";
import {
  Button,
  ButtonText,
  MsgBox,
  StyledButton,
} from "../../components/styles";

export default function AttendanceScreen() {
  const [inAttendanceList, setInAttendanceList] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [AttendanceUser, setAttendanceUser] = useState({});
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");

  const toggleOverlay = () => {
    setVisible(!visible);
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

  const nextDay = () => {
    setIsLoading(true);
    try {
      const res = url.post("/api/attendance/client/attendance/invoke");
      console.log(res);
      setMsg("Successfully invoked next day attendance");
      setMsgType("SUCCESS");
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setMsg("Error invoking next day attendance");
      setMsgType("ERROR");
      setIsLoading(false);
    }
  };

  return (
    <View>
      {isLoading === false && (
        <StyledButton onPress={() => nextDay()}>
          <ButtonText>Next Day</ButtonText>
        </StyledButton>
      )}
      {isLoading === true && (
        <StyledButton onPress={() => nextDay()}>
          <ActivityIndicator size="small" color="white" />
        </StyledButton>
      )}
      <MsgBox type={msgType}>{msg}</MsgBox>

      <CustomList
        data={inAttendanceList}
        getUser={setAttendanceUser}
        toggleOverlay={toggleOverlay}
        fetchAttendanceList={fetchAttendanceList}
      />

      <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
        <AttendanceListModal
          name={AttendanceUser.name}
          id={AttendanceUser.muntahaID}
          dbId={AttendanceUser.id}
          dayStatus={AttendanceUser.swap}
          fetchAttendanceList={fetchAttendanceList}
          toggleOverlay={toggleOverlay}
        />
      </Overlay>
    </View>
  );
}
