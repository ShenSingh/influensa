import {Text, TouchableOpacity, View} from "react-native";
import {router} from "expo-router";
import {User} from "lucide-react-native";
import React from "react";
import {Business} from "@/types/Business";


interface HomeBusinessProfileCardProps {
    businessDetails?: Business
}

export const HomeBusinessProfileCard = ({businessDetails}: HomeBusinessProfileCardProps) => {

    return (
        <View className="bg-indigo-50 rounded-xl p-5 mb-8">
            <View className="flex-row justify-between items-start">
                <View>
                    <Text className="text-lg font-bold text-gray-900">Your Business Profile</Text>
                    <Text className="text-gray-600 mt-1">Complete your profile to get better matches</Text>
                </View>
                <TouchableOpacity onPress={() => router.push("/(dashboard)/userBusinessScreen")}>
                    <Text className="text-indigo-600 font-medium">Edit</Text>
                </TouchableOpacity>
            </View>

            <View className="mt-4 flex-row items-center">
                <View className="bg-indigo-100 rounded-full p-3">
                    <User color="#4F46E5" size={24}/>
                </View>
                <View className="ml-4">
                    <Text className="font-bold text-gray-900">{businessDetails?.businessName || "Business Name"}</Text>
                    <Text className="text-gray-600 text-sm">{businessDetails?.businessType || "Type"}</Text>
                </View>
            </View>
        </View>
    );
}
