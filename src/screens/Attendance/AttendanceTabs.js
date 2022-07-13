import React from "react";
import { Pressable, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import AttendanceScreen from "./AttendanceScreen";
import OrderAttendance from "./OrderAttendance";
import { Colors } from "../../components/styles";

const { brand, tertiary } = Colors;

const Tab = createBottomTabNavigator();

export default function AttendanceOfficer({ navigation }) {
  const Logout = () => {
    return (
      <Pressable
        onPress={() => {
          navigation.navigate("Login");
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
          headerRight: () => <Logout />,
        })}
      >
        <Tab.Screen name="Attendance" component={AttendanceScreen} />
        <Tab.Screen name="Order" component={OrderAttendance} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
