import React from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import AttendanceScreen from "./AttendanceScreen";
import OrderAttendance from "./OrderAttendance";
import { Colors } from "../../components/styles";

const { brand, tertiary } = Colors;

const Tab = createBottomTabNavigator();

export default function AttendanceOfficer() {
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerTintColor: brand,
          tabBarActiveTintColor: brand,
          tabBarInactiveTintColor: tertiary,

          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Attendance") {
              iconName = "check-circle";
            } else if (route.name === "Order") {
              iconName = "bar-chart";
            }

            // You can return any component that you like here!
            return <FontAwesome name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Attendance" component={AttendanceScreen} />
        <Tab.Screen name="Order" component={OrderAttendance} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
