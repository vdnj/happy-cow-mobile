import { ScrollView, Text, FlatList } from "react-native";
import { useEffect, useState } from "react";
import RestaurantCard from "../components/RestaurantCard";
import restaurants from "../assets/restaurants.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SplashScreen from "./SplashScreen";
import { useIsFocused } from "@react-navigation/native";

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isFocused = useIsFocused();

  useEffect(() => {
    const getFavorites = async () => {
      setIsLoading(true);
      const favorites = await AsyncStorage.getItem("favorites");
      if (favorites) {
        const splittedFav = favorites ? favorites.split("-") : [];
        const restaurantsData = [];
        splittedFav.forEach((id) => {
          const restToPushIndex = restaurants.findIndex((el) => {
            return String(el.placeId) === id;
          });
          restaurantsData.push(restaurants[restToPushIndex]);
        });
        setFavorites(restaurantsData);
        setIsLoading(false);
      }
    };
    getFavorites();
  }, [isFocused]);

  return isLoading ? (
    <SplashScreen />
  ) : (
    <FlatList
      data={favorites}
      keyExtractor={(item) => item.placeId}
      renderItem={({ item }) => {
        return <RestaurantCard data={item} />;
      }}
      style={{ backgroundColor: "white" }}
    />
  );
};

export default FavoritesScreen;
