import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./src/screens/LoginScreen";
import AdminTabs from "./src/screens/Admin/AdminTabs";
import RegistrationTabs from "./src/screens/Registration/RegistrationTabs";
import AttendanceTabs from "./src/screens/Attendance/AttendanceTabs";
import BoardScreen from "./src/screens/BoardScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import io from "socket.io-client";
import { LogBox } from "react-native";

import { StatusBar } from "react-native";

StatusBar.setBarStyle("dark-content", true);

const Stack = createNativeStackNavigator();

const App = () => {
  const socketRef = React.useRef();

  React.useEffect(() => {
    socketRef.current = io("http://137.184.58.100");
    socketRef.current.on("meal_count", (number) => {
      console.log("meal-count:", number);
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  LogBox.ignoreLogs(["Picker has been extracted"]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ADMIN" component={AdminTabs} />
        <Stack.Screen name="REG_OFF" component={RegistrationTabs} />
        <Stack.Screen name="ATT_OFF" component={AttendanceTabs} />
        <Stack.Screen name="Board" component={BoardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    // <AttendanceTabs />
  );
};

export default App;
