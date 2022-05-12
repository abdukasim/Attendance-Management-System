import React from "react";
import { Text, View } from "react-native";
import { Button, ButtonText, Colors, StyledModal, SubTitle } from "./styles";

const { green, red, brand } = Colors;

export default function OrderListModal({
  name,
  id,
  dbId,
  fetchOrderList,
  toggleOverlay,
}) {
  return (
    <StyledModal>
      <SubTitle>{name}</SubTitle>
      <Text>{id}</Text>

      <Button onPress={() => toggleOverlay()} color={red}>
        <ButtonText>Remove</ButtonText>
      </Button>
    </StyledModal>
  );
}
