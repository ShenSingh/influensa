import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { User, Star, MapPin, TrendingUp, MessageCircle, Heart } from 'lucide-react-native';
import { router } from 'expo-router';
import { convertGoogleDriveUrl } from '@/utils/googleDriveUtils';
import { RecommendationResult } from '@/app/(dashboard)/matchInfluencerScreen';

interface RecommendationCardProps {
    recommendation: RecommendationResult;
    index: number;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation, index }) => {
    const { username, similarity_score, avg_likes, avg_comments, influencer, hasProfile } = recommendation;

    return (
        <TouchableOpacity
            key={index}
            className="bg-white rounded-2xl shadow-sm p-4 mb-4"
            onPress={() => {
                if (hasProfile && influencer) {
                    router.push({
                        pathname: '/(dashboard)/influencerProfileScreen',
                        params: { influencerId: influencer._id }
                    });
                }
            }}
            disabled={!hasProfile}
        >
            <View className="flex-row">
                {/* Profile Image */}
                <View className="mr-4">
                    {hasProfile && influencer?.image ? (
                        <Image
                            source={{ uri: convertGoogleDriveUrl(influencer.image) }}
                            className="w-16 h-16 rounded-full"
                        />
                    ) : (
                        <View className="w-16 h-16 rounded-full bg-gray-200 items-center justify-center">
                            <User color="#9CA3AF" size={24} />
                        </View>
                    )}

                    {/* Match Score Badge */}
                    <View className="absolute -top-2 -right-2 bg-indigo-600 rounded-full px-2 py-1">
                        <Text className="text-white text-xs font-bold">
                            {(similarity_score * 100).toFixed(1)}%
                        </Text>
                    </View>
                </View>

                {/* Content */}
                <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                        <Text className="font-bold text-gray-900 text-lg">
                            {hasProfile ? influencer.name : `@${username}`}
                        </Text>
                        {hasProfile && influencer?.verified && (
                            <View className="ml-2 bg-blue-100 rounded-full p-1">
                                <Star color="#3B82F6" fill="#3B82F6" size={12} />
                            </View>
                        )}
                    </View>

                    <Text className="text-indigo-600 text-sm mb-2">@{username}</Text>

                    {hasProfile && influencer ? (
                        <>
                            <Text className="text-gray-600 text-sm mb-2">{influencer.niche}</Text>
                            <View className="flex-row items-center mb-2">
                                <MapPin color="#9CA3AF" size={14} />
                                <Text className="text-gray-500 text-xs ml-1">{influencer.location}</Text>
                            </View>
                            <View className="flex-row justify-between">
                                <View className="flex-row items-center">
                                    <User color="#9CA3AF" size={14} />
                                    <Text className="text-gray-700 text-sm ml-1">{influencer.followers}</Text>
                                </View>
                                <View className="flex-row items-center">
                                    <TrendingUp color="#10B981" size={14} />
                                    <Text className="text-gray-700 text-sm ml-1">{influencer.engagement}%</Text>
                                </View>
                            </View>
                        </>
                    ) : (
                        <Text className="text-gray-500 text-sm italic">Profile not found in database</Text>
                    )}

                    {/* AI Stats */}
                    <View className="mt-3 p-2 bg-gray-50 rounded-lg">
                        <Text className="text-gray-600 text-xs font-medium mb-1">AI Performance Metrics</Text>
                        <View className="flex-row justify-between">
                            <View className="flex-row items-center">
                                <Heart color="#FF6B6B" size={12} />
                                <Text className="text-gray-600 text-xs ml-1">
                                    {Math.round(avg_likes).toLocaleString()} avg likes
                                </Text>
                            </View>
                            <View className="flex-row items-center">
                                <MessageCircle color="#6E44FF" size={12} />
                                <Text className="text-gray-600 text-xs ml-1">
                                    {Math.round(avg_comments)} avg comments
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};
