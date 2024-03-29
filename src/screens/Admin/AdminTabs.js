import React, { useRef } from "react";
import { Text, View, Pressable } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome } from "@expo/vector-icons";
import { Colors } from "../../components/styles";
import WaitingListScreen from "./WaitingListScreen";
import VisitedListScreen from "./VisitedListScreen";
import AttendanceScreen from "../Attendance/AttendanceScreen";
import BeneficiariesScreen from "./BeneficiariesScreen";
import ReportsScreen from "./ReportsScreen";

const { brand, tertiary } = Colors;

const Tab = createBottomTabNavigator();

export default function AdminTabs({ navigation }) {
  const Logout = () => {
    return (
      <Pressable
        onPress={() => {
          navigation.replace("Login");
        }}
      >
        <View
          style={{
            marginRight: 10,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 12, color: brand, marginRight: 5 }}>
            Logout
          </Text>
          <FontAwesome name="sign-out" size={20} color={brand} />
        </View>
      </Pressable>
    );
  };

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
            } else if (route.name === "Beneficiaries") {
              iconName = "gift";
            }

            // You can return any component that you like here!
            return <FontAwesome name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: brand,
          tabBarInactiveTintColor: tertiary,
          headerRight: () => <Logout />,
        })}
      >
        <Tab.Screen name="Attendance" component={AttendanceScreen} />
        <Tab.Screen name="Beneficiaries" component={BeneficiariesScreen} />
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
