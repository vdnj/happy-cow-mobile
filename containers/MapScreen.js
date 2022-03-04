import { View, Text } from "react-native";
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import SplashScreen from "./SplashScreen";
import restaurants from "../assets/restaurants.json";

import { useNavigation } from "@react-navigation/native";

const MapScreen = () => {
  const navigation = useNavigation();

  const [userLatitude, setUserLatitude] = useState(null);
  const [userLongitude, setUserLongitude] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getPermissionAndLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync();
        setUserLatitude(location.coords.latitude);
        setUserLongitude(location.coords.longitude);
        setIsLoading(false);
      }
    };
    getPermissionAndLocation();
  }, []);

  return isLoading ? (
    <SplashScreen />
  ) : (
    <View>
      <MapView
        style={{ width: "100%", height: "100%" }}
        initialRegion={{
          latitude: userLatitude,
          longitude: userLongitude,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
        showsUserLocation={true}
        provider={PROVIDER_GOOGLE}
      >
        {restaurants.map((data, index) => {
          return (
            <MapView.Marker
              onPress={() => {
                navigation.navigate("Restaurant", {
                  data,
                });
              }}
              key={index}
              coordinate={{
                latitude: data.location.lat,
                longitude: data.location.lng,
              }}
            />
          );
        })}
      </MapView>
    </View>
  );
};

export default MapScreen;
