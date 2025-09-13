import {Image, Text, TouchableOpacity, View} from "react-native";
import {ChevronRight} from "lucide-react-native";
import React from "react";

export const RecentMatchesInfluencers = () => {


    // Mock data for recent matches
    const recentMatches = [
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

    return (
        <View>
            {/* Recent Matches Section */}
            <View className="mb-8">
                <Text className="text-lg font-bold text-gray-900 mb-4">Your Recent Matches</Text>

                <View className="gap-4">
                    {recentMatches.map((match) => (
                        <TouchableOpacity
                            key={match.id}
                            className="bg-white rounded-xl shadow-sm p-4 flex-row items-center"
                        >
                            <Image
                                source={{ uri: match.image }}
                                className="w-16 h-16 rounded-full"
                            />
                            <View className="ml-4 flex-1">
                                <Text className="font-bold text-gray-900">{match.name}</Text>
                                <Text className="text-gray-600 text-sm mt-1">{match.niche}</Text>
                                <View className="flex-row items-center mt-1">
                                    <Text className="text-indigo-600 font-medium">Match: {match.similarity}</Text>
                                </View>
                            </View>
                            <ChevronRight color="#6B7280" size={20} />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    )
}
