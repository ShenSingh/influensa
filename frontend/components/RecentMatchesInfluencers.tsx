import {Image, Text, TouchableOpacity, View} from "react-native";
import {ChevronRight} from "lucide-react-native";
import React from "react";
import {RecommendationResult} from "@/app/(dashboard)/matchInfluencerScreen";
import { convertGoogleDriveUrl } from '@/utils/googleDriveUtils';

interface RecentMatchesInfluencersProps {
    recommendations: RecommendationResult[];
}

export const RecentMatchesInfluencers = ({ recommendations }: RecentMatchesInfluencersProps) => {

    // Fallback data when no recommendations are available
    const fallbackMatches = [
        {
            id: '1',
            name: 'Taylor Swift',
            niche: 'Music & Entertainment',
            similarity: '92%',
            image: 'https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTN8fHVzZXJ8ZW58MHx8MHx8fDA%3D',
        },
        {
            id: '2',
            name: 'Chris Evans',
            niche: 'Fitness & Health',
            similarity: '87%',
            image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fHVzZXJ8ZW58MHx8MHx8fDA%3D',
        },
    ];

    // Use AI recommendations if available, otherwise fallback to mock data
    const displayMatches = recommendations.length > 0 ? recommendations : fallbackMatches;

    return (
        <View>
            {/* Recent Matches Section */}
            <View className="mb-8">
                <Text className="text-lg font-bold text-gray-900 mb-4">
                    {recommendations.length > 0 ? "AI Recommended Matches" : "Your Recent Matches"}
                </Text>

                <View className="gap-4">
                    {displayMatches.map((match, index) => {
                        // Handle both AI recommendations and fallback data
                        const isAIRecommendation = 'similarity_score' in match;

                        if (isAIRecommendation) {
                            const recommendation = match as RecommendationResult;
                            return (
                                <TouchableOpacity
                                    key={recommendation.username}
                                    className="bg-white rounded-xl shadow-sm p-4 flex-row items-center"
                                >
                                    <Image
                                        source={{
                                            uri: recommendation.influencer.image
                                                ? convertGoogleDriveUrl(recommendation.influencer.image)
                                                : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60'
                                        }}
                                        className="w-16 h-16 rounded-full"
                                    />
                                    <View className="ml-4 flex-1">
                                        <Text className="font-bold text-gray-900">@{recommendation.username}</Text>
                                        <Text className="text-gray-600 text-sm mt-1">
                                            {recommendation.influencer.niche || 'Influencer'}
                                        </Text>
                                        <View className="flex-row items-center mt-1">
                                            <Text className="text-indigo-600 font-medium">
                                                Match: {Math.round(recommendation.similarity_score)}%
                                            </Text>
                                        </View>
                                    </View>
                                    <ChevronRight color="#6B7280" size={20} />
                                </TouchableOpacity>
                            );
                        } else {
                            // Fallback data structure
                            const fallback = match as any;
                            return (
                                <TouchableOpacity
                                    key={fallback.id}
                                    className="bg-white rounded-xl shadow-sm p-4 flex-row items-center"
                                >
                                    <Image
                                        source={{ uri: fallback.image }}
                                        className="w-16 h-16 rounded-full"
                                    />
                                    <View className="ml-4 flex-1">
                                        <Text className="font-bold text-gray-900">{fallback.name}</Text>
                                        <Text className="text-gray-600 text-sm mt-1">{fallback.niche}</Text>
                                        <View className="flex-row items-center mt-1">
                                            <Text className="text-indigo-600 font-medium">Match: {fallback.similarity}</Text>
                                        </View>
                                    </View>
                                    <ChevronRight color="#6B7280" size={20} />
                                </TouchableOpacity>
                            );
                        }
                    })}
                </View>

                {recommendations.length === 0 && (
                    <View className="mt-2">
                        <Text className="text-gray-500 text-sm text-center">
                            Add business details to get AI-powered recommendations
                        </Text>
                    </View>
                )}
            </View>
        </View>
    )
}
