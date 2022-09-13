import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "@react-navigation/native";
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { DataTable } from "react-native-paper";
import {
  Button,
  ButtonText,
  Colors,
  StyledButton,
  StyledInputLabel,
  StyledTextInput,
  SubTitle,
} from "../../components/styles";
import url from "../../helpers/url";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { StorageAccessFramework } from "expo-file-system";
const { primary, tertiary } = Colors;

export default function App() {
  const [selectedDuration, setSelectedDuration] = useState("week");
  const [count, setCount] = useState(1);
  const [report, setReport] = useState([]);
  const [absenteeReport, setAbsenteeReport] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchReport();
    fetchAbsenteesReport();
    setRefreshing(false);
  }, []);

  const img = require("../../../assets/MuntahaFoundationLogo.png");

  const pickerRef = useRef();

  function open() {
    pickerRef.current.focus();
  }

  function close() {
    pickerRef.current.blur();
  }

  const html = `
    <html>
      <head>
        <style>
          table {
            border-collapse: collapse;
            width: 100%;
          }
          th, td {
            text-align: left;
            padding: 8px;
          }
          tr:nth-child(even){background-color: #f2f2f2}
        </style>
      </head>
      <body>
      <div style="display: flex; flex-direction: row; align-items: center">
        <img src="http://137.184.58.100:8080/assets/imgs/MuntahaFoundationLogo.png" alt="Muntaha Foundation" width="100" height="150" />
        <h1>Muntaha Foundation</h1>
      </div>
        <h2>Attendance Report</h2>
        <h2>${selectedDuration}</h2>
        <table>
          <tr>
            <th>Duration</th>
            <th>Present</th>
            <th>Absent</th>
            <th>Permission</th>
          </tr>
          ${
            (selectedDuration === "week" || selectedDuration === "month") &&
            report.map((item) => {
              return `
              <tr>
                <td>
                ${item.end.slice(4, 10).replace("-", "/")} - ${item.start
                .slice(4, 10)
                .replace("-", "/")}
                </td>
                <td>${item.total.present}</td>
                <td>${item.total.absent}</td>
                <td>${item.total.permission}</td>
              </tr>
            `;
            })
          }
          ${
            selectedDuration === "day" &&
            report[0].report.map((item) => {
              return `
              <tr>
                <td>
                ${item.timestamp.slice(0, 10).replace("-", "/")}
                </td>
                <td>${item.present}</td>
                <td>${item.absent}</td>
                <td>${item.permission}</td>
              </tr>
            `;
            })
          }
        </table>
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

  const fetchReport = async () => {
    try {
      const res = await url.get("/api/attendance/report", {
        params: { type: selectedDuration, count: count },
      });
      // console.log("report", res);
      // selectedDuration === "day"
      //   ? setReport(res.data.report.report)
      //   : setReport(res.data.report);
      setReport(res.data.report);
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchAbsenteesReport = async () => {
    try {
      const res = await url.get("/api/attendance/report/absent");
      console.log("absentees report", res.data);
      setAbsenteeReport(res.data.list);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchReport();
    fetchAbsenteesReport();
  }, []);

  useEffect(() => {
    fetchReport();
  }, [selectedDuration, count]);

  useFocusEffect(
    React.useCallback(() => {
      fetchReport();
      fetchAbsenteesReport();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={{ paddingHorizontal: 10 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <View>
            <StyledInputLabel>Select Duration</StyledInputLabel>
            <Picker
              ref={pickerRef}
              selectedValue={selectedDuration}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedDuration(itemValue)
              }
              style={styles.pickerStyle}
            >
              <Picker.Item label="Daily" value="day" />
              <Picker.Item label="Weekly" value="week" />
              <Picker.Item label="Monthly" value="month" />
            </Picker>
          </View>
          <View>
            <StyledInputLabel>Report Includes</StyledInputLabel>
            <StyledTextInput
              placeholder="include ..."
              keyboardType="numeric"
              onChangeText={(text) => setCount(text)}
            ></StyledTextInput>
          </View>
        </View>
        {selectedDuration === "daily" && (
          <SubTitle style={{ paddingTop: 20 }}>Daily Report</SubTitle>
        )}
        {selectedDuration === "weekly" && (
          <SubTitle style={{ paddingTop: 20 }}>Weekly Report</SubTitle>
        )}
        {selectedDuration === "monthly" && (
          <SubTitle style={{ paddingTop: 20 }}>Monthly Report</SubTitle>
        )}
        <DataTable>
          <DataTable.Header>
            {selectedDuration === "day" && (
              <DataTable.Title>Day</DataTable.Title>
            )}
            {selectedDuration === "week" && (
              <DataTable.Title>Week</DataTable.Title>
            )}
            {selectedDuration === "month" && (
              <DataTable.Title>Month</DataTable.Title>
            )}
            <DataTable.Title numeric>Present</DataTable.Title>
            <DataTable.Title numeric>Absent</DataTable.Title>
            <DataTable.Title numeric>Permission</DataTable.Title>
          </DataTable.Header>
          {(selectedDuration === "week" || selectedDuration === "month") &&
            report.map((item, index) => (
              <DataTable.Row key={index}>
                <DataTable.Cell style={{ flex: 2 }}>
                  {item.end.slice(4, 10).replace("-", "/")} -{" "}
                  {item.start.slice(4, 10).replace("-", "/")}
                </DataTable.Cell>

                <DataTable.Cell numeric>{item.total.present}</DataTable.Cell>
                <DataTable.Cell numeric>{item.total.absent}</DataTable.Cell>
                <DataTable.Cell numeric>{item.total.permission}</DataTable.Cell>
              </DataTable.Row>
            ))}
          {selectedDuration === "day" &&
            report[0].report.map((item, index) => (
              <DataTable.Row key={index}>
                <DataTable.Cell style={{ flex: 2 }}>
                  {item.timestamp.slice(0, 10).replace("-", "/")}
                </DataTable.Cell>
                <DataTable.Cell numeric>{item.present}</DataTable.Cell>
                <DataTable.Cell numeric>{item.absent}</DataTable.Cell>
                <DataTable.Cell numeric>{item.permission}</DataTable.Cell>
              </DataTable.Row>
            ))}
        </DataTable>

        <StyledButton onPress={() => createAndSavePDF(html)}>
          <ButtonText>Save as PDF</ButtonText>
        </StyledButton>

        <View style={{ paddingTop: 20 }}>
          <SubTitle>Absent beneficiaries</SubTitle>
          <DataTable style={{ width: "auto" }}>
            <DataTable.Header>
              <DataTable.Title>No.</DataTable.Title>
              <DataTable.Title style={{ flex: 2 }}>Name</DataTable.Title>
              <DataTable.Title numeric style={{ flex: 2 }}>
                Phone Number
              </DataTable.Title>
            </DataTable.Header>
            <ScrollView>
              {absenteeReport.map((item, index) => (
                <DataTable.Row key={index}>
                  <DataTable.Cell>{index + 1}</DataTable.Cell>
                  <DataTable.Cell style={{ flex: 2 }}>
                    {item.name}
                  </DataTable.Cell>
                  <DataTable.Cell numeric style={{ flex: 2 }}>
                    {item.phone}
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </ScrollView>
          </DataTable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingVertical: 30,
    // height: "100%",
    // overflow: "visible",
  },
  pickerStyle: {
    backgroundColor: primary,
    padding: 15,
    paddingLeft: 55,
    paddingRight: 55,
    borderRadius: 5,
    fontSize: 16,
    height: 60,
    width: 150,
    // marginVertical: 3,
    marginBottom: 10,
    color: tertiary,
  },
});
