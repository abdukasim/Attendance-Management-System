import React from "react";
import { Text, View } from "react-native";
import url from "../helpers/url";
import { Button, ButtonText, Colors, StyledModal, SubTitle } from "./styles";

const { red } = Colors;

export default function OrderListModal({
  name,
  id,
  dbId,
  fetchOrderList,
  toggleOverlay,
}) {
  const RemoveFromList = async () => {
    try {
      const res = await url.delete("/api/attendance/client/attendance/o-list", {
        data: {
          id: dbId,
        },
      });
      fetchOrderList();
      toggleOverlay();
    } catch (err) {
      console.log("error", err.response);
    }
  };

  return (
    <StyledModal>
      <SubTitle>{name}</SubTitle>
      <Text>{id}</Text>

      <Button onPress={() => RemoveFromList()} color={red}>
        <ButtonText>Remove</ButtonText>
      </Button>
    </StyledModal>
  );
}
