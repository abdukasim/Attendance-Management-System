import React, { useEffect, useState } from "react";
import { View } from "react-native";
import CustomList from "../../components/CustomList";
import { Overlay } from "react-native-elements";
import url from "../../helpers/url";
import AttendanceListModal from "../../components/AttendanceListModal";
import { useFocusEffect } from "@react-navigation/native";

export default function AttendanceScreen() {
  const [inAttendanceList, setInAttendanceList] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [AttendanceUser, setAttendanceUser] = useState({});
  const [visible, setVisible] = useState(false);

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

  return (
    <View>
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
