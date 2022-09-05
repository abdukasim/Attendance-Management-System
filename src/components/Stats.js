import React, { useEffect, useRef, useState } from "react";
import { Stat, StatCard, StatTitle, StatValue } from "./styles";
import { io } from "socket.io-client";

export default function Stats() {
  const [presentAttendees, setPresentAttendees] = useState(0);
  const [servedMeals, setServedMeals] = useState(0);
  const [beneficiaries, setBenefeciaries] = useState(0);

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io("http://137.184.58.100");
    socketRef.current.on("present_count", (number) => {
      setPresentAttendees(number);
    });
    socketRef.current.on("meal_count", (number) => {
      setServedMeals(number);
    });
    socketRef.current.on("client_count", (number) => {
      setBenefeciaries(number);
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, [presentAttendees, servedMeals, beneficiaries]);

  return (
    <StatCard>
      <Stat>
        <StatTitle>Present</StatTitle>
        <StatValue>{presentAttendees}</StatValue>
      </Stat>
      <Stat>
        <StatTitle>Served Meals</StatTitle>
        <StatValue>{servedMeals}</StatValue>
      </Stat>
      <Stat>
        <StatTitle>Total</StatTitle>
        <StatValue>{beneficiaries}</StatValue>
      </Stat>
    </StatCard>
  );
}
