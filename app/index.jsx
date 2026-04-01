import { Redirect } from "expo-router";
import { useAuth } from "../src/context/AuthContext";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#f7f7f3' }}>
        <ActivityIndicator size="large" color="#863ceb" />
      </View>
    );
  }

  // Delegate to AuthContext's centralized logic by providing a default landing
  return <Redirect href={token ? "/(tabs)" : "/login"} />;
}
