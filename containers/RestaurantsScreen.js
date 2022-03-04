import { View, Text, FlatList } from "react-native";
import restaurants from "../assets/restaurants.json";
import RestaurantCard from "../components/RestaurantCard";

const RestaurantsScreen = ({ navigation }) => {
  return (
    <FlatList
      data={restaurants}
      keyExtractor={(item) => item.placeId}
      renderItem={({ item }) => {
        return <RestaurantCard data={item} />;
      }}
    />
  );
};

export default RestaurantsScreen;
