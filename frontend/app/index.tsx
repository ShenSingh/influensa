import { View, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/(dashboard)/homeScreen");
      } else {
        router.replace("/(auth)/welcomeScreen");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <View className="flex-1 w-full justify-center items-center bg-[#F7F7FF]">
        <ActivityIndicator size="large" color="#6E44FF" />
      </View>
    );
  }

  return null;
};

export default Index;
