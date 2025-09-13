import {Image, Text, TouchableOpacity, View} from "react-native";
import {router} from "expo-router";
import {Star} from "lucide-react-native";
import React from "react";

export  const TopInfluencers = () => {

    // Mock data for top influencers
    const topInfluencers = [
        {
            id: '1',
            name: 'Alex Morgan',
            niche: 'Fashion & Lifestyle',
            followers: '1.2M',
            engagement: '4.8%',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D',
        },
        {
            id: '2',
            name: 'Jordan Smith',
            niche: 'Tech & Gaming',
            followers: '850K',
            engagement: '5.2%',
            image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fHVzZXJ8ZW58MHx8MHx8fDA%3D',
        },
    ];

    return (
        <View>
            <View className="mb-8">
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-lg font-bold text-gray-900">Top Influencers</Text>
                    <TouchableOpacity

                    >
                        <Text className="text-indigo-600 font-medium">See all</Text>
                    </TouchableOpacity>
                </View>

                <View className="flex-row gap-4">
                    {topInfluencers.map((influencer) => (
                        <TouchableOpacity
                            key={influencer.id}
                            className="bg-white rounded-xl shadow-sm p-4 flex-1"
                            onPress={() => {
                                // Navigate to influencer profile page
                                router.push("/(dashboard)/influencerProfileScreen");
                            }}
                        >
                            <Image
                                source={{ uri: influencer.image }}
                                className="w-16 h-16 rounded-full self-center mb-3"
                            />
                            <Text className="text-center font-bold text-gray-900">{influencer.name}</Text>
                            <Text className="text-center text-gray-600 text-sm mt-1">{influencer.niche}</Text>
                            <View className="flex-row items-center justify-center mt-2">
                                <Star color="#FBBF24" fill="#FBBF24" size={16} />
                                <Text className="text-gray-700 text-sm ml-1">{influencer.engagement}</Text>
                            </View>
                            <Text className="text-center text-gray-500 text-xs mt-1">{influencer.followers} followers</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    )
}
