import { View, Image, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";

import styled from "styled-components";

export const Colors = {
  primary: "#ffffff",
  secondary: "#E5E7EB",
  tertiary: "#1F2937",
  darkLight: "#9CA3AF",
  brand: "#642993",
  green: "#10B981",
  red: "#EF4444",
};

const { primary, secondary, tertiary, darkLight, brand, green, red } = Colors;

export const StyledContainer = styled.View`
  flex: 1;
  padding: 25px;
  padding-top: 10px;
  background-color: ${primary};
`;

export const InnerContainer = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
`;
export const PageLogo = styled.Image`
  width: 350px;
  height: 300px;
`;
export const PageTitle = styled.Text`
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  color: ${brand};
  padding: 10px;
`;
export const SubTitle = styled.Text`
  font-size: 18px;
  margin-bottom: 20px;
  letter-spacing: 1px;
  font-weight: bold;
  color: ${tertiary};
`;
export const StyledFormArea = styled.View`
  width: 90%;
`;
export const StyledTextInput = styled.TextInput`
  background-color: ${secondary};
  padding: 15px;
  padding-left: 55px;
  padding-right: 55px;
  border-radius: 5px;
  font-size: 16px;
  height: 60px;
  margin-vertical: 3px;
  margin-bottom: 10px;
  color: ${tertiary};
`;
export const StyledTextDisplay = styled.TextInput`
  background-color: ${secondary};
  padding: 15px;
  border-radius: 5px;
  font-size: 16px;
  height: 60px;
  margin-vertical: 3px;
  margin-bottom: 10px;
  color: ${tertiary};
`;
export const StyledInputLabel = styled.Text`
  color: ${tertiary};
  font-size: 13px;
  text-align: left;
`;
export const LeftIcon = styled.View`
  left: 15px;
  top: 38px;
  position: absolute;
  z-index: 1;
`;

export const RightIcon = styled.TouchableOpacity`
  right: 15px;
  top: 38px;
  position: absolute;
  z-index: 1;
`;
export const StyledButton = styled.TouchableOpacity`
  align-items: center;
  padding: 15px;
  background-color: ${brand};
  justify-content: center;
  border-radius: 5px;
  margin-vertical: 5px;
  height: 60px;
`;
export const ButtonText = styled.Text`
  color: ${primary};
  font-size: 16px;
`;
export const MsgBox = styled.Text`
  text-align: center;
  font-size: 13px;
  color: ${(props) => (props.type === "SUCCESS" ? green : red)};
`;
export const Line = styled.View`
  height: 1px;
  width: 100%;
  background-color: ${darkLight};
  margin-vertical: 10px;
`;

export const StyledPicker = styled.Picker`
  background-color: ${secondary};
  padding: 15px;
  padding-left: 55px;
  padding-right: 55px;
  border-radius: 5px;
  font-size: 16px;
  height: 60px;
  margin-vertical: 3px;
  margin-bottom: 10px;
  color: ${tertiary};
`;

export const StyledModal = styled.View`
  width: 250px;
  height: auto;
  background-color: ${primary};
`;

export const AttendanceModal = styled.View`
  width: auto;
  height: auto;
  padding-top: 10px;
  background-color: ${primary};
`;

export const ButtonWrapper = styled.View`
  display: flex;
  justify-content: space-around;
  padding: 1px;
`;
export const Button = styled.TouchableOpacity`
  border-width: 1px;
  border-radius: 4px;
  padding: 10px;
  align-items: center;
  border-color: ${secondary};
  margin: 5px;
  background-color: ${(props) => (props.disabled ? secondary : props.color)};
`;

export const StatCard = styled.View`
  width: 100%;
  height: auto;
  background-color: ${primary};
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const Stat = styled.View`
  width: auto;
  height: auto;
  display: flex;
  flex-direction: column;
`;

export const StatTitle = styled.Text`
  font-size: 16px;
  color: ${tertiary};
  font-weight: bold;
`;

export const StatValue = styled.Text`
  font-size: 16px;
  color: ${brand};
  font-weight: 200;
  text-align: center;
`;
