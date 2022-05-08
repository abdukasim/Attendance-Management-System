import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, RefreshControl } from "react-native";
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
}) {
  const [search, setSearch] = useState("");
  const [filteredDataSource, setFilteredDataSource] = useState(data);
  const [masterDataSource, setMasterDataSource] = useState(data);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    if (fetchWaitingList) {
      fetchWaitingList();
    } else if (fetchVisitedList) {
      fetchVisitedList();
    } else if (fetchAttendanceList) {
      fetchAttendanceList();
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
        <ListItem.Subtitle> {item.phone} </ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );
  return (
    <SafeAreaView>
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
      <FlatList
        data={filteredDataSource}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 150 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
}
