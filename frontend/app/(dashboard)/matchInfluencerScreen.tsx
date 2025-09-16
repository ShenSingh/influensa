import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator, Platform, Alert} from 'react-native';
import { Search, User, Star, MapPin, TrendingUp, MessageCircle, Heart } from 'lucide-react-native';
import { router } from 'expo-router';
import FooterNav from "@/components/FooterNav";
import {AppName} from "@/components/AppName";
import AppleFooterNav from "@/components/AppleFooterNav";
import { getRecommendInfluencer } from '@/services/match-ai.service';
import { convertGoogleDriveUrl } from '@/utils/googleDriveUtils';
import {Influencer} from "@/types/Influencer";
import {RecommendationCard} from "@/components/RecommendationCard";

export interface RecommendationResult {
    username: string;
    similarity_score: number;
    avg_likes: number;
    avg_comments: number;
    influencer: Influencer;
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
            const results = await getRecommendInfluencer(businessDetails);
            console.log('API Response:', results);


            // Ensure results is an array before setting state
            if (Array.isArray(results)) {
                setRecommendations(results);
            } else {
                console.error('API did not return an array:', results);
                setRecommendations([]);
            }

            setHasSearched(true);
        } catch (error) {
            console.error('Error finding influencers:', error);
            setRecommendations([]); // Reset to empty array on error
            Alert.alert('Error', 'Failed to find matching influencers. Please try again.');
        } finally {
            setLoading(false);
        }
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
                                AI Recommendations ({Array.isArray(recommendations) ? recommendations.length : 0})
                            </Text>
                        </View>
                        <View>
                            {recommendations.map((rec, index) => (
                                <RecommendationCard
                                    key={index}
                                    recommendation={rec}
                                    index={index}
                                />
                            ))}
                        </View>
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
