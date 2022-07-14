import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  RefreshControl,
  StyleSheet,
  View,
  Text,
} from "react-native";
import { ListItem, SearchBar } from "react-native-elements";
import { Colors } from "./styles";

const { brand } = Colors;

export default function CustomList({
  data,
  getUser,
  toggleOverlay,
  fetchWaitingList,
  fetchVisitedList,
  fetchAttendanceList,
  fetchOrderList,
}) {
  const [search, setSearch] = useState("");
  const [filteredDataSource, setFilteredDataSource] = useState(data);
  const [masterDataSource, setMasterDataSource] = useState(data);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch required data
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    if (fetchWaitingList) {
      fetchWaitingList();
    } else if (fetchVisitedList) {
      fetchVisitedList();
    } else if (fetchAttendanceList) {
      fetchAttendanceList();
    } else if (fetchOrderList) {
      fetchOrderList();
    }
    setRefreshing(false);
  }, []);

  useEffect(() => {
    setFilteredDataSource(data);
    setMasterDataSource(data);
  }, [data]);

  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = masterDataSource.filter(function (item) {
        let itemData;
        if (item.muntahaID) {
          itemData = item.muntahaID
            ? item.muntahaID.toUpperCase()
            : "".toUpperCase();
        } else {
          itemData = item.name ? item.name.toUpperCase() : "".toUpperCase();
        }
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };

  // List item
  const renderItem = ({ item }) => (
    <ListItem
      bottomDivider
      onPress={() => {
        toggleOverlay();
        getUser(item);
      }}
    >
      <ListItem.Content>
        <ListItem.Title> {item.name} </ListItem.Title>
        {item.muntahaID ? (
          <ListItem.Subtitle> {item.muntahaID} </ListItem.Subtitle>
        ) : (
          <ListItem.Subtitle> {item.phone} </ListItem.Subtitle>
        )}
        {item.address ? (
          <ListItem.Subtitle> {item.address} </ListItem.Subtitle>
        ) : null}
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );

  return (
    <SafeAreaView>
      {!fetchOrderList && (
        <SearchBar
          placeholder="type here ..."
          lightTheme
          placeholderTextColor={brand}
          leftIcon
          containerStyle={{ backgroundColor: "white" }}
          inputContainerStyle={{ backgroundColor: "white" }}
          onChangeText={(text) => searchFilterFunction(text)}
          onClear={(text) => searchFilterFunction("")}
          value={search}
        />
      )}
      {data.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.headingPrimary}>List is empty</Text>
        </View>
      ) : (
        <FlatList
          data={filteredDataSource}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 500 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: {
    display: "flex",
    height: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
  headingPrimary: {
    fontSize: 20,
    letterSpacing: 2,
    color: "black",
  },
});
