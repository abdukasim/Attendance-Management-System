import React, { useEffect, useState } from "react";
import CustomList from "../../components/CustomList";
import { Overlay } from "react-native-elements";
import url from "../../helpers/url";
import KeyboardAvoidingWrapper from "../../components/KeyboardAvoidingWrapper";
import WaitingListModal from "../../components/WaitingListModal";
import { useFocusEffect } from "@react-navigation/native";
import { View } from "react-native";
import { ActivityIndicator } from "react-native";
import { Colors } from "../../components/styles";
import { StyleSheet } from "react-native";

const { brand } = Colors;

export default function WaitingListScreen({ waitingListFunc }) {
  const [inWaitingList, setInWaitingList] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [waitingUser, setWaitingUser] = useState({});
  const [visible, setVisible] = useState(false);
  const [fetching, setFetching] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  async function fetchWaitingList(fromUseFocusEffect) {
    !fromUseFocusEffect && setFetching(true);
    try {
      const res = await url.get("/api/attendance/registration/new");
      console.log(res.data.list);
      setInWaitingList(res.data.list);
      !fromUseFocusEffect && setFetching(false);
    } catch (err) {
      console.log(err);
      setHasError(err);
      !fromUseFocusEffect && setFetching(false);
    }
  }

  useEffect(() => {
    fetchWaitingList();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      let fromUseFocusEffect = true;
      fetchWaitingList(fromUseFocusEffect);
    }, [])
  );

  return (
    <View>
      {fetching ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={brand} />
        </View>
      ) : (
        <CustomList
          data={inWaitingList}
          getUser={setWaitingUser}
          toggleOverlay={toggleOverlay}
          fetchWaitingList={fetchWaitingList}
        />
      )}
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

const styles = StyleSheet.create({
  center: {
    paddingTop: 32,
    // display: "flexs",
    // flex: 1,
    // height: "90%",
    // justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: "red",
  },
});
