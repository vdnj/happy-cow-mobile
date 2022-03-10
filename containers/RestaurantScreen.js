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
import Map from "../components/Map";
import axios from "axios";

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
  const [data, setData] = useState(null);

  const color =
    route.params.data.type === "vegan"
      ? "#479d5f"
      : route.params.data.type === "vegetarian"
      ? "#7f3a88"
      : route.params.data.type === "Veg Store"
      ? "#ddc252"
      : "#49baaf";

  const images = [];

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

    const fetchData = async () => {
      try {
        let newData = await axios.get(
          `http://localhost:3000/restaurant/${route.params.data.placeId}`
        );
        newData = newData.data[0];
        setData(newData);

        newData.pictures.forEach((pic) => {
          images.push({ uri: pic });
        });

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const location = await Location.getCurrentPositionAsync();

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
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
    setIsLoading(false);
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

  const price = Math.floor(Math.random() * 3);

  return isLoading ? (
    <SplashScreen />
  ) : data ? (
    <ScrollView style={{ backgroundColor: "white" }}>
      <View style={styles.basicInfo}>
        {showAllImages ? (
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{ backgroundColor: color }}
          >
            {data.pictures.map((pic, index) => {
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
            <Image source={{ uri: data.pictures[0] }} style={styles.bigPic} />
            <View>
              <Image
                source={{ uri: data.pictures[1] }}
                style={styles.sideTopPic}
              />
              <TouchableOpacity
                onPress={() => {
                  setShowAllImages(true);
                }}
              >
                <ImageBackground
                  source={{ uri: data.pictures[2] }}
                  style={styles.sideBotPic}
                >
                  <View style={styles.picsView}>
                    <Text style={styles.seeAllText}>
                      +{data.pictures.length}
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
              {data.name}
            </Text>
            <Rating
              startingValue={data.rating}
              imageSize={15}
              tintColor={color}
              readonly={true}
            />
          </View>
          <View style={styles.rightBasicData}>
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
              style={styles.typeLogo}
            />
            <Text style={{ color: "white" }}>{data.type}</Text>
            <Text style={{ fontSize: 12, color: "white" }}>{distance} km</Text>

            {data.price && (
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
      <Text style={styles.moreInfo}>{data.description}</Text>
      <Map data={data} height={50} width={"100%"} />

      {/* <MapView
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
            latitude: data.location.lat,
            longitude: data.location.lng,
          }}
        >
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
            style={{ height: 30, width: 30, borderRadius: 10 }}
          />
        </MapView.Marker>
      </MapView> */}
      {data.phone && (
        <TouchableOpacity
          style={styles.links}
          onPress={() => Linking.openURL(`tel:${data.phone}`)}
        >
          <Ionicons name={"call-outline"} size={30} color={"#6e3fac"} />
          <Text>Appeler {data.phone}</Text>
        </TouchableOpacity>
      )}
      {data.website && (
        <TouchableOpacity
          style={styles.links}
          onPress={() => Linking.openURL(data.website)}
        >
          <Ionicons name={"link-outline"} size={30} color={"#6e3fac"} />
          <Text>Site Internet</Text>
        </TouchableOpacity>
      )}
      {data.facebook && (
        <TouchableOpacity
          style={styles.links}
          onPress={() => Linking.openURL(data.facebook)}
        >
          <Ionicons name={"logo-facebook"} size={30} color={"#6e3fac"} />
          <Text>Facebook</Text>
        </TouchableOpacity>
      )}
      {data.instagram && (
        <TouchableOpacity
          style={styles.links}
          onPress={() => Linking.openURL(data.instagram)}
        >
          <Ionicons name={"logo-instagram"} size={30} color={"#6e3fac"} />
          <Text>Instagram</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  ) : (
    <SplashScreen />
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
