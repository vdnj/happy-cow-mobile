import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import SplashScreen from "./SplashScreen";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Rating } from "react-native-elements";
import { getDistance } from "geolib";

// import ImageView from "react-native-image-viewing";

const RestaurantScreen = ({ route }) => {
  const navigation = useNavigation();
  const [isFav, setIsFav] = useState(null);
  const [visible, setIsVisible] = useState(false);
  const [showAllImages, setShowAllImages] = useState(false);
  const [userLatitude, setUserLatitude] = useState(null);
  const [userLongitude, setUserLongitude] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [distance, setDistance] = useState(null);

  const color =
    route.params.data.type === "vegan"
      ? "#479d5f"
      : route.params.data.type === "vegetarian"
      ? "#7f3a88"
      : route.params.data.type === "Veg Store"
      ? "#ddc252"
      : "#49baaf";

  useEffect(async () => {
    let favorites = await AsyncStorage.getItem("favorites");
    const isInFavorites = favorites.includes(String(route.params.data.placeId));
    setIsFav(isInFavorites);
    navigation.setOptions({
      headerStyle: {
        backgroundColor: color,
      },
      headerTitle: "",
      headerRight: () => (
        <TouchableOpacity
          onPress={() => handleFavClic(route.params.data.placeId)}
          title=""
        >
          <Ionicons
            name={isFav ? "star" : "star-outline"}
            size={20}
            color={"white"}
          />
        </TouchableOpacity>
      ),
    });
    const getPermissionAndLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync();
        setUserLatitude(location.coords.latitude);
        setUserLongitude(location.coords.longitude);

        let newDistance = getDistance(
          {
            latitude: route.params.data.location.lat,
            longitude: route.params.data.location.lng,
          },
          {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }
        );
        newDistance = Math.round((newDistance / 1000) * 100) / 100;

        setDistance(newDistance);

        setIsLoading(false);
      }
    };
    getPermissionAndLocation();
  }, [isFav]);

  const handleFavClic = async (id) => {
    const favorites = await AsyncStorage.getItem("favorites");
    const splittedFav = favorites ? favorites.split("-") : [];

    const indexOfFav = splittedFav.indexOf(String(id));
    if (indexOfFav >= 0) {
      splittedFav.splice(indexOfFav, 1);
      setIsFav(false);
    } else {
      splittedFav.push(String(id));
      setIsFav(true);
    }
    await AsyncStorage.setItem("favorites", splittedFav.join("-"));
  };

  const images = [];
  route.params.data.pictures.forEach((pic) => {
    images.push({ uri: pic });
  });

  const price = Math.floor(Math.random() * 3);

  return isLoading ? (
    <SplashScreen />
  ) : (
    <ScrollView style={{ backgroundColor: "white" }}>
      <View style={styles.basicInfo}>
        {showAllImages ? (
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{ backgroundColor: color }}
          >
            {route.params.data.pictures.map((pic, index) => {
              return (
                <Image
                  key={index}
                  source={{ uri: pic }}
                  style={{
                    height: 200,
                    width: Dimensions.get("window").width * 0.96,
                    margin: Dimensions.get("window").width * 0.02,
                  }}
                />
              );
            })}
          </ScrollView>
        ) : (
          <View style={styles.pictures}>
            <Image
              source={{ uri: route.params.data.pictures[0] }}
              style={styles.bigPic}
            />
            <View>
              <Image
                source={{ uri: route.params.data.pictures[1] }}
                style={styles.sideTopPic}
              />
              <TouchableOpacity
                onPress={() => {
                  setShowAllImages(true);
                }}
              >
                <ImageBackground
                  source={{ uri: route.params.data.pictures[2] }}
                  style={styles.sideBotPic}
                >
                  <View style={styles.picsView}>
                    <Text style={styles.seeAllText}>
                      +{route.params.data.pictures.length}
                    </Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View
          style={[
            styles.basicData,
            {
              backgroundColor: color,
            },
          ]}
        >
          <View style={styles.leftBasicData}>
            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
              {route.params.data.name}
            </Text>
            <Rating
              startingValue={route.params.data.rating}
              imageSize={15}
              tintColor={color}
              readonly={true}
            />
          </View>
          <View style={styles.rightBasicData}>
            <Image
              source={{
                uri:
                  route.params.data.type === "vegan"
                    ? "https://res.cloudinary.com/dxla31aiu/image/upload/v1646406922/HappyCow/vegan.png"
                    : route.params.data.type === "vegetarian"
                    ? "https://res.cloudinary.com/dxla31aiu/image/upload/v1646407750/HappyCow/vegetarian_h76kt4.png"
                    : route.params.data.type === "Veg Store"
                    ? "https://res.cloudinary.com/dxla31aiu/image/upload/v1646407838/HappyCow/vegstore_sggr5o.png"
                    : "https://res.cloudinary.com/dxla31aiu/image/upload/v1646407633/HappyCow/other_xbytay.png",
              }}
              style={styles.typeLogo}
            />
            <Text style={{ color: "white" }}>{route.params.data.type}</Text>
            <Text style={{ fontSize: 12, color: "white" }}>{distance} km</Text>

            {route.params.data.price && (
              <View style={styles.priceRange}>
                <Text style={{ color: "gold" }}>$</Text>
                <Text style={{ color: price >= 1 ? "gold" : "grey" }}>$</Text>
                <Text style={{ color: price === 2 ? "gold" : "grey" }}>$</Text>
              </View>
            )}
            <Text style={{ color: "white" }}></Text>
          </View>
        </View>
      </View>
      <Text style={styles.moreInfo}>{route.params.data.description}</Text>
      <MapView
        style={{ width: "100%", height: 300 }}
        initialRegion={{
          latitude: userLatitude,
          longitude: userLongitude,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
        showsUserLocation={true}
        provider={PROVIDER_GOOGLE}
      >
        <MapView.Marker
          coordinate={{
            latitude: route.params.data.location.lat,
            longitude: route.params.data.location.lng,
          }}
        >
          <Image
            source={{
              uri:
                route.params.data.type === "vegan"
                  ? "https://res.cloudinary.com/dxla31aiu/image/upload/v1646406922/HappyCow/vegan.png"
                  : route.params.data.type === "vegetarian"
                  ? "https://res.cloudinary.com/dxla31aiu/image/upload/v1646407750/HappyCow/vegetarian_h76kt4.png"
                  : route.params.data.type === "Veg Store"
                  ? "https://res.cloudinary.com/dxla31aiu/image/upload/v1646407838/HappyCow/vegstore_sggr5o.png"
                  : "https://res.cloudinary.com/dxla31aiu/image/upload/v1646407633/HappyCow/other_xbytay.png",
            }}
            style={{ height: 30, width: 30, borderRadius: 10 }}
          />
        </MapView.Marker>
      </MapView>
      {route.params.data.phone && (
        <TouchableOpacity
          style={styles.links}
          onPress={() => Linking.openURL(`tel:${route.params.data.phone}`)}
        >
          <Ionicons name={"call-outline"} size={30} color={"#6e3fac"} />
          <Text>Appeler {route.params.data.phone}</Text>
        </TouchableOpacity>
      )}
      {route.params.data.website && (
        <TouchableOpacity
          style={styles.links}
          onPress={() => Linking.openURL(route.params.data.website)}
        >
          <Ionicons name={"link-outline"} size={30} color={"#6e3fac"} />
          <Text>Site Internet</Text>
        </TouchableOpacity>
      )}
      {route.params.data.facebook && (
        <TouchableOpacity
          style={styles.links}
          onPress={() => Linking.openURL(route.params.data.facebook)}
        >
          <Ionicons name={"logo-facebook"} size={30} color={"#6e3fac"} />
          <Text>Facebook</Text>
        </TouchableOpacity>
      )}
      {route.params.data.instagram && (
        <TouchableOpacity
          style={styles.links}
          onPress={() => Linking.openURL(route.params.data.instagram)}
        >
          <Ionicons name={"logo-instagram"} size={30} color={"#6e3fac"} />
          <Text>Instagram</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  pictures: {
    flexDirection: "row",
  },
  bigPic: {
    height: 200,
    width: Dimensions.get("window").width * 0.75,
  },
  sideTopPic: {
    height: 100,
    width: Dimensions.get("window").width * 0.25,
  },
  sideBotPic: {
    height: 100,
    width: Dimensions.get("window").width * 0.25,
    justifyContent: "flex-end",
  },
  picsView: {
    backgroundColor: "black",
    opacity: 0.7,
    height: 100,
    width: Dimensions.get("window").width * 0.25,
    justifyContent: "center",
    alignItems: "center",
  },
  seeAllText: {
    color: "white",
  },
  basicData: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 15,
    backgroundColor: "#1fae9e",
  },
  moreInfo: {
    padding: 15,
  },
  links: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "lightgray",
    borderBottomWidth: 1,
  },
  leftBasicData: {
    alignItems: "flex-start",
  },
  rightBasicData: {
    position: "relative",
  },
  priceRange: {
    flexDirection: "row",
  },
  typeLogo: {
    height: 30,
    width: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "white",
    position: "absolute",
    top: -30,
    right: 0,
  },
});

export default RestaurantScreen;
