import {ScrollView, Text, TouchableOpacity, View} from "react-native";
import {ChevronRight} from "lucide-react-native";
import React from "react";
import {router} from "expo-router";

const WelcomeScreen = () => {

    const onContinue = () => {
        router.replace("/(auth)/signInScreen");
    }

    return (
        <View className="flex-1 bg-[#F7F7FF]">
            <ScrollView className="flex-1">
                <View className="items-center justify-center mt-32 mb-10">
                    <Text className="text-4xl font-bold text-[#6E44FF] mb-2">InfluenceConnect</Text>
                    <Text className="text-lg text-[#6C757D] text-center px-8">
                        Connect with top influencers for your brand
                    </Text>
                </View>

                <View className="items-center mb-12 mt-16">
                    <View className="w-64 h-64 rounded-full bg-[#B892FF] flex items-center justify-center mb-8">
                        <View className="w-48 h-48 rounded-full bg-[#6E44FF] flex items-center justify-center">
                            <View className="w-32 h-32 rounded-full bg-white flex items-center justify-center">
                                <Text className="text-4xl text-[#6E44FF] font-bold">IC</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View className="px-8 mb-12">
                    <Text className="text-xl font-semibold text-[#2C2C2C] text-center mb-4">
                        Discover Your Perfect Influencer Match
                    </Text>
                    <Text className="text-[#6C757D] text-center px-4">
                        Our AI-powered platform connects brands with influencers who align with your values and audience.
                    </Text>
                </View>

                <TouchableOpacity
                    className="bg-[#6E44FF] mt-36 py-4 px-8 rounded-xl mx-8 mb-8 flex-row items-center justify-center"
                    onPress={onContinue}
                >
                    <Text className="text-white text-lg font-semibold mr-2">Get Started</Text>
                    <ChevronRight color="white" size={20} />
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default WelcomeScreen;
