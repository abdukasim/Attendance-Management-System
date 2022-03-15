import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./src/screens/LoginScreen";
import AdminTabs from "./src/screens/AdminTabs";
import RegistrationTabs from "./src/screens/Registration/RegistrationTabs";
import AttendanceScreen from "./src/screens/AttendanceScreen";
import BoardScreen from "./src/screens/BoardScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ADMIN" component={AdminTabs} />
        <Stack.Screen name="REG_OFF" component={RegistrationTabs} />
        <Stack.Screen name="AttOfficer" component={AttendanceScreen} />
        <Stack.Screen name="Board" component={BoardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
