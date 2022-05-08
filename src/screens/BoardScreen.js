import React from "react";
import { Text, View, StyleSheet } from "react-native";

const BoardScreen = () => {
  return (
    <View style={styles.center}>
      <Text style={styles.headingPrimary}>Board</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    borderWidth: 2,
    margin: 15,
    borderColor: "grey",
    minWidth: 280,
    textAlignVertical: "center",
    paddingLeft: 10,
    borderRadius: 10,
    color: "#ffffff",
  },
  headingPrimary: {
    fontSize: 30,
    letterSpacing: 5,
    marginBottom: 20,
    color: "black",
  },
});

export default BoardScreen;
