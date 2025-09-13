import {View, Text, TouchableOpacity} from "react-native"
import React from "react"
import { useRouter, useSegments } from "expo-router"
import {Briefcase, Home, Search, User} from "lucide-react-native";

const tabs = [
  { label: "Home", path: "/homeScreen", icon: Home },
  { label: "Influencer", path: "/influencerScreen", icon: User },
  { label: "Match", path: "/matchInfluencerScreen", icon: Search },
  { label: "Business", path: "/userBusinessScreen", icon: Briefcase }
] as const

const FooterNav = () => {
  const router = useRouter()
  const segments = useSegments()
  const activeRoute = "/" + (segments[segments.length - 1] || "")

  return (
      <View className="flex-row justify-around items-center py-3 bg-white border-t border-gray-200">
        {tabs.map((tab) => {
          const isActive = activeRoute === tab.path
          const IconComponent = tab.icon

          return (
            <TouchableOpacity
              key={tab.path}
              className="items-center"
              onPress={() => router.push(tab.path as any)}
            >
              <IconComponent
                size={24}
                color={isActive ? "#6E44FF" : "#6C757D"}
              />
              <Text className={`text-xs mt-1 ${isActive ? "text-[#6E44FF]" : "text-gray-500"}`}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
  )
}

export default FooterNav
