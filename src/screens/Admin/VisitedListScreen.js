import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Overlay } from "react-native-elements";
import CustomList from "../../components/CustomList";
import {
  StyledModal,
  SubTitle,
  StyledButton,
  ButtonText,
  StyledInputLabel,
  StyledTextDisplay,
  MsgBox,
  Colors,
} from "../../components/styles";
import url from "../../helpers/url";
import { FontAwesome } from "@expo/vector-icons";
import { Audio } from "expo-av";

const { brand } = Colors;

export default function VisitedListScreen() {
  const [inVisitedList, setInVisitedList] = useState([]);
  const [visitedUser, setVisitedUser] = useState({});
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [audio, setAudio] = useState();

  const toggleOverlay = () => {
    setVisible(!visible);
  };
  const fetchVisitedList = async () => {
    try {
      const res = await url.get("/api/attendance/registration/visit");
      console.log(res.data.list);
      setInVisitedList(res.data.list);
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    fetchVisitedList();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchVisitedList();
    }, [])
  );

  const addToAttendance = async (id) => {
    setIsLoading(true);
    try {
      const res = await url.post("/api/attendance/registration/accept", {
        id: id,
      });
      console.log(res.data);
      setMsgType("SUCCESS");
      setMessage("Added to Attendance Successfully!\n id: " + res.data);
      setIsLoading(false);
      setTimeout(() => {
        setMsgType("");
        setMessage("");
        toggleOverlay();
      }, 2000);
      fetchVisitedList();
    } catch (error) {
      console.error(error.response.data.description);
      setMsgType("ERROR");
      setMessage("Status Change Failed!");
    }
  };

  const renderDetails = (details) => {
    console.log("details: ", details);
    let content = [];
    let ignore = ["id", "registrationDate", "visitDate"];
    for (const key in details) {
      if (ignore.includes(key)) {
        continue;
      }
      if (key == "children") {
        let childrenNumber = details.children.length;
        childrenNumber == 0
          ? content.push(
              <React.Fragment key={key}>
                <StyledInputLabel>{key}</StyledInputLabel>
                <StyledTextDisplay>no children</StyledTextDisplay>
              </React.Fragment>
            )
          : content.push(
              <React.Fragment key={key}>
                <StyledInputLabel>{key}</StyledInputLabel>
                <StyledTextDisplay>{childrenNumber}</StyledTextDisplay>
              </React.Fragment>
            );
      } else if (key == "image") {
        content.unshift(
          <React.Fragment key={key}>
            <StyledInputLabel>{key}</StyledInputLabel>
            <Image
              source={{ uri: "http://muntaha.herokuapp.com" + details[key] }}
              style={{
                width: 150,
                height: 150,
                borderRadius: 999,
                overflow: "hidden",
              }}
            />
          </React.Fragment>
        );
      } else if (key == "recording") {
        content.splice(
          1,
          0,
          <React.Fragment key={key}>
            <StyledInputLabel>{key}</StyledInputLabel>
            {console.log(details[key][0])}
            <TouchableOpacity
              onPress={async () => {
                console.log("Loading Sound");
                const { sound } = await Audio.Sound.createAsync({
                  uri: `https://muntaha.herokuapp.com${details[key][0]}`,
                });
                setAudio(sound);
                console.log("Sound Loaded", audio);
                console.log("Playing Sound");
                await sound.playAsync();
                // sound.setOnPlaybackStatusUpdate(async (status) => {
                //   console.log("Status", status);
                //   if (status.didJustFinish) {
                //     console.log("Finished");
                //     await sound.unloadAsync();
                //   }
                // });
              }}
              style={{ ...styles.buttonStyle, backgroundColor: brand }}
            >
              <FontAwesome name="play" size={20} color="white" />
            </TouchableOpacity>
          </React.Fragment>
        );
      } else if (key === "rent" && typeof details[key] === "object") {
        for (const [rentKey, value] of Object.entries(details[key])) {
          content.push(
            <React.Fragment key={rentKey}>
              <StyledInputLabel>
                {rentKey === "status" ? "shelterStatus" : "rentAmount"}
              </StyledInputLabel>
              <StyledTextDisplay>{value}</StyledTextDisplay>
            </React.Fragment>
          );
        }
      } else {
        content.push(
          <React.Fragment key={key}>
            <StyledInputLabel>{key}</StyledInputLabel>
            <StyledTextDisplay>{details[key]}</StyledTextDisplay>
          </React.Fragment>
        );
      }
    }
    return content;
  };

  return (
    <View>
      <CustomList
        data={inVisitedList}
        getUser={setVisitedUser}
        toggleOverlay={toggleOverlay}
        fetchVisitedList={fetchVisitedList}
      />
      <Overlay
        isVisible={visible}
        onBackdropPress={() => {
          toggleOverlay();
          setMessage("");
          setMsgType("");
        }}
      >
        <StyledModal>
          <ScrollView>
            <SubTitle>{visitedUser.name}</SubTitle>
            {msgType !== "SUCCESS" && renderDetails(visitedUser)}
            <MsgBox type={msgType}>{message}</MsgBox>
            {isLoading === false && msgType !== "SUCCESS" && (
              <StyledButton onPress={() => addToAttendance(visitedUser.id)}>
                <ButtonText>Accept</ButtonText>
              </StyledButton>
            )}
            {isLoading === true && (
              <StyledButton>
                <ActivityIndicator size="small" color="white" />
              </StyledButton>
            )}
          </ScrollView>
        </StyledModal>
      </Overlay>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    padding: 10,
    width: 50,
    height: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 999,
    marginRight: 20,
  },
});
