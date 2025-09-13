import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, SafeAreaView } from 'react-native';
import { Search, Filter, Star, User, Settings, Bell, ChevronRight } from 'lucide-react-native';
import { router } from "expo-router";
import FooterNav from "@/components/FooterNav";
import {TopInfluencers} from "@/components/TopInfluencers";
import {RecentMatchesInfluencers} from "@/components/RecentMatchesInfluencers";

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleInfluencerPress = (influencer: any) => {
    // For now, navigate to influencer profile page instead of bottom sheet
    router.push("/(dashboard)/influencerProfileScreen");
  };

  return (
      <SafeAreaView className="flex-1 bg-white">
        {/* Header */}
        <View className="bg-indigo-600 px-4 pt-12 pb-4">
          <View className="flex-row items-center justify-between mt-10">
            <Text className="text-white text-2xl font-bold">InfluenceConnect</Text>
            <View className="flex-row space-x-4">
              <Bell color="white" size={24} />
              <Settings color="white" size={24} />
            </View>
          </View>

          {/* Search Bar */}
          <View className="mt-4 bg-white rounded-full flex-row items-center px-4 py-3">
            <Search color="#6B7280" size={20} />
            <TextInput
                className="flex-1 ml-2 text-gray-700"
                placeholder="Search influencers..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <Filter color="#6B7280" size={20} />
          </View>
        </View>

        <ScrollView className="flex-1 px-4 py-6">
          {/* Welcome Section */}
          <View className="mb-8">
            <Text className="text-2xl font-bold text-gray-900">Welcome back!</Text>
            <Text className="text-gray-600 mt-1">Find the perfect influencer for your brand</Text>
          </View>

          {/* Top Influencers Section */}
          <TopInfluencers />

          {/* Recent Matches Section */}
          <RecentMatchesInfluencers />

          {/* Business Profile Section */}
          <View className="bg-indigo-50 rounded-xl p-5 mb-8">
            <View className="flex-row justify-between items-start">
              <View>
                <Text className="text-lg font-bold text-gray-900">Your Business Profile</Text>
                <Text className="text-gray-600 mt-1">Complete your profile to get better matches</Text>
              </View>
              <TouchableOpacity onPress={() => router.push("/(dashboard)/userBusinessScreen")}>
                <Text className="text-indigo-600 font-medium">Edit</Text>
              </TouchableOpacity>
            </View>

            <View className="mt-4 flex-row items-center">
              <View className="bg-indigo-100 rounded-full p-3">
                <User color="#4F46E5" size={24} />
              </View>
              <View className="ml-4">
                <Text className="font-bold text-gray-900">TechGadgets Inc.</Text>
                <Text className="text-gray-600 text-sm">Electronics & Gadgets</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <FooterNav />
      </SafeAreaView>
  );
};

export default HomeScreen;
