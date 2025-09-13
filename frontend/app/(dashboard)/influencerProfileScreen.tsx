import React from 'react';
import {View, Text, Image, ScrollView, TouchableOpacity, Dimensions, Platform} from 'react-native';
import { Star, Users, Heart, MessageCircle, Share2, Bookmark, Home, User, Search, Briefcase } from 'lucide-react-native';
import FooterNav from "@/components/FooterNav";
import AppleFooterNav from "@/components/AppleFooterNav";

const { width } = Dimensions.get('window');
const imageWidth = width;

export default function InfluencerProfileScreen() {
    // Mock data for the influencer profile
    const influencer = {
        name: "Alex Morgan",
        category: "Fashion & Lifestyle",
        rating: 4.8,
        followers: "1.2M",
        engagement: "5.2%",
        bio: "Creating authentic lifestyle content | Fashion enthusiast | Brand collaborator",
        stats: {
            posts: 847,
            followers: "1.2M",
            following: 385,
        },
        metrics: {
            likes: "2.4K",
            comments: 342,
            shares: 156,
        }
    };

    return (
        <View className="flex-1 bg-white">
            <ScrollView className="flex-1">
                {/* Header Section */}
                <View className="bg-[#6E44FF] pt-12 pb-6 px-4">
                    <View className="flex-row justify-between items-center mt-6">
                        <Text className="text-2xl font-bold text-white">{influencer.name}</Text>

                    </View>
                    <View className="flex-row items-center mt-2">
                        <Text className="text-white/90 text-base">{influencer.category}</Text>
                        <View className="flex-row items-center ml-4">
                            <Star size={16} color="#FFD700" />
                            <Text className="text-white ml-1">{influencer.rating}</Text>
                        </View>
                    </View>
                </View>

                {/* Profile Info Section */}
                <View className="px-4 -mt-6">
                    <View className="bg-white rounded-xl shadow-lg p-4 mb-4">
                        <View className="flex-row">
                            <Image
                                source={{ uri: "https://images.unsplash.com/photo-1613759612065-d5971d32ca49?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0" }}
                                className="w-24 h-24 rounded-xl"
                            />
                            <View className="flex-1 ml-4">
                                <Text className="text-gray-600 mb-2">{influencer.bio}</Text>
                                <View className="flex-row items-center">
                                    <Users size={16} color="#6E44FF" />
                                    <Text className="ml-1 text-gray-700">{influencer.followers} followers</Text>
                                    <View className="bg-[#6E44FF]/10 px-2 py-1 rounded-full ml-3">
                                        <Text className="text-[#6E44FF] font-medium">{influencer.engagement} Engagement</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Stats Section */}
                <View className="flex-row justify-between px-4 py-4">
                    <View className="items-center flex-1">
                        <Text className="text-xl font-bold text-gray-800">{influencer.stats.posts}</Text>
                        <Text className="text-gray-600">Posts</Text>
                    </View>
                    <View className="items-center flex-1">
                        <Text className="text-xl font-bold text-gray-800">{influencer.stats.followers}</Text>
                        <Text className="text-gray-600">Followers</Text>
                    </View>
                    <View className="items-center flex-1">
                        <Text className="text-xl font-bold text-gray-800">{influencer.stats.following}</Text>
                        <Text className="text-gray-600">Following</Text>
                    </View>
                </View>

                {/* Content Metrics */}
                <View className="bg-gray-50 p-4">
                    <Text className="text-lg font-semibold text-gray-800 mb-3">Performance Metrics</Text>
                    <View className="flex-row justify-between">
                        <View className="flex-row items-center">
                            <Heart size={20} color="#FF6B6B" />
                            <Text className="ml-2 text-gray-700">{influencer.metrics.likes}</Text>
                        </View>
                        <View className="flex-row items-center">
                            <MessageCircle size={20} color="#6E44FF" />
                            <Text className="ml-2 text-gray-700">{influencer.metrics.comments}</Text>
                        </View>
                        <View className="flex-row items-center">
                            <Share2 size={20} color="#6C757D" />
                            <Text className="ml-2 text-gray-700">{influencer.metrics.shares}</Text>
                        </View>
                    </View>
                </View>

                {/* Content Categories */}
                <View className="p-4">
                    <Text className="text-lg font-semibold text-gray-800 mb-3">Content Categories</Text>
                    <View className="flex-row flex-wrap gap-2">
                        <TouchableOpacity className="bg-[#6E44FF]/10 px-4 py-2 rounded-full">
                            <Text className="text-[#6E44FF]">Fashion</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-[#6E44FF]/10 px-4 py-2 rounded-full">
                            <Text className="text-[#6E44FF]">Lifestyle</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-[#6E44FF]/10 px-4 py-2 rounded-full">
                            <Text className="text-[#6E44FF]">Beauty</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-[#6E44FF]/10 px-4 py-2 rounded-full">
                            <Text className="text-[#6E44FF]">Travel</Text>
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
                                    source={{ uri: "https://images.unsplash.com/photo-1613759612065-d5971d32ca49?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0" }}
                                    style={{ width: imageWidth * 0.7, height: 200 }}
                                    className="rounded-xl"
                                />
                                <View className="absolute bottom-0 left-0 right-0 p-3 bg-black/30 rounded-b-xl">
                                    <Text className="text-white font-medium">Summer Collection 2024</Text>
                                    <View className="flex-row items-center mt-1">
                                        <Heart size={16} color="#FF6B6B" />
                                        <Text className="text-white ml-1">2.4K</Text>
                                        <MessageCircle size={16} color="white" className="ml-4" />
                                        <Text className="text-white ml-1">342</Text>
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

