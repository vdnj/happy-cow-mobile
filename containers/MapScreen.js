import { View, Text, Image, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import SplashScreen from "./SplashScreen";
import axios from "axios";
import Map from "../components/Map";

import { useNavigation } from "@react-navigation/native";

const MapScreen = () => {
  const navigation = useNavigation();

  const [userLatitude, setUserLatitude] = useState(null);
  const [userLongitude, setUserLongitude] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [actualShowing, setActualShowing] = useState(6);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axios.get(
          `https://happy-cow-backend.herokuapp.com/restaurants?filter=null&actualShowing=${actualShowing}`
        );
        const newData = data.data;
        setData(newData);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();

    setIsLoading(false);
  }, [actualShowing]);

  return isLoading ? (
    <SplashScreen />
  ) : (
    <>
      <Map data={data} width={"100%"} height={"100%"} />
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 15,
          right: 15,
          flexDirection: "row",
          backgroundColor: "white",
          padding: 5,
          borderRadius: 5,
          justifyContent: "space-between",
          alignItems: "center",
        }}
        onPress={() => {
          setActualShowing(actualShowing + 6);
        }}
      >
        <Text
          style={{
            color: "#6e3fac",
            borderColor: "#6e3fac",
            borderRadius: 10,
            padding: 3,
            borderWidth: 1,
            marginRight: 5,
          }}
        >
          +
        </Text>
        <Text style={{ color: "#6e3fac" }}>CHARGER PLUS</Text>
      </TouchableOpacity>
    </>
  );
};

export default MapScreen;
