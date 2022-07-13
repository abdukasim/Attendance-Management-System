import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import CustomList from "../../components/CustomList";
import { Overlay } from "react-native-elements";
import url from "../../helpers/url";
import AttendanceListModal from "../../components/AttendanceListModal";
import { useFocusEffect } from "@react-navigation/native";
import { ButtonText, MsgBox, StyledButton } from "../../components/styles";
import Stats from "../../components/Stats";
import axios from "axios";

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

  function fetchAttendanceList() {
    url
      .get("/api/attendance/client")
      .then((res) => {
        console.log(res);
        setInAttendanceList(res.data.list);
      })
      .catch((err) => {
        console.log(err.message);
        setHasError(err);
      });

    // return source;
  }

  useEffect(() => {
    fetchAttendanceList();

    // return () => {
    //   console.log("unmounting");
    //   source.cancel();
    // };
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAttendanceList();
    }, [])
  );

  const nextDay = () => {
    setIsLoading(true);
    try {
      const res = url.post("/api/attendance/client/attendance/invoke");
      // console.log(res);
      setMsg("Successfully invoked next day attendance");
      setMsgType("SUCCESS");
      setIsLoading(false);
      setTimeout(() => {
        setMsg("");
        setMsgType("");
        setIsLoading(false);
      }, 1000);
      fetchAttendanceList();
    } catch (error) {
      console.log("next day: ", error.message);
      setMsg("Error invoking next day attendance");
      setMsgType("ERROR");
      setIsLoading(false);
      setTimeout(() => {
        setMsg("");
        setMsgType("");
        setIsLoading(false);
      }, 1000);
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
      <Stats />
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
