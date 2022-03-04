import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Rating } from "react-native-ratings";
import { getDistance } from "geolib";
import { useState, useEffect } from "react";
import SplashScreen from "../containers/SplashScreen";
import * as Location from "expo-location";

const RestaurantCard = ({ data }) => {
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
  }, [userLatitude, userLongitude]);

  console.log({ userLatitude, userLongitude });

  //   let distance = getDistance(
  //     { latitude: data.location.lat, longitude: data.location.lng },
  //     {
  //       latitude: userLatitude,
  //       longitude: userLongitude,
  //     }
  //   );
  //   distance = Math.round((distance / 1000) * 100) / 100;
  //   console.log({ distance });

  const price = Math.floor(Math.random() * 3);
  console.log({ price });

  return isLoading ? (
    <SplashScreen />
  ) : (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        navigation.navigate("Restaurant", {
          data,
        });
      }}
    >
      <Image
        source={{
          uri: data.thumbnail,
        }}
        style={{ height: 100, width: 100, borderRadius: 5 }}
      />
      <View style={styles.description}>
        <View style={styles.descTop}>
          <View style={styles.descTopLeft}>
            <Text
              style={{ fontSize: 15, fontWeight: "bold", marginBottom: 10 }}
            >
              {data.name}
            </Text>
            <Rating
              startingValue={data.rating}
              imageSize={15}
              style={{ alignSelf: "flex-start" }}
            />

            <Text>Opened?</Text>
          </View>
          <View style={styles.descTopRight}>
            <Text>{data.type}</Text>
            {/* <Text style={{ fontSize: 12, color: "gray" }}>{distance} km</Text> */}
            {data.price && (
              <View style={styles.priceRange}>
                <Text style={{ color: "gold" }}>$</Text>
                <Text style={{ color: price >= 1 ? "gold" : "grey" }}>$</Text>
                <Text style={{ color: price === 2 ? "gold" : "grey" }}>$</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.descBot}>
          <Text numberOfLines={2} style={{ fontSize: 10, fontWeight: "bold" }}>
            {data.description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "white",
  },
  description: {
    flex: 1,
    justifyContent: "space-between",
    marginLeft: 10,
  },
  descTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  descTopLeft: {},
  descTopRight: { alignItems: "flex-end" },
  priceRange: {
    flexDirection: "row",
  },
});

export default RestaurantCard;
