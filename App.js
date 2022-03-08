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
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Import des écrans
import FavoritesScreen from "./containers/FavoritesScreen";
import MapScreen from "./containers/MapScreen";
import RestaurantScreen from "./containers/RestaurantScreen";
import RestaurantsScreen from "./containers/RestaurantsScreen";
import SplashScreen from "./containers/SplashScreen";
import SignUpScreen from "./containers/SignUpScreen";
import SignInScreen from "./containers/SignInScreen";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  const setToken = async (token) => {
    if (token) {
      await AsyncStorage.setItem("userToken", token);
    } else {
      await AsyncStorage.removeItem("userToken");
    }

    setUserToken(token);
  };

  useEffect(() => {
    const bootstrapAsync = async () => {
      const userToken = await AsyncStorage.getItem("userToken");
      setUserToken(userToken);
      setIsLoading(false);
    };
    bootstrapAsync();
  }, []);

  if (isLoading === true) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userToken === null ? (
          // No token found, user isn't signed in
          <>
            <Stack.Screen
              name="SignIn"
              options={({ navigation }) => ({
                headerStyle: {
                  backgroundColor: "#6e3fac",
                },
                headerTitleStyle: {
                  color: "white",
                },
                title: "Sign In",
              })}
            >
              {() => <SignInScreen setToken={setToken} />}
            </Stack.Screen>
            <Stack.Screen
              name="SignUp"
              options={({ navigation }) => ({
                headerStyle: {
                  backgroundColor: "#6e3fac",
                },
                headerTitleStyle: {
                  color: "white",
                },
                title: "Sign Up",
              })}
            >
              {() => <SignUpScreen setToken={setToken} />}
            </Stack.Screen>
          </>
        ) : (
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
                          headerTitle: () => (
                            <Image
                              source={{
                                uri: "https://res.cloudinary.com/dxla31aiu/image/upload/v1646399899/HappyCow/Capture_d_e%CC%81cran_2022-03-04_a%CC%80_14.17.39_p9k9ug.png",
                              }}
                              style={{
                                width: 120,
                                height: 40,
                              }}
                            />
                          ),
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
                          headerTitle: () => (
                            <Image
                              source={{
                                uri: "https://res.cloudinary.com/dxla31aiu/image/upload/v1646399899/HappyCow/Capture_d_e%CC%81cran_2022-03-04_a%CC%80_14.17.39_p9k9ug.png",
                              }}
                              style={{
                                width: 120,
                                height: 40,
                              }}
                            />
                          ),
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
                        <Ionicons
                          name="star-outline"
                          size={size}
                          color={color}
                        />
                      );
                    },
                  }}
                >
                  {() => (
                    <Stack.Navigator>
                      <Stack.Screen
                        name="Favorites"
                        options={{
                          headerStyle: {
                            backgroundColor: "#6e3fac",
                          },
                          headerTitle: () => (
                            <Image
                              source={{
                                uri: "https://res.cloudinary.com/dxla31aiu/image/upload/v1646399899/HappyCow/Capture_d_e%CC%81cran_2022-03-04_a%CC%80_14.17.39_p9k9ug.png",
                              }}
                              style={{
                                width: 120,
                                height: 40,
                              }}
                            />
                          ),
                        }}
                      >
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
        )}
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
