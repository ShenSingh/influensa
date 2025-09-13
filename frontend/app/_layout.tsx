import { Stack } from "expo-router";
import { AuthProvider } from "@/context/AuthContext";
import { LoaderProvider } from "@/context/LoaderContext";
import "../global.css";
import FooterNav from "@/components/FooterNav";

export default function RootLayout() {
  return (
    <AuthProvider>
      <LoaderProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
        </Stack>
      </LoaderProvider>

    </AuthProvider>
  );
}
