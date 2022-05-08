import React, { useEffect, useState } from "react";
import { View } from "react-native";
import CustomList from "../../components/CustomList";
import { Overlay } from "react-native-elements";
import url from "../../helpers/url";
import KeyboardAvoidingWrapper from "../../components/KeyboardAvoidingWrapper";
import WaitingListModal from "../../components/WaitingListModal";

export default function WaitingListScreen({ waitingListFunc }) {
  const [inWaitingList, setInWaitingList] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [waitingUser, setWaitingUser] = useState({});
  const [visible, setVisible] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  async function fetchWaitingList() {
    try {
      const res = await url.get("/api/attendance/registration/new");
      console.log(res.data.list);
      setInWaitingList(res.data.list);
    } catch (err) {
      console.log(err);
      setHasError(err);
    }
  }

  useEffect(() => {
    fetchWaitingList();
  }, []);

  return (
    <View>
      <CustomList
        data={inWaitingList}
        getUser={setWaitingUser}
        toggleOverlay={toggleOverlay}
        fetchWaitingList={fetchWaitingList}
      />

      <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
        <KeyboardAvoidingWrapper>
          <WaitingListModal
            name={waitingUser.name}
            id={waitingUser.id}
            fetchWaitingList={fetchWaitingList}
            toggleOverlay={toggleOverlay}
          />
        </KeyboardAvoidingWrapper>
      </Overlay>
    </View>
  );
}