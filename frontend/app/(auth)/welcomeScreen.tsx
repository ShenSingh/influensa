import {ScrollView, Text, TouchableOpacity, View, Image} from "react-native";
import {ChevronRight} from "lucide-react-native";
import React from "react";
import {router} from "expo-router";
import {AppName} from "@/components/AppName";

const WelcomeScreen = () => {

    const onContinue = () => {
        router.replace("/(auth)/signInScreen");
    }

    return (
        <View className="flex-1 bg-[#F7F7FF]">
            <ScrollView className="flex-1">
                <View className="items-center justify-center mt-32 mb-10">
                    <AppName fontSize={32} color="#6E44FF" />
                    <Text className="text-lg text-[#6C757D] text-center px-8">
                        Connect with top influencers for your brand
                    </Text>
                </View>

                <View className="items-center mb-12 mt-16">
                    <Image
                        source={require("../../assets/images/wellcome-image.png")}
                        style={{ width: 300, height: 300, resizeMode: "contain" }}
                    />
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
                    className="bg-[#6E44FF] py-4 px-8 rounded-xl mx-8 mb-8 flex-row items-center justify-center"
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
