import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
// import restaurants from "../assets/restaurantsFull.json";
import RestaurantCard from "../components/RestaurantCard";
import SplashScreen from "./SplashScreen";
import { useState, useEffect } from "react";
import axios from "axios";

const RestaurantsScreen = ({ navigation }) => {
  const [filter, setFilter] = useState(null);
  const [restaurants, setRestaurants] = useState(null);
  const [data, setData] = useState(null);
  const [actualShowing, setActualShowing] = useState(6);
  const [isLoading, setIsLoading] = useState(true);

  let showingValue = 6;

  useEffect(() => {
    const fetchRestaurants = async () => {
      console.log("ENTERING FETCHRESTAURANTS");
      const restaurants = await axios.get("http://localhost:3000/restaurants");
      console.log(restaurants.data.length);
      setRestaurants(restaurants.data);
    };
    fetchRestaurants();

    let newData;

    if (filter === "Other") {
      newData = restaurants
        .filter(
          (el) =>
            el.type !== "vegan" &&
            el.type !== "vegetarian" &&
            el.type !== "Veg Store"
        )
        .slice(0, actualShowing);
    } else if (filter) {
      newData = restaurants
        .filter((el) => el.type === filter)
        .slice(0, actualShowing);
    } else {
      newData = restaurants.slice(0, actualShowing);
    }

    setData(newData);
    setIsLoading(false);
  }, [filter, restaurants]);

  const handleFilterClick = (filterClicked) => {
    filter === filterClicked ? setFilter(null) : setFilter(filterClicked);
    setActualShowing(showingValue);
  };

  const handleLoadMore = () => {
    const newData = [...data];
    let dataToAdd;

    if (filter === "Other") {
      dataToAdd = restaurants
        .filter(
          (el) =>
            el.type !== "vegan" &&
            el.type !== "vegetarian" &&
            el.type !== "Veg Store"
        )
        .slice(actualShowing, actualShowing + showingValue);
    } else if (filter) {
      dataToAdd = restaurants
        .filter((el) => el.type === filter)
        .slice(actualShowing, actualShowing + showingValue);
    } else {
      dataToAdd = restaurants.slice(
        actualShowing,
        actualShowing + showingValue
      );
    }

    dataToAdd.forEach((el) => newData.push(el));
    setData(newData);
    const newActualShowing = actualShowing + showingValue;
    setActualShowing(newActualShowing);
  };

  return isLoading ? (
    <SplashScreen />
  ) : (
    <View>
      <View style={styles.filters}>
        <TouchableOpacity
          style={[
            styles.filter,
            {
              backgroundColor: filter === "vegan" ? "#6e3fac" : "white",
            },
          ]}
          onPress={() => handleFilterClick("vegan")}
        >
          <Image
            source={{
              uri: "https://res.cloudinary.com/dxla31aiu/image/upload/v1646406922/HappyCow/vegan.png",
            }}
            style={{
              height: 20,
              width: 20,
              borderRadius: 10,
            }}
          />
          <Text
            style={[
              styles.filterText,
              {
                color: filter === "vegan" ? "white" : "black",
              },
            ]}
          >
            Vegan
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filter,
            {
              backgroundColor: filter === "vegetarian" ? "#6e3fac" : "white",
            },
          ]}
          onPress={() => handleFilterClick("vegetarian")}
        >
          <Image
            source={{
              uri: "https://res.cloudinary.com/dxla31aiu/image/upload/v1646407750/HappyCow/vegetarian_h76kt4.png",
            }}
            style={{ height: 20, width: 20, borderRadius: 10 }}
          />
          <Text
            style={[
              styles.filterText,
              {
                color: filter === "vegetarian" ? "white" : "black",
              },
            ]}
          >
            Vegetarian
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filter,
            {
              backgroundColor: filter === "Veg Store" ? "#6e3fac" : "white",
            },
          ]}
          onPress={() => handleFilterClick("Veg Store")}
        >
          <Image
            source={{
              uri: "https://res.cloudinary.com/dxla31aiu/image/upload/v1646407838/HappyCow/vegstore_sggr5o.png",
            }}
            style={{ height: 20, width: 20, borderRadius: 10 }}
          />
          <Text
            style={[
              styles.filterText,
              {
                color: filter === "Veg Store" ? "white" : "black",
              },
            ]}
          >
            Vegan Store
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filter,
            {
              backgroundColor: filter === "Other" ? "#6e3fac" : "white",
            },
          ]}
          onPress={() => handleFilterClick("Other")}
        >
          <Image
            source={{
              uri: "https://res.cloudinary.com/dxla31aiu/image/upload/v1646407633/HappyCow/other_xbytay.png",
            }}
            style={{ height: 20, width: 20, borderRadius: 10 }}
          />
          <Text
            style={[
              styles.filterText,
              {
                color: filter === "Other" ? "white" : "black",
              },
            ]}
          >
            Other
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.placeId}
        renderItem={({ item }) => {
          return <RestaurantCard data={item} />;
        }}
        onEndReachedThreshold={0.01}
        onMomentumScrollEnd={handleLoadMore}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  filters: {
    flexDirection: "row",
    justifyContent: "center",
  },
  filter: {
    margin: 5,
    width: Dimensions.get("window").width * 0.22,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 7,
    borderColor: "lightgray",
    borderWidth: 1,
    alignItems: "center",
  },
  filterText: {
    fontSize: 10,
    fontWeight: "bold",
    marginTop: 10,
  },
});

export default RestaurantsScreen;
