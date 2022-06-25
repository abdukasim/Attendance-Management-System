import React, { useEffect, useState } from "react";
import CustomList from "../../components/CustomList";
import { Overlay } from "react-native-elements";
import url from "../../helpers/url";
import KeyboardAvoidingWrapper from "../../components/KeyboardAvoidingWrapper";
import WaitingListModal from "../../components/WaitingListModal";
import { useFocusEffect } from "@react-navigation/native";
import { View } from "react-native";
import axios from "axios";

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
      const res = await axios.get(
        "https://muntaha.herokuapp.com/api/attendance/registration/new"
      );
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

  useFocusEffect(
    React.useCallback(() => {
      fetchWaitingList();
    }, [])
  );

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
