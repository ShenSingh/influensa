import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator, Platform, Alert} from 'react-native';
import { Search, User, Star, MapPin, DollarSign, TrendingUp, MessageCircle, Heart } from 'lucide-react-native';
import { router } from 'expo-router';
import FooterNav from "@/components/FooterNav";
import {AppName} from "@/components/AppName";
import AppleFooterNav from "@/components/AppleFooterNav";
import { getDetailedRecommendations } from '@/services/match-ai.service';
import { convertGoogleDriveUrl } from '@/utils/googleDriveUtils';

interface RecommendationResult {
    username: string;
    similarity_score: number;
    avg_likes: number;
    avg_comments: number;
    influencer: any;
    hasProfile: boolean;
}

export default function MatchInfluencerScreen() {
    const [businessDetails, setBusinessDetails] = useState('');
    const [loading, setLoading] = useState(false);
    const [recommendations, setRecommendations] = useState<RecommendationResult[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const handleFindInfluencers = async () => {
        if (!businessDetails.trim()) {
            Alert.alert('Please enter business details');
            return;
        }

        setLoading(true);
        try {
            const results = await getDetailedRecommendations(businessDetails);
            setRecommendations(results);
            setHasSearched(true);
            console.log('Recommendations received:', results);
        } catch (error) {
            console.error('Error finding influencers:', error);
            Alert.alert('Error', 'Failed to find matching influencers. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderRecommendationCard = (recommendation: RecommendationResult, index: number) => {
        const { username, similarity_score, avg_likes, avg_comments, influencer, hasProfile } = recommendation;

        return (
            <TouchableOpacity
                key={index}
                className="bg-white rounded-2xl shadow-sm p-4 mb-4"
                onPress={() => {
                    if (hasProfile && influencer) {
                        // Navigate to influencer profile
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

                {!hasProfile && (
                    <View className="mt-2 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                        <Text className="text-yellow-800 text-xs text-center">
                            This influencer is not yet in our database but shows high compatibility
                        </Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <View className="bg-indigo-600 px-4 pt-12 pb-6 rounded-b-3xl">
                <View className="flex-row items-center justify-between mt-10">
                    <AppName fontSize={28} color="#fff" />
                </View>
                <Text className="text-white/90 text-base mt-2">
                    AI-Powered Influencer Matching
                </Text>
            </View>

            <ScrollView className="flex-1 px-4 py-6">
                {/* Business Details Input */}
                <View className="mb-6">
                    <Text className="text-gray-900 text-lg font-bold mb-3">
                        Describe Your Business
                    </Text>
                    <Text className="text-gray-600 text-sm mb-4">
                        Tell us about your business, target audience, and campaign goals for AI-powered matching.
                    </Text>

                    <TextInput
                        className="bg-gray-50 rounded-xl p-4 text-gray-900 min-h-24"
                        placeholder="e.g., We're a sustainable fashion brand targeting eco-conscious millennials..."
                        multiline
                        value={businessDetails}
                        onChangeText={setBusinessDetails}
                        textAlignVertical="top"
                    />
                </View>

                {/* Search Button */}
                <TouchableOpacity
                    className={`rounded-xl py-4 px-6 mb-6 flex-row items-center justify-center ${
                        loading ? 'bg-gray-400' : 'bg-indigo-600'
                    }`}
                    onPress={handleFindInfluencers}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" size="small" className="mr-2" />
                    ) : (
                        <Search color="white" size={20} className="mr-2" />
                    )}
                    <Text className="text-white font-semibold text-lg">
                        {loading ? 'Finding Matches...' : 'Find Matching Influencers'}
                    </Text>
                </TouchableOpacity>

                {/* Results */}
                {hasSearched && (
                    <View>
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-gray-900 text-lg font-bold">
                                AI Recommendations ({recommendations.length})
                            </Text>
                        </View>

                        {recommendations.length === 0 ? (
                            <View className="bg-gray-50 rounded-xl p-6 items-center">
                                <Text className="text-gray-600 text-center">
                                    No matching influencers found. Try adjusting your business description.
                                </Text>
                            </View>
                        ) : (
                            <View>
                                {recommendations.map((rec, index) => renderRecommendationCard(rec, index))}
                            </View>
                        )}
                    </View>
                )}

                {/* Info Section */}
                {!hasSearched && (
                    <View className="bg-indigo-50 rounded-xl p-4 mt-4">
                        <Text className="text-indigo-900 font-semibold mb-2">How it works:</Text>
                        <Text className="text-indigo-800 text-sm leading-5">
                            Our AI analyzes your business description and matches you with influencers based on content similarity, engagement rates, and audience alignment.
                        </Text>
                    </View>
                )}
            </ScrollView>

            {Platform.OS === "ios" ? <AppleFooterNav /> : <FooterNav />}
        </View>
    );
}
