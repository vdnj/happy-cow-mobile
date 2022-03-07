import { View, Text, ActivityIndicator, Image, Dimensions } from "react-native";

const SplashScreen = () => {
  return (
    <View>
      <Image
        source={{
          uri: "https://res.cloudinary.com/dxla31aiu/image/upload/v1646588753/HappyCow/splashscreen_ablw96.png",
        }}
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height * 0.8,
          position: "relative",
        }}
      />
      <ActivityIndicator
        color={"#6e3fac"}
        style={{
          position: "absolute",
          top: 24,
          left: Dimensions.get("window").width * 0.46,
          backgroundColor: "white",
          height: 30,
          width: 30,
          borderRadius: 15,
        }}
      />
    </View>
  );
};

export default SplashScreen;
