import React, { useRef } from "react";
import { Text, View, Pressable } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome } from "@expo/vector-icons";
import { Colors } from "../../components/styles";
import WaitingListScreen from "./WaitingListScreen";
import VisitedListScreen from "./VisitedListScreen";
import AttendanceScreen from "../Attendance/AttendanceScreen";

const { brand, tertiary } = Colors;

function ReportsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Reports!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function AdminTabs() {
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerTintColor: brand,
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === "Waiting") {
              iconName = "spinner";
            } else if (route.name === "Visited") {
              iconName = "list-alt";
            } else if (route.name === "Attendance") {
              iconName = "check-circle";
            } else if (route.name === "Reports") {
              iconName = "bar-chart";
            }

            // You can return any component that you like here!
            return <FontAwesome name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: brand,
          tabBarInactiveTintColor: tertiary,
        })}
      >
        <Tab.Screen name="Attendance" component={AttendanceScreen} />
        <Tab.Screen
          name="Waiting"
          options={{ headerTitle: "Waiting List" }}
          children={() => <WaitingListScreen />}
        />
        <Tab.Screen
          name="Visited"
          options={{ headerTitle: "Visited List" }}
          children={() => <VisitedListScreen />}
        />
        <Tab.Screen name="Reports" component={ReportsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
