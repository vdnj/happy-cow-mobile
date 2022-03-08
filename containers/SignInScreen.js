import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { setStatusBarNetworkActivityIndicatorVisible } from "expo-status-bar";

const SignInScreen = ({ setToken }) => {
  const navigation = useNavigation();

  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [isPassVisible, setIsPassVisible] = useState(false);

  return (
    <View style={styles.signInScreen}>
      <Image
        source={{
          uri: "https://res.cloudinary.com/dxla31aiu/image/upload/v1646669759/HappyCow/happycow_ubiuvs.jpg",
        }}
        style={{
          width: Dimensions.get("window").width,
          height: 90,
          marginBottom: 40,
          marginTop: 40,
        }}
      />
      <View style={styles.searchSection}>
        <Ionicons
          style={styles.searchIcon}
          name="person"
          size={20}
          color="#6e3fac"
        />
        <TextInput
          value={username}
          style={styles.input}
          onChangeText={(text) => setUsername(text)}
          placeholder="Username"
        />
      </View>
      <View style={styles.searchSection}>
        <TouchableOpacity
          onPress={() =>
            isPassVisible ? setIsPassVisible(false) : setIsPassVisible(true)
          }
        >
          <Ionicons
            style={styles.searchIcon}
            name={isPassVisible ? "lock-open" : "lock-closed"}
            size={20}
            color="#6e3fac"
          />
        </TouchableOpacity>
        <TextInput
          value={password}
          style={styles.input}
          onChangeText={(text) => setPassword(text)}
          placeholder="Password"
          secureTextEntry={isPassVisible ? false : true}
        />
      </View>
      <TouchableOpacity
        onPress={async () => {
          const userToken = "secret-token";
          setToken(userToken);
        }}
      >
        <Text style={styles.signIn}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={async () => {
          navigation.navigate("SignUp");
        }}
      >
        <Text style={{ marginTop: 10, fontSize: 10 }}>
          Don't Have An Account ?
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  signInScreen: {
    backgroundColor: "white",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    width: Dimensions.get("window").width * 0.75,
    borderBottomColor: "lightgray",
    borderBottomWidth: 1,
  },
  searchIcon: {
    padding: 10,
  },
  signIn: {
    width: Dimensions.get("window").width * 0.75,
    textAlign: "center",
    marginTop: 30,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#6e3fac",
    overflow: "hidden",
    color: "white",
  },
});

export default SignInScreen;
