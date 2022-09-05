import React from "react";
import { Colors } from "../../components/styles";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome } from "@expo/vector-icons";

import OldMemberRegistrationScreen from "./OldMemberRegistrationScreen";
import NewMemberRegistrationScreen from "./NewMemberRegistrationScreen";
import { Pressable, Text, View } from "react-native";

const { tertiary, brand } = Colors;

// const baseUrl = 'http://192.168.234.216:3000';

const Tab = createBottomTabNavigator();

export default function RegistrationTabs({ navigation }) {
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

            if (route.name === "New") {
              iconName = "user-plus";
            } else if (route.name === "Old") {
              iconName = "user";
            }

            return <FontAwesome name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: brand,
          tabBarInactiveTintColor: tertiary,
          headerRight: () => <Logout />,
        })}
      >
        <Tab.Screen
          name="New"
          options={{ headerTitle: "New Member Registration" }}
          component={NewMemberRegistrationScreen}
        />
        <Tab.Screen
          name="Old"
          options={{ headerTitle: "Old Member Registration" }}
          component={OldMemberRegistrationScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
