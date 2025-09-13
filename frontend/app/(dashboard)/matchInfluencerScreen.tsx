import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { Search, User, Star, MapPin, DollarSign } from 'lucide-react-native';

export default function MatchInfluencerScreen() {
    const [businessDetails, setBusinessDetails] = useState('');
    const [loading, setLoading] = useState(false);
    const [influencers, setInfluencers] = useState<any[]>([]);

    // Mock influencer data
    const mockInfluencers = [
        {
            id: 1,
            name: "Alex Morgan",
            category: "Fitness & Wellness",
            location: "New York, USA",
            rate: "$500 - $1000",
            followers: "125K",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D"
        },
        {
            id: 2,
            name: "Jordan Smith",
            category: "Technology & Gaming",
            location: "San Francisco, USA",
            rate: "$750 - $1500",
            followers: "89K",
            avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fHVzZXJ8ZW58MHx8MHx8fDA%3D"
        },
        {
            id: 3,
            name: "Taylor Kim",
            category: "Fashion & Lifestyle",
            location: "Los Angeles, USA",
            rate: "$1000 - $2500",
            followers: "245K",
            avatar: "https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTN8fHVzZXJ8ZW58MHx8MHx8fDA%3D"
        },
        {
            id: 4,
            name: "Casey Johnson",
            category: "Food & Cooking",
            location: "Chicago, USA",
            rate: "$300 - $800",
            followers: "98K",
            avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fHVzZXJ8ZW58MHx8MHx8fDA%3D"
        }
    ];

    const handleMatchInfluencers = () => {
        if (businessDetails.trim() === '') return;

        setLoading(true);

        // Simulate API call delay
        setTimeout(() => {
            setInfluencers(mockInfluencers);
            setLoading(false);
        }, 1500);
    };

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-indigo-600 p-6 rounded-b-3xl">
                <Text className="text-2xl font-bold text-white mt-8">AI Influencer Match</Text>
                <Text className="text-indigo-100 mt-2">Describe your business to find perfect influencer matches</Text>
            </View>

            <ScrollView className="flex-1 p-4">
                {/* Input Section */}
                <View className="bg-white rounded-2xl p-5 shadow-sm mb-6">
                    <Text className="text-lg font-semibold text-gray-800 mb-3">Business Details</Text>
                    <TextInput
                        className="border border-gray-200 rounded-xl p-4 h-32 text-base mb-4"
                        placeholder="Describe your business, target audience, and what you're looking for in an influencer..."
                        value={businessDetails}
                        onChangeText={setBusinessDetails}
                        multiline
                        textAlignVertical="top"
                    />
                    <TouchableOpacity
                        className="bg-indigo-600 rounded-xl p-4 flex-row items-center justify-center"
                        onPress={handleMatchInfluencers}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <Search color="white" size={20} className="mr-2" />
                                <Text className="text-white font-semibold text-base">Find Influencers</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Results Section */}
                {influencers.length > 0 && (
                    <View className="mb-6">
                        <Text className="text-xl font-bold text-gray-800 mb-4">Recommended Influencers</Text>
                        <Text className="text-gray-600 mb-4">Based on your business details, these influencers are a great match:</Text>

                        <View className="gap-4">
                            {influencers.map((influencer) => (
                                <View key={influencer.id} className="bg-white rounded-2xl p-4 flex-row shadow-sm">
                                    <Image
                                        source={{ uri: influencer.avatar }}
                                        className="w-16 h-16 rounded-full"
                                    />
                                    <View className="flex-1 ml-4">
                                        <Text className="font-bold text-lg text-gray-800">{influencer.name}</Text>
                                        <Text className="text-indigo-600 font-medium">{influencer.category}</Text>

                                        <View className="flex-row items-center mt-2">
                                            <MapPin size={14} color="#6b7280" />
                                            <Text className="text-gray-600 text-sm ml-1">{influencer.location}</Text>
                                        </View>

                                        <View className="flex-row items-center mt-1">
                                            <DollarSign size={14} color="#6b7280" />
                                            <Text className="text-gray-600 text-sm ml-1">{influencer.rate}</Text>
                                        </View>

                                        <View className="flex-row items-center mt-1">
                                            <User size={14} color="#6b7280" />
                                            <Text className="text-gray-600 text-sm ml-1">{influencer.followers} followers</Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Empty State */}
                {influencers.length === 0 && !loading && (
                    <View className="bg-white rounded-2xl p-6 items-center justify-center">
                        <Star size={48} color="#4f46e5" className="mb-4" />
                        <Text className="text-lg font-semibold text-gray-800 text-center">Find Your Perfect Influencer Match</Text>
                        <Text className="text-gray-600 text-center mt-2">
                            Describe your business and target audience to get AI-powered influencer recommendations
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
