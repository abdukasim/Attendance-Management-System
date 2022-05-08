import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./src/screens/LoginScreen";
import AdminTabs from "./src/screens/Admin/AdminTabs";
import RegistrationTabs from "./src/screens/Registration/RegistrationTabs";
import AttendanceOfficer from "./src/screens/AttendanceOfficer";
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
        <Stack.Screen
          name="ATT_OFF"
          component={AttendanceOfficer}
          options={{
            headerShown: true,
            headerTitle: "Attendance Officer",
            headerBackVisible: false,
          }}
        />
        <Stack.Screen name="Board" component={BoardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    // <AdminTabs />
  );
};

export default App;
