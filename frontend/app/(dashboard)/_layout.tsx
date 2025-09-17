import React from "react";
import { Stack } from "expo-router";
import FooterNav from "@/components/FooterNav";

const DashboardLayout = () => {
  return (
    <Stack
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    >
      <Stack.Screen name="homeScreen" options={{ title: "Home Screen" }} />
      <Stack.Screen name="influencerProfile" options={{ title: "Influencer Profile" }} />
      <Stack.Screen name="influencerProfileScreen" options={{ title: "Influencer Profile Screen" }} />
      <Stack.Screen name="influencerScreen" options={{ title: "Influencer Screen" }} />
      <Stack.Screen name="userBusinessScreen" options={{ title: "User Business Screen" }} />
      <Stack.Screen name="userScreen" options={{ title: "User Screen" }} />
    </Stack>
  );
};

export default DashboardLayout;
