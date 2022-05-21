import { Picker } from "@react-native-picker/picker";
import React, { useRef, useState } from "react";
import { View, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { DataTable } from "react-native-paper";
import { Colors, SubTitle } from "../../components/styles";

const { primary, tertiary } = Colors;

export default function App() {
  const [selectedDuration, setSelectedDuration] = useState("daily");
  const pickerRef = useRef();

  function open() {
    pickerRef.current.focus();
  }

  function close() {
    pickerRef.current.blur();
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ paddingHorizontal: 10 }}>
        <SubTitle>Select Duration</SubTitle>
        <Picker
          ref={pickerRef}
          selectedValue={selectedDuration}
          onValueChange={(itemValue, itemIndex) =>
            setSelectedDuration(itemValue)
          }
          style={styles.pickerStyle}
        >
          <Picker.Item label="Daily" value="daily" />
          <Picker.Item label="Weekly" value="weekly" />
          <Picker.Item label="Monthly" value="monthly" />
        </Picker>
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
            {selectedDuration === "daily" && (
              <DataTable.Title>Day</DataTable.Title>
            )}
            {selectedDuration === "weekly" && (
              <DataTable.Title>Week</DataTable.Title>
            )}
            {selectedDuration === "monthly" && (
              <DataTable.Title>Month</DataTable.Title>
            )}
            <DataTable.Title numeric>Present</DataTable.Title>
            <DataTable.Title numeric>Absent</DataTable.Title>
            <DataTable.Title numeric>Permission</DataTable.Title>
          </DataTable.Header>
          <DataTable.Row>
            <DataTable.Cell>Week 1</DataTable.Cell>
            <DataTable.Cell numeric>100</DataTable.Cell>
            <DataTable.Cell numeric>33</DataTable.Cell>
            <DataTable.Cell numeric>2</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell>Week 2</DataTable.Cell>
            <DataTable.Cell numeric>120</DataTable.Cell>
            <DataTable.Cell numeric>10</DataTable.Cell>
            <DataTable.Cell numeric>5</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell>Week 3</DataTable.Cell>
            <DataTable.Cell numeric>135</DataTable.Cell>
            <DataTable.Cell numeric>0</DataTable.Cell>
            <DataTable.Cell numeric>0</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell>Week 4</DataTable.Cell>
            <DataTable.Cell numeric>135</DataTable.Cell>
            <DataTable.Cell numeric>0</DataTable.Cell>
            <DataTable.Cell numeric>0</DataTable.Cell>
          </DataTable.Row>
        </DataTable>
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
              <DataTable.Row>
                <DataTable.Cell>1</DataTable.Cell>
                <DataTable.Cell style={{ flex: 2 }}>
                  Helen Getachew
                </DataTable.Cell>
                <DataTable.Cell numeric style={{ flex: 2 }}>
                  09129358
                </DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Cell>1</DataTable.Cell>
                <DataTable.Cell style={{ flex: 2 }}>
                  Helen Getachew
                </DataTable.Cell>
                <DataTable.Cell numeric style={{ flex: 2 }}>
                  09129358
                </DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Cell>1</DataTable.Cell>
                <DataTable.Cell style={{ flex: 2 }}>
                  Helen Getachew
                </DataTable.Cell>
                <DataTable.Cell numeric style={{ flex: 2 }}>
                  09129358
                </DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Cell>1</DataTable.Cell>
                <DataTable.Cell style={{ flex: 2 }}>
                  Helen Getachew
                </DataTable.Cell>
                <DataTable.Cell numeric style={{ flex: 2 }}>
                  09129358
                </DataTable.Cell>
              </DataTable.Row>
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
    paddingVertical: 30,
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
    marginVertical: 3,
    marginBottom: 10,
    color: tertiary,
  },
});
