import { View, Text, Image } from "react-native";
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import SplashScreen from "../containers/SplashScreen";
import { useNavigation } from "@react-navigation/native";

const Map = ({ data, width, height }) => {
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
      }
    };
    getPermissionAndLocation();
    setIsLoading(false);
  }, []);

  return isLoading ? (
    <SplashScreen />
  ) : data && userLatitude && userLongitude ? (
    <View>
      <MapView
        style={{ width, height }}
        initialRegion={{
          latitude: userLatitude,
          longitude: userLongitude,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
        showsUserLocation={true}
        provider={PROVIDER_GOOGLE}
      >
        {data.map((el, index) => {
          return (
            <MapView.Marker
              onPress={() => {
                navigation.navigate("Restaurant", {
                  data: el,
                });
              }}
              key={index}
              coordinate={{
                latitude: el.location.lat,
                longitude: el.location.lng,
              }}
            >
              <Image
                source={{
                  uri:
                    el.type === "vegan"
                      ? "https://res.cloudinary.com/dxla31aiu/image/upload/v1646406922/HappyCow/vegan.png"
                      : el.type === "vegetarian"
                      ? "https://res.cloudinary.com/dxla31aiu/image/upload/v1646407750/HappyCow/vegetarian_h76kt4.png"
                      : el.type === "Veg Store"
                      ? "https://res.cloudinary.com/dxla31aiu/image/upload/v1646407838/HappyCow/vegstore_sggr5o.png"
                      : "https://res.cloudinary.com/dxla31aiu/image/upload/v1646407633/HappyCow/other_xbytay.png",
                }}
                style={{ height: 30, width: 30, borderRadius: 10 }}
              />
            </MapView.Marker>
          );
        })}
      </MapView>
    </View>
  ) : null;
};

export default Map;
