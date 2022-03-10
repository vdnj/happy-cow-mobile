import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const SignUpScreen = ({ setToken }) => {
  const navigation = useNavigation();
  const [email, setEmail] = useState(null);
  const [isEmailValid, setIsEmailValid] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [isPassVisible, setIsPassVisible] = useState(false);
  const [vegStatus, setVegStatus] = useState(null);
  const [city, setCity] = useState(null);
  const [yearOfBirth, setYearOfBirth] = useState(null);
  const [isYearValid, setIsYearValid] = useState(null);
  const [isConditionAccepted, setIsConditionAccepted] = useState(null);
  const [accountExists, setAccountExists] = useState(false);

  const validateEmail = (text) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(text) === false) {
      setIsEmailValid(false);
    } else {
      setIsEmailValid(true);
    }
  };
  const validateYearOfBirth = (text) => {
    if (Number(text) < 1900 || Number(text) >= 2023) {
      setIsYearValid(false);
    } else {
      setIsYearValid(true);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "https://happy-cow-backend.herokuapp.com/user/signup",
        {
          email,
          password,
          username,
          vegStatus,
          city,
          yearOfBirth,
        }
      );
      const userToken = response.data.token;
      setToken(userToken);
    } catch (error) {
      setAccountExists(true);
      console.log(error.message);
    }
  };

  return (
    <View style={styles.signupScreen}>
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
          name="mail"
          size={20}
          color="#6e3fac"
        />
        <TextInput
          textContentType={"emailAddress"}
          value={email}
          style={styles.input}
          onChangeText={(text) => {
            setEmail(text);
            validateEmail(text);
          }}
          placeholder="Email"
        />
      </View>
      {isEmailValid === false && (
        <Text style={styles.warning}>Invalid email address</Text>
      )}
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
      <View style={styles.searchSection}>
        <Ionicons
          style={styles.searchIcon}
          name="leaf"
          size={20}
          color="#6e3fac"
        />
        <TextInput
          value={vegStatus}
          style={styles.input}
          onChangeText={(text) => setVegStatus(text)}
          placeholder="Veg Status"
        />
      </View>
      <View style={styles.searchSection}>
        <Ionicons
          style={styles.searchIcon}
          name="home"
          size={20}
          color="#6e3fac"
        />
        <TextInput
          value={city}
          style={styles.input}
          onChangeText={(text) => setCity(text)}
          placeholder="City"
        />
      </View>
      <View style={styles.searchSection}>
        <Ionicons
          style={styles.searchIcon}
          name="pizza"
          size={20}
          color="#6e3fac"
        />
        <TextInput
          value={yearOfBirth}
          style={styles.input}
          onChangeText={(text) => {
            setYearOfBirth(text);
            validateYearOfBirth(text);
          }}
          placeholder="Year Of Birth"
        />
      </View>
      {isYearValid === false && (
        <Text style={styles.warning}>Invalid year of birth</Text>
      )}
      <TouchableOpacity
        onPress={async () => {
          handleSubmit();
        }}
      >
        <Text style={styles.register}>Register</Text>
      </TouchableOpacity>
      {accountExists && (
        <Text style={{ color: "red" }}>
          An account already exists with this email
        </Text>
      )}
      <TouchableOpacity
        onPress={async () => {
          navigation.navigate("SignIn");
        }}
      >
        <Text style={{ marginTop: 10, fontSize: 10 }}>
          Already Have An Account ?
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  signupScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "white",
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
  warning: {
    fontSize: 9,
    color: "red",
  },
  register: {
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

export default SignUpScreen;
