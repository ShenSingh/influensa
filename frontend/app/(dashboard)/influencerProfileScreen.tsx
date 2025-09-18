import React, { useState, useEffect } from 'react';
import {View, Text, Image, ScrollView, TouchableOpacity, Dimensions, Platform} from 'react-native';
import { Star, Users, Heart, MessageCircle, Share2, Bookmark, Home, User, Search, Briefcase } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import FooterNav from "@/components/FooterNav";
import AppleFooterNav from "@/components/AppleFooterNav";
import InfluencerService from '@/services/influencer.service';
import { Influencer } from '@/types/Influencer';
import { convertGoogleDriveUrl } from '@/utils/googleDriveUtils';
import SocialMediaUtils from '@/utils/socialMediaUtils';

const { width } = Dimensions.get('window');
const imageWidth = width;

export default function InfluencerProfileScreen() {
    const { influencerId } = useLocalSearchParams<{ influencerId: string }>();
    const router = useRouter();
    const [influencer, setInfluencer] = useState<Influencer | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInfluencer = async () => {
            if (!influencerId) {
                setError('No influencer ID provided');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const data = await InfluencerService.getInfluencerById(influencerId);
                setInfluencer(data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch influencer:', err);
                setError('Failed to load influencer profile. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchInfluencer();
    }, [influencerId]);

    if (loading) {
        return (
            <View className="flex-1 bg-white justify-center items-center">
                <Text className="text-gray-600">Loading influencer profile...</Text>
            </View>
        );
    }

    if (error || !influencer) {
        return (
            <View className="flex-1 bg-white justify-center items-center px-4">
                <Text className="text-red-600 text-center mb-4">
                    {error || 'Influencer not found'}
                </Text>
                <TouchableOpacity
                    className="bg-indigo-600 px-6 py-3 rounded-lg"
                    onPress={() => {
                        // Retry or go back
                        if (influencerId) {
                            const fetchInfluencer = async () => {
                                try {
                                    setLoading(true);
                                    const data = await InfluencerService.getInfluencerById(influencerId);
                                    setInfluencer(data);
                                    setError(null);
                                } catch (err) {
                                    setError('Failed to load influencer profile. Please try again.');
                                } finally {
                                    setLoading(false);
                                }
                            };
                            fetchInfluencer();
                        }
                    }}
                >
                    <Text className="text-white font-medium">Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Convert the influencer image URL
    const profileImageUrl = convertGoogleDriveUrl(influencer.image);

    return (
        <View className="flex-1 bg-white">
            <ScrollView className="flex-1">
                {/* Header Section */}
                <View className="bg-[#6E44FF] pt-12 pb-6 px-4">
                    <View className="flex-row justify-between items-center mt-6">
                        <Text className="text-2xl font-bold text-white">{influencer.name}</Text>
                    </View>

                    {/* Instagram Username - Clickable */}
                    {influencer.socialName && (
                        <TouchableOpacity
                            onPress={() => SocialMediaUtils.showInstagramOptions(influencer.socialName, influencer.name)}
                            className="flex-row items-center mt-2 bg-white/10 rounded-full px-3 py-2 self-start"
                        >
                            <MessageCircle color="#E1306C" size={16} />
                            <Text className="text-white font-medium ml-2">@{influencer.socialName}</Text>
                            <Text className="text-white/70 text-sm ml-2">• Tap to message</Text>
                        </TouchableOpacity>
                    )}

                    <View className="flex-row items-center mt-2">
                        <Text className="text-white/90 text-base">{influencer.niche}</Text>
                        <View className="flex-row items-center ml-4">
                            <Star size={16} color="#FFD700" />
                            <Text className="text-white ml-1">{influencer.engagement}</Text>
                        </View>
                    </View>
                </View>

                {/* Profile Image Section */}
                <View className="items-center -mt-16 mb-6">
                    <Image
                        source={{ uri: profileImageUrl }}
                        style={{ width: 120, height: 120 }}
                        className="rounded-full border-4 border-white"
                        onError={(error) => {
                            console.log('Profile image load error:', error.nativeEvent.error);
                        }}
                    />
                </View>

                {/* Stats Section */}
                <View className="flex-row justify-around px-4 mb-6">
                    <View className="items-center">
                        <Text className="text-2xl font-bold text-gray-900">{influencer.followers}</Text>
                        <Text className="text-gray-500 text-sm">Followers</Text>
                    </View>
                    <View className="items-center">
                        <Text className="text-2xl font-bold text-gray-900">{influencer.engagement}%</Text>
                        <Text className="text-gray-500 text-sm">Engagement</Text>
                    </View>
                    <View className="items-center">
                        <Text className="text-2xl font-bold text-gray-900">{influencer.location}</Text>
                        <Text className="text-gray-500 text-sm">Location</Text>
                    </View>
                </View>

                {/* Action Buttons */}
                <View className="flex-row justify-center space-x-4 px-4 mb-6">
                    {/* Instagram Profile Button */}
                    {influencer.socialName && (
                        <TouchableOpacity
                            className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl px-6 py-3 flex-row items-center flex-1 mr-2"
                            onPress={() => SocialMediaUtils.openInstagramProfile(influencer.socialName)}
                            style={{ backgroundColor: '#E1306C' }}
                        >
                            <MessageCircle color="white" size={20} />
                            <Text className="text-white font-semibold ml-2">View on Instagram</Text>
                        </TouchableOpacity>
                    )}
                    
                    <TouchableOpacity className="bg-gray-100 rounded-xl px-6 py-3 flex-row items-center">
                        <Heart color="#EF4444" size={20} />
                        <Text className="text-gray-700 font-semibold ml-2">Save</Text>
                    </TouchableOpacity>
                </View>

                {/* Content Metrics */}
                <View className="bg-gray-50 p-4">
                    <Text className="text-lg font-semibold text-gray-800 mb-3">Performance Metrics</Text>
                    <View className="flex-row justify-between">
                        <View className="flex-row items-center">
                            <Heart size={20} color="#FF6B6B" />
                            <Text className="ml-2 text-gray-700">{Math.floor(Math.random() * 5000) + 1000}</Text>
                        </View>
                        <View className="flex-row items-center">
                            <MessageCircle size={20} color="#6E44FF" />
                            <Text className="ml-2 text-gray-700">{Math.floor(Math.random() * 500) + 100}</Text>
                        </View>
                        <View className="flex-row items-center">
                            <Share2 size={20} color="#6C757D" />
                            <Text className="ml-2 text-gray-700">{Math.floor(Math.random() * 200) + 50}</Text>
                        </View>
                    </View>
                </View>

                {/* Content Categories */}
                <View className="p-4">
                    <Text className="text-lg font-semibold text-gray-800 mb-3">Content Categories</Text>
                    <View className="flex-row flex-wrap gap-2">
                        <TouchableOpacity className="bg-[#6E44FF]/10 px-4 py-2 rounded-full">
                            <Text className="text-[#6E44FF]">{influencer.niche}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-[#6E44FF]/10 px-4 py-2 rounded-full">
                            <Text className="text-[#6E44FF]">Social Media</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="bg-[#6E44FF]/10 px-4 py-2 rounded-full"
                        >

                            <Text className="text-[#6E44FF]">Content Creator</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Recent Content */}
                <View className="p-4">
                    <Text className="text-lg font-semibold text-gray-800 mb-3">Recent Content</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="max-h-64"
                    >
                        {[1, 2, 3].map((_, index) => (
                            <View key={index} className="mr-4">
                                <Image
                                    source={{ uri: profileImageUrl }}
                                    style={{ width: imageWidth * 0.7, height: 200 }}
                                    className="rounded-xl"
                                />
                                <View className="absolute bottom-0 left-0 right-0 p-3 bg-black/30 rounded-b-xl">
                                    <Text className="text-white font-medium">{influencer.niche} Content</Text>
                                    <View className="flex-row items-center mt-1">
                                        <Heart size={16} color="#FF6B6B" />
                                        <Text className="text-white ml-1">{Math.floor(Math.random() * 1000) + 500}</Text>
                                        <MessageCircle size={16} color="white" className="ml-4" />
                                        <Text className="text-white ml-1">{Math.floor(Math.random() * 100) + 20}</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Action Buttons */}
                <View className="p-4 flex-row gap-4">
                    <TouchableOpacity className="flex-1 bg-[#6E44FF] py-3 rounded-xl items-center">
                        <Text className="text-white font-semibold">Contact Influencer</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/*<FooterNav />*/}
            {
                Platform.OS === "ios" ? <AppleFooterNav /> : <FooterNav />
            }
        </View>
    );
}
