import React, { useEffect, useState } from "react";
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomList from "../../components/CustomList";
import { Overlay } from "react-native-elements";
import url from "../../helpers/url";
import AttendanceListModal from "../../components/AttendanceListModal";
import { useFocusEffect } from "@react-navigation/native";
import {
  ButtonText,
  MsgBox,
  StyledButton,
  StyledInputLabel,
  StyledModal,
  StyledTextDisplay,
  StyledTextInput,
  Colors,
  SubTitle,
} from "../../components/styles";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import axios from "axios";
import { ActivityIndicator } from "react-native";

const { brand } = Colors;

export default function AttendanceScreen() {
  const [inAttendanceList, setInAttendanceList] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [AttendanceUser, setAttendanceUser] = useState({});
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("");
  const [edit, setEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
    setEdit(false);
  };

  const toggleSwitch = () => {
    setEdit(!edit);
  };

  useEffect(() => {
    console.log("children", AttendanceUser.children);
  }, [AttendanceUser.children?.length]);

  // html variable to display user data
  const html = `
    <html>
      <head>
        <style>
          html, body {
            margin: 0;
            padding: 0;
          }
          h4 {
            margin: 0;
            padding: 0;
          }
          .content-text {
            font-size: 12px;
            font-family: sans-serif;
            margin: 0;
            padding: 2px 5px 0px 0;
            background-color: red;
          }
          .child-list {
            width: 100%
            display: flex;
            flex-direction: column;
          }
        </style>
      </head>
      <body>
          <div>
            <img src="http://137.184.58.100:8080/assets/imgs/MuntahaFoundationLogo.png" alt="Muntaha Foundation" width="100" height="150" />
            <hr />
            <div className="content-wrapper">
              <h4>Image</h4>
            <img src="http://137.184.58.100:8080${
              AttendanceUser.image
            }" alt="Muntaha Foundation" width="100" height="100" style={border-radius: 999} />
            </div>
            <div className="content-wrapper">
            <h4>Name</h4>
            <p className="content-text">${AttendanceUser.name}</p>
          </div>
            <div className="content-wrapper">
              <h4>Phone</h4>
              <p className="content-text">${AttendanceUser.phone}</p>
            </div>
            <div className="content-wrapper">
              <h4>age</h4>
              <p className="content-text">${AttendanceUser.age}</p>
            </div>
            <div className="content-wrapper">
            <h4>Address</h4>
            <p className="content-text">${AttendanceUser.address}</p>
          </div>
          <div className="content-wrapper">
          ${
            AttendanceUser.children?.length
              ? AttendanceUser.children.map(
                  (child, index) =>
                    `<div key={index} className="child-list">
                    <h4>Child Name</h4>
                  <p className="content-text">${child.name}</p>
                  <h4>Child Age</h4>
                  <p className="content-text">${child.age}</p>
                  <h4>Child Schooling</h4>
                  <p className="content-text">${child.schooling}</p>
                </div>`
                )
              : `
              <div>
                <h4>Children</h4>
                <p className="content-text">${AttendanceUser.children?.length}</p>
              </div>`
          } 
        </div>
          </div>
      </body>
    </html>
  `;
  const createAndSavePDF = async (html) => {
    try {
      const { uri } = await Print.printToFileAsync({
        name: "report",
        html: html,
        base64: false,
      });
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error(error);
    }
  };

  async function fetchAttendanceList(fromUseFocusEffect) {
    !fromUseFocusEffect && setFetching(true);
    try {
      const res = await url.get("/api/attendance/client", {
        params: { type: "full" },
      });
      setInAttendanceList(res.data.list);
      !fromUseFocusEffect && setFetching(false);
    } catch (err) {
      setHasError(err);
      !fromUseFocusEffect && setFetching(false);
    }
  }

  const editProfile = async (user) => {
    try {
      const res = await url.put("/api/attendance/client", user);
      setMsgType("SUCCESS");
      setMessage("Edited Successfully!");
      setTimeout(() => {
        toggleOverlay();
        fetchAttendanceList();
        setIsLoading(false);
        setMsgType("");
        setMessage("");
      }, 1000);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProfile = async (user) => {
    try {
      const res = await url.delete("/api/attendance/client", {
        data: { id: user },
      });
      setMsgType("SUCCESS");
      setMessage("Deleted Successfully!");
      setTimeout(() => {
        toggleOverlay();
        fetchAttendanceList();
        setIsLoading(false);
        setMsgType("");
        setMessage("");
      }, 1000);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAttendanceList();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      let fromUseFocusEffect = true;
      fetchAttendanceList(fromUseFocusEffect);
    }, [])
  );
  const renderDetails = (details) => {
    let content = [];
    let ignore = [
      "id",
      "registrationDate",
      "recording",
      "visitDate",
      "muntahaID",
      "attendance",
      "swap",
    ];

    const _edit = (key, text) => {
      const newAttendanceUser = { ...AttendanceUser };
      newAttendanceUser[key] = text;
      setAttendanceUser(newAttendanceUser);
    };

    for (const key in details) {
      if (ignore.includes(key)) {
        continue;
      }
      if (key == "children") {
        details[key].map((child, index) => {
          content.push(
            <React.Fragment key={index}>
              <StyledInputLabel>Child Name</StyledInputLabel>
              <StyledTextDisplay
                editable={edit}
                onChangeText={(text) => {
                  const newDetails = { ...details[key][index] };
                  newDetails.name = text;
                  details[key][index] = newDetails;
                  _edit(key, details[key]);
                }}
              >
                {child.name}
              </StyledTextDisplay>
              <StyledInputLabel>Child Age</StyledInputLabel>
              <StyledTextDisplay
                editable={edit}
                onChangeText={(text) => {
                  const newDetails = { ...details[key][index] };
                  newDetails.age = text;
                  details[key][index] = newDetails;
                  _edit(key, details[key]);
                }}
              >
                {child.age}
              </StyledTextDisplay>
              <StyledInputLabel>Child Schooling Level</StyledInputLabel>
              <StyledTextDisplay
                editable={edit}
                onChangeText={(text) => {
                  const newDetails = { ...details[key][index] };
                  newDetails.schooling = text;
                  details[key][index] = newDetails;
                  _edit(key, details[key]);
                }}
              >
                {child.schooling}
              </StyledTextDisplay>
            </React.Fragment>
          );
        });
      } else if (key == "image") {
        content.unshift(
          <React.Fragment key={key}>
            <StyledInputLabel>{key}</StyledInputLabel>
            <Image
              source={{ uri: "http://137.184.58.100:8080" + details[key] }}
              style={{
                width: 200,
                height: 200,
                borderRadius: 999,
                overflow: "hidden",
              }}
            />
          </React.Fragment>
        );
      } else {
        content.push(
          <React.Fragment key={key}>
            <StyledInputLabel>{key}</StyledInputLabel>
            <StyledTextDisplay
              editable={edit}
              onChangeText={(text) => _edit(key, text)}
            >
              {details[key]}
            </StyledTextDisplay>
          </React.Fragment>
        );
      }
    }
    return content;
  };

  return (
    <View>
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
        <StyledModal>
          <ScrollView>
            {/* <SubTitle>{AttendanceUser.name}</SubTitle> */}
            <SubTitle>{AttendanceUser.muntahaID}</SubTitle>
            <Switch
              trackColor={{ false: "#767577", true: "#f9a12eff" }}
              thumbColor={edit ? brand : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={edit}
            />
            {renderDetails(AttendanceUser)}
            <MsgBox type={msgType}>{message}</MsgBox>
            {edit && (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                  marginBottom: 20,
                }}
              >
                <TouchableOpacity
                  onPress={() => editProfile(AttendanceUser)}
                  style={{
                    padding: 10,
                    backgroundColor: "#642993",
                    width: 100,
                    borderRadius: 5,
                  }}
                >
                  <Text style={{ textAlign: "center", color: "white" }}>
                    Edit
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteProfile(AttendanceUser.id)}
                  style={{
                    padding: 10,
                    backgroundColor: "red",
                    width: 100,
                    borderRadius: 5,
                  }}
                >
                  <Text style={{ textAlign: "center", color: "white" }}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <StyledButton onPress={() => createAndSavePDF(html)}>
              <ButtonText>Save as PDF</ButtonText>
            </StyledButton>
          </ScrollView>
        </StyledModal>
      </Overlay>
    </View>
  );
}
