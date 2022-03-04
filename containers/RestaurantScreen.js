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

const RestaurantScreen = ({ route }) => {
  const [isFav, setIsFav] = useState(null);

  useEffect(async () => {
    let favorites = await AsyncStorage.getItem("favorites");
    const isInFavorites = favorites.includes(String(route.params.data.placeId));
    setIsFav(isInFavorites);
  }, []);

  const navigation = useNavigation();

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

  navigation.setOptions({
    headerStyle: {
      backgroundColor: "#1fae9e",
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
    <ScrollView>
      <View style={styles.basicInfo}>
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
            <TouchableOpacity>
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
        <View style={styles.basicData}>
          <View style={styles.leftBasicData}>
            <Text style={{ color: "white" }}>{route.params.data.name}</Text>
            <Text>{route.params.data.rating}</Text>
            <Text style={{ color: "white" }}>OPENENED ?</Text>
          </View>
          <View style={styles.rightBasicData}>
            <Text style={{ color: "white" }}>{route.params.data.type}</Text>
            <Text style={{ color: "white" }}>distance</Text>
            <Text style={{ color: "white" }}>{route.params.data.price}</Text>
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
        />
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
    alignItems: "flex-end",
    padding: 20,
    backgroundColor: "#1fae9e",
  },
  moreInfo: {
    padding: 20,
  },
  links: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "lightgray",
    borderBottomWidth: 1,
  },
});

export default RestaurantScreen;
