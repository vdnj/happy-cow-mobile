import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Rating } from "react-native-elements";
import { getDistance } from "geolib";
import { useState, useEffect } from "react";
import SplashScreen from "../containers/SplashScreen";
import * as Location from "expo-location";

const RestaurantCard = ({ data }) => {
  const navigation = useNavigation();
  //   const [userLatitude, setUserLatitude] = useState(null);
  //   const [userLongitude, setUserLongitude] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    const getPermissionAndLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync();
        // setUserLatitude(location.coords.latitude);
        // setUserLongitude(location.coords.longitude);
        const newDistance = getDistance(
          { latitude: data.location.lat, longitude: data.location.lng },
          {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }
        );
        newDistance = Math.round((distance / 1000) * 100) / 100;
        setDistance(newDistance);

        setIsLoading(false);
      }
    };
    getPermissionAndLocation();
  }, []);
  console.log({ distance });

  //   console.log({ userLatitude, userLongitude });

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
              style={{
                fontSize: 15,
                fontWeight: "bold",
                marginBottom: 10,
                maxWidth: 250,
              }}
            >
              {data.name}
            </Text>
            <Rating
              startingValue={data.rating}
              imageSize={15}
              style={{ alignSelf: "flex-start" }}
              readonly={true}
            />
          </View>
          <View style={styles.descTopRight}>
            <Image
              source={{
                uri:
                  data.type === "vegan"
                    ? "https://res.cloudinary.com/dxla31aiu/image/upload/v1646406922/HappyCow/vegan.png"
                    : data.type === "vegetarian"
                    ? "https://res.cloudinary.com/dxla31aiu/image/upload/v1646407750/HappyCow/vegetarian_h76kt4.png"
                    : data.type === "Veg Store"
                    ? "https://res.cloudinary.com/dxla31aiu/image/upload/v1646407838/HappyCow/vegstore_sggr5o.png"
                    : "https://res.cloudinary.com/dxla31aiu/image/upload/v1646407633/HappyCow/other_xbytay.png",
              }}
              style={{ height: 20, width: 20, borderRadius: 10 }}
            />
            <Text style={{ fontSize: 12, color: "gray" }}>{distance} km</Text>
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
    marginTop: 10,
  },
});

export default RestaurantCard;
