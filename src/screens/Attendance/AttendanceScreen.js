import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import CustomList from "../../components/CustomList";
import { Overlay } from "react-native-elements";
import url from "../../helpers/url";
import AttendanceListModal from "../../components/AttendanceListModal";
import { useFocusEffect } from "@react-navigation/native";
import { ButtonText, MsgBox, StyledButton } from "../../components/styles";
import Stats from "../../components/Stats";
import { Colors } from "../../components/styles";

const { brand } = Colors;

export default function AttendanceScreen() {
  const [inAttendanceList, setInAttendanceList] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [AttendanceUser, setAttendanceUser] = useState({});
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");
  const [fetching, setFetching] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  function fetchAttendanceList(fromUseFocusEffect) {
    !fromUseFocusEffect && setFetching(true);
    url
      .get("/api/attendance/client")
      .then((res) => {
        setInAttendanceList(res.data.list);
        setFetching(false);
      })
      .catch((err) => {
        setHasError(err);
        setFetching(false);
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
    React.useCallback(() => {
      let fromUseFocusEffect = true;
      fetchAttendanceList(fromUseFocusEffect);
    }, [])
  );

  return (
    <View>
      <Stats />

      {fetching ? (
        <View style={{ paddingTop: 32 }}>
          <ActivityIndicator size="large" color={brand} />
        </View>
      ) : (
        <CustomList
          data={inAttendanceList}
          getUser={setAttendanceUser}
          toggleOverlay={toggleOverlay}
          fetchAttendanceList={fetchAttendanceList}
        />
      )}

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
