import { ScrollView, Text, FlatList, View } from "react-native";
import { useEffect, useState } from "react";
import RestaurantCard from "../components/RestaurantCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SplashScreen from "./SplashScreen";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";

const FavoritesScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  const isFocused = useIsFocused();

  useEffect(() => {
    // const getFavorites = async () => {
    //   const favorites = await AsyncStorage.getItem("favorites");
    //   if (favorites) {
    //     const splittedFav = favorites ? favorites.split("-") : [];
    //     const restaurantsData = [];
    //     splittedFav.forEach((id) => {
    //       const restToPushIndex = restaurants.findIndex((el) => {
    //         return String(el.placeId) === id;
    //       });
    //       restaurantsData.push(restaurants[restToPushIndex]);
    //     });
    //     setFavorites(restaurantsData);
    //   }
    // };

    const fetchData = async () => {
      const favorites = await AsyncStorage.getItem("favorites");

      if (favorites) {
        try {
          let newData = await axios.get(
            `http://localhost:3000/favorites?favorites=${favorites}`
          );
          newData = newData.data;
          setData(newData);
        } catch (err) {
          console.log(err.message);
        }
      }
    };
    fetchData();
    setIsLoading(false);
  }, [isFocused]);

  return isLoading ? (
    <SplashScreen />
  ) : data ? (
    <FlatList
      data={data}
      keyExtractor={(item) => item.placeId}
      renderItem={({ item }) => {
        return <RestaurantCard data={item} />;
      }}
      style={{ backgroundColor: "white" }}
    />
  ) : (
    <View>
      <Text>No Favorites to display !</Text>
    </View>
  );
};

export default FavoritesScreen;
