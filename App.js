// Import des éléments utiles
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableOpacity,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useState, useEffect } from "react";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Import des écrans
import FavoritesScreen from "./containers/FavoritesScreen";
import MapScreen from "./containers/MapScreen";
import RestaurantScreen from "./containers/RestaurantScreen";
import RestaurantsScreen from "./containers/RestaurantsScreen";
import SplashScreen from "./containers/SplashScreen";

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Tab" options={{ headerShown: false }}>
          {() => (
            <Tab.Navigator
              screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#7a4ec7",
                tabBarInactiveTintColor: "gray",
              }}
            >
              <Tab.Screen
                name="ExplorerTab"
                options={{
                  tabBarLabel: "Explorer",
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons
                      name={"search-outline"}
                      size={size}
                      color={color}
                    />
                  ),
                }}
              >
                {() => (
                  <Stack.Navigator>
                    <Stack.Screen
                      options={({ navigation }) => ({
                        headerStyle: {
                          backgroundColor: "#6e3fac",
                        },
                        headerRight: () => (
                          <TouchableOpacity
                            onPress={() => navigation.navigate("Map")}
                            title=""
                          >
                            <Ionicons
                              name="map-outline"
                              size={20}
                              color={"white"}
                            />
                          </TouchableOpacity>
                        ),
                      })}
                      name="Restaurants"
                    >
                      {() => <RestaurantsScreen />}
                    </Stack.Screen>

                    <Stack.Screen
                      options={{
                        headerStyle: {
                          backgroundColor: "#6e3fac",
                        },
                        headerTitle: "",
                      }}
                      name="Map"
                    >
                      {() => <MapScreen />}
                    </Stack.Screen>

                    <Stack.Screen name="Restaurant">
                      {(props) => <RestaurantScreen {...props} />}
                    </Stack.Screen>
                  </Stack.Navigator>
                )}
              </Tab.Screen>
              <Tab.Screen
                name="FavoritesTab"
                options={{
                  tabBarLabel: "Favorites",
                  tabBarIcon: ({ color, size }) => {
                    return (
                      <Ionicons name="star-outline" size={size} color={color} />
                    );
                  },
                }}
              >
                {() => (
                  <Stack.Navigator>
                    <Stack.Screen name="Favorites">
                      {() => <FavoritesScreen />}
                    </Stack.Screen>
                    <Stack.Screen
                      options={{
                        headerStyle: {
                          backgroundColor: "#6e3fac",
                        },
                        headerTitle: "",
                      }}
                      name="Map"
                    >
                      {() => <MapScreen />}
                    </Stack.Screen>

                    <Stack.Screen name="Restaurant">
                      {(props) => <RestaurantScreen {...props} />}
                    </Stack.Screen>
                  </Stack.Navigator>
                )}
              </Tab.Screen>
            </Tab.Navigator>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// CSS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
