import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { Search, Filter } from 'lucide-react-native';
import { router } from 'expo-router';
import InfluencerCard from '@/components/InfluencerCard';
import FooterNav from '@/components/FooterNav';

// Mock influencer data
const mockInfluencers = [
    {
        id: '1',
        name: 'Alex Morgan',
        niche: 'Fashion & Lifestyle',
        followers: '1.2M',
        engagement: 4.8,
        location: 'New York, USA',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D',
        verified: true,
    },
    {
        id: '2',
        name: 'Jordan Smith',
        niche: 'Tech & Gaming',
        followers: '850K',
        engagement: 5.2,
        location: 'San Francisco, USA',
        image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fHVzZXJ8ZW58MHx8MHx8fDA%3D',
        verified: true,
    },
    {
        id: '3',
        name: 'Taylor Swift',
        niche: 'Music & Entertainment',
        followers: '2.1M',
        engagement: 6.1,
        location: 'Los Angeles, USA',
        image: 'https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTN8fHVzZXJ8ZW58MHx8MHx8fDA%3D',
        verified: true,
    },
    {
        id: '4',
        name: 'Chris Evans',
        niche: 'Fitness & Health',
        followers: '950K',
        engagement: 4.5,
        location: 'Boston, USA',
        image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fHVzZXJ8ZW58MHx8MHx8fDA%3D',
        verified: false,
    },
    {
        id: '5',
        name: 'Emma Watson',
        niche: 'Beauty & Skincare',
        followers: '1.8M',
        engagement: 5.7,
        location: 'London, UK',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D',
        verified: true,
    },
    {
        id: '6',
        name: 'Michael Chen',
        niche: 'Food & Cooking',
        followers: '650K',
        engagement: 4.9,
        location: 'Vancouver, Canada',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fHVzZXJ8ZW58MHx8MHx8fDA%3D',
        verified: false,
    },
    {
        id: '7',
        name: 'Sophia Kim',
        niche: 'Travel & Adventure',
        followers: '1.5M',
        engagement: 5.3,
        location: 'Seoul, South Korea',
        image: 'https://images.unsplash.com/photo-1534528373424-5630fcd0d1f3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDR8fHVzZXJ8ZW58MHx8MHx8fDA%3D',
        verified: true,
    },
    {
        id: '8',
        name: 'David Johnson',
        niche: 'Finance & Investing',
        followers: '720K',
        engagement: 3.8,
        location: 'Chicago, USA',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTd8fHVzZXJ8ZW58MHx8MHx8fDA%3D',
        verified: false,
    },
];

// Filter options
const filterOptions = [
    { id: 'all', name: 'All' },
    { id: 'fashion', name: 'Fashion' },
    { id: 'tech', name: 'Tech' },
    { id: 'beauty', name: 'Beauty' },
    { id: 'fitness', name: 'Fitness' },
    { id: 'travel', name: 'Travel' },
    { id: 'food', name: 'Food' },
];

const InfluencerScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [influencers, setInfluencers] = useState(mockInfluencers);
    const [filteredInfluencers, setFilteredInfluencers] = useState(mockInfluencers);

    // Filter influencers based on search and filter
    useEffect(() => {
        let result = mockInfluencers;

        // Apply search filter
        if (searchQuery) {
            result = result.filter(influencer =>
                influencer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                influencer.niche.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply category filter
        if (selectedFilter !== 'all') {
            result = result.filter(influencer =>
                influencer.niche.toLowerCase().includes(selectedFilter.toLowerCase())
            );
        }

        setFilteredInfluencers(result);
    }, [searchQuery, selectedFilter]);

    // Render an influencer card using the component
    const renderInfluencerCard = ({ item }: { item: typeof mockInfluencers[0] }) => (
        <InfluencerCard
            influencer={item}
            onPress={() => {
                // Navigate to influencer profile page
                router.push('/(dashboard)/influencerProfileScreen');
            }}
            onHeartPress={() => {
                // Handle heart/favorite action
                console.log(`Favorited ${item.name}`);
            }}
        />
    );

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-indigo-600 px-4 pt-12 pb-4">
                <View className="flex-row items-center justify-between mb-4 mt-6">
                    <Text className="text-white text-2xl font-bold">Influencers</Text>
                </View>

                {/* Search Bar */}
                <View className="bg-white rounded-full flex-row items-center px-4 py-3 mb-4">
                    <Search color="#6B7280" size={20} />
                    <TextInput
                        className="flex-1 ml-2 text-gray-700"
                        placeholder="Search influencers..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <TouchableOpacity onPress={() => {}}>
                        <Filter color="#6B7280" size={20} />
                    </TouchableOpacity>
                </View>

                {/* Filter Chips */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="max-h-12"
                >
                    <View className="flex-row gap-2 pb-2">
                        {filterOptions.map((filter) => (
                            <TouchableOpacity
                                key={filter.id}
                                className={`px-4 py-2 rounded-full 
                                ${selectedFilter === filter.id ? 'bg-indigo-100' : 'bg-white'}`}
                                onPress={() => setSelectedFilter(filter.id)}
                            >
                                <Text
                                    className={
                                        `font-medium ${selectedFilter === filter.id ?  
                                            'text-indigo-700' : 'text-gray-700'}`
                                    }
                                >
                                    {filter.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </View>

            {/* Influencer List */}
            <View className="flex-1 px-4 py-6">
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-gray-900 text-lg font-bold">
                        {filteredInfluencers.length} Influencers Found
                    </Text>
                </View>

                <FlatList
                    data={filteredInfluencers}
                    renderItem={renderInfluencerCard}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            </View>

            <FooterNav />
        </View>
    );
};

export default InfluencerScreen;
