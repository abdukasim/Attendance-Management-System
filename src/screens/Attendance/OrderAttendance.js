import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Overlay } from "react-native-elements";
import AttendanceListModal from "../../components/AttendanceListModal";
import CustomList from "../../components/CustomList";
import OrderListModal from "../../components/OrderListModal";
import url from "../../helpers/url";

export default function OrderAttendance() {
  const [inOrderList, setInOrderList] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [OrderUser, setOrderUser] = useState({});
  const [visible, setVisible] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  async function fetchOrderList() {
    try {
      const res = await url.get("/api/attendance/client/attendance/o-list");
      setInOrderList(res.data.list);
    } catch (err) {
      setHasError(err);
    }
  }

  useEffect(() => {
    fetchOrderList();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchOrderList();
    }, [])
  );

  return (
    <View>
      <CustomList
        data={inOrderList}
        getUser={setOrderUser}
        toggleOverlay={toggleOverlay}
        fetchOrderList={fetchOrderList}
      />
      <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
        <OrderListModal
          name={OrderUser.name}
          id={OrderUser.muntahaID}
          dbId={OrderUser.id}
          fetchOrderList={fetchOrderList}
          toggleOverlay={toggleOverlay}
        />
      </Overlay>
    </View>
  );
}
