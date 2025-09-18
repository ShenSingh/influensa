import React, { useState, useEffect } from 'react';
import {View, Text, ScrollView, TouchableOpacity, TextInput, FlatList, Platform} from 'react-native';
import { Search, Filter } from 'lucide-react-native';
import { router } from 'expo-router';
import InfluencerCard from '@/components/InfluencerCard';
import FooterNav from '@/components/FooterNav';
import {AppName} from "@/components/AppName";
import AppleFooterNav from "@/components/AppleFooterNav";
import InfluencerService from '@/services/influencer.service';
import { Influencer } from '@/types/Influencer';

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
    const [influencers, setInfluencers] = useState<Influencer[]>([]);
    const [filteredInfluencers, setFilteredInfluencers] = useState<Influencer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch influencers from backend
    useEffect(() => {
        const fetchInfluencers = async () => {
            try {
                setLoading(true);
                const data = await InfluencerService.getAllInfluencers();
                setInfluencers(data);
                setFilteredInfluencers(data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch influencers:', err);
                setError('Failed to load influencers. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchInfluencers();
    }, []);

    // Filter influencers based on search and filter
    useEffect(() => {
        let result = influencers;

        // Apply search filter
        if (searchQuery) {
            result = result.filter(influencer =>
                influencer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                influencer.niche.toLowerCase().includes(searchQuery.toLowerCase()) ||
                influencer.socialName.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply category filter
        if (selectedFilter !== 'all') {
            result = result.filter(influencer =>
                influencer.niche.toLowerCase().includes(selectedFilter.toLowerCase())
            );
        }

        setFilteredInfluencers(result);
    }, [searchQuery, selectedFilter, influencers]);

    // Convert backend Influencer to frontend format for InfluencerCard
    const convertInfluencerForCard = (influencer: Influencer) => ({
        id: influencer._id,
        name: influencer.name,
        niche: influencer.niche,
        followers: influencer.followers,
        engagement: influencer.engagement,
        location: influencer.location,
        image: influencer.image,
        verified: influencer.verified,
    });

    // Render an influencer card using the component
    const renderInfluencerCard = ({ item }: { item: Influencer }) => (
        <InfluencerCard
            influencer={convertInfluencerForCard(item)}
            onPress={() => {
                // Navigate to influencer profile page with ID
                router.push({
                    pathname: '/(dashboard)/influencerProfileScreen',
                    params: { influencerId: item._id }
                });
            }}
            onHeartPress={() => {
                // Handle heart/favorite action
                console.log(`Favorited ${item.name}`);
            }}
        />
    );

    if (loading) {
        return (
            <View className="flex-1 bg-white justify-center items-center">
                <Text className="text-gray-600">Loading influencers...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 bg-white justify-center items-center px-4">
                <Text className="text-red-600 text-center mb-4">{error}</Text>
                <TouchableOpacity
                    className="bg-indigo-600 px-6 py-3 rounded-lg"
                    onPress={() => {
                        setError(null);
                        // Retry fetching
                        const fetchInfluencers = async () => {
                            try {
                                setLoading(true);
                                const data = await InfluencerService.getAllInfluencers();
                                setInfluencers(data);
                                setFilteredInfluencers(data);
                                setError(null);
                            } catch (err) {
                                setError('Failed to load influencers. Please try again.');
                            } finally {
                                setLoading(false);
                            }
                        };
                        fetchInfluencers();
                    }}
                >
                    <Text className="text-white font-medium">Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <View className="bg-indigo-600 px-4 pt-12 pb-4 rounded-b-3xl">
                <View className="flex-row items-center justify-between mt-10">
                    <AppName fontSize={32} color="#fff" />
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
                <FlatList
                    data={filteredInfluencers}
                    renderItem={renderInfluencerCard}
                    keyExtractor={(item) => item._id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            </View>

            {/*<FooterNav />*/}
            {
                Platform.OS === "ios" ? <AppleFooterNav /> : <FooterNav />
            }
        </View>
    );
};

export default InfluencerScreen;
