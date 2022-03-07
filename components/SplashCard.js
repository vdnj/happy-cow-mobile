import { View, Image, Text, ActivityIndicator } from "react-native";

const SplashCard = () => {
  return (
    <View style={{ padding: 10, flexDirection: "row" }}>
      <View
        style={{
          height: 100,
          width: 100,
          borderRadius: 5,
          borderColor: "lightgray",
          borderWidth: 1,
        }}
      ></View>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator
          color={"#6e3fac"}
          style={{
            height: 30,
            width: 30,
          }}
        />
      </View>
    </View>
  );
};

export default SplashCard;
