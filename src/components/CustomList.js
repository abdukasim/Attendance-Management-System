import React from "react";
import { FlatList, ActivityIndicator } from "react-native";
import { ListItem } from "react-native-elements";

export default function CustomList(props) {
  return (
    <FlatList
      data={props.data}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <ListItem bottomDivider>
          <ListItem.Content>
            <ListItem.Title> {item.name} </ListItem.Title>
            <ListItem.Subtitle> {item.phone} </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      )}
    />
  );
}
