import {Image, Text, TouchableOpacity, View, ScrollView} from "react-native";
import {router} from "expo-router";
import {Star} from "lucide-react-native";
import React from "react";
import {Influencer} from "@/types/Influencer";
import { convertGoogleDriveUrl } from '@/utils/googleDriveUtils';

interface TopInfluencersProps {
    top5Influencers?: Influencer[]
}

export const TopInfluencers = ({top5Influencers}: TopInfluencersProps) => {

    // Mock data for top influencers (fallback)
    const mockInfluencers = [
        {
            _id: '1',
            name: 'Alex Morgan',
            niche: 'Fashion & Lifestyle',
            followers: '1.2M',
            engagement: '4.8%',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D',
            username: 'alexmorgan',
            bio: 'Fashion influencer',
            location: 'New York',
            profileImage: '',
            posts: [],
            createdAt: '',
            updatedAt: '',
            __v: 0
        },
        {
            _id: '2',
            name: 'Jordan Smith',
            niche: 'Tech & Gaming',
            followers: '850K',
            engagement: '5.2%',
            image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fHVzZXJ8ZW58MHx8MHx8fDA%3D',
            username: 'jordansmith',
            bio: 'Tech reviewer',
            location: 'California',
            profileImage: '',
            posts: [],
            createdAt: '',
            updatedAt: '',
            __v: 0
        },
    ];

    // Use real data if available, otherwise fallback to mock data
    const displayInfluencers = top5Influencers && top5Influencers.length > 0 ? top5Influencers : mockInfluencers;

    return (
        <View className="mb-8">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-bold text-gray-900">Top 5 Influencers</Text>
                <TouchableOpacity
                    onPress={() => {
                        // Navigate to full influencers list page
                        router.push("/(dashboard)/influencerScreen");
                    }}
                >
                    <Text className="text-indigo-600 font-medium">See all</Text>
                </TouchableOpacity>
            </View>

            {/* Horizontal scrollable list of top 5 influencers */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="gap-4"
                contentContainerStyle={{ paddingRight: 16 }}
            >
                {displayInfluencers.map((influencer, index) => (
                    <TouchableOpacity
                        key={influencer._id || index}
                        className="bg-white rounded-xl shadow-sm p-4 mr-4 w-40"
                        onPress={() => {
                            // Navigate to influencer profile page with ID
                            router.push({
                                pathname: '/(dashboard)/influencerProfileScreen',
                                params: { influencerId: influencer._id }
                            });
                        }}
                    >
                        <Image
                            source={{
                                uri: influencer.image
                                    ? convertGoogleDriveUrl(influencer.image)
                                    : influencer.image
                                        ? convertGoogleDriveUrl(influencer.image)
                                        : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60'
                            }}
                            className="w-16 h-16 rounded-full self-center mb-3"
                        />
                        <Text className="text-center font-bold text-gray-900 text-sm" numberOfLines={1}>
                            {influencer.name}
                        </Text>
                        <Text className="text-center text-gray-600 text-xs mt-1" numberOfLines={1}>
                            {influencer.niche}
                        </Text>
                        <View className="flex-row items-center justify-center mt-2">
                            <Star color="#FBBF24" fill="#FBBF24" size={14}/>
                            <Text className="text-gray-700 text-xs ml-1">
                                {influencer.engagement || '4.5%'}
                            </Text>
                        </View>
                        <Text className="text-center text-gray-500 text-xs mt-1" numberOfLines={1}>
                            {influencer.followers} followers
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    )
}
