import React, {useEffect, useState} from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Search, Filter, User } from 'lucide-react-native';
import { router } from "expo-router";
import FooterNav from "@/components/FooterNav";
import {TopInfluencers} from "@/components/TopInfluencers";
import {RecentMatchesInfluencers} from "@/components/RecentMatchesInfluencers";
import {AppName} from "@/components/AppName";
import AppleFooterNav from "@/components/AppleFooterNav";
import {Business} from "@/types/Business";
import BusinessService from "@/services/business.service";
import {RecommendationResult} from "@/app/(dashboard)/matchInfluencerScreen";
import {getRecommendInfluencer} from "@/services/match-ai.service";
import {Influencer} from "@/types/Influencer";
import InfluencerService from "@/services/influencer.service";
import {HomeBusinessProfileCard} from "@/components/HomeBusinessProfileCard";
import WhatsAppButton from "@/components/WhatsAppButton";

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([]);
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [topInfluencers, setTopInfluencers] = useState<Influencer[]>([]);




  useEffect(() => {
    loadBusinessDetails()
    fetchInfluencers()
  }, []);


  // Helper function to convert follower string to number
  const parseFollowerCount = (followerStr: string): number => {
    if (typeof followerStr !== 'string') return 0;

    const cleanStr = followerStr.replace(/,/g, '').toUpperCase();

    if (cleanStr.includes('K')) {
      return parseFloat(cleanStr.replace('K', '')) * 1000;
    } else if (cleanStr.includes('M')) {
      return parseFloat(cleanStr.replace('M', '')) * 1000000;
    } else if (cleanStr.includes('B')) {
      return parseFloat(cleanStr.replace('B', '')) * 1000000000;
    }

    return parseFloat(cleanStr) || 0;
  };

  const fetchInfluencers = async () => {
    try {
      const data = await InfluencerService.getAllInfluencers();
      setInfluencers(data);

      // Sort influencers by followers count in descending order and take top 5
      const sortedByFollowers = [...data].sort((a, b) =>
          parseFollowerCount(b.followers) - parseFollowerCount(a.followers)
      );
      setTopInfluencers(sortedByFollowers.slice(0, 5));

    } catch (err) {
      console.error('Failed to fetch influencers:', err);
    }
  };

  useEffect(() => {
    if (businesses.length > 0) {
      loadmatchInfluencers();
    }
  }, [businesses]);

  const loadmatchInfluencers = async () => {
    try{
      if (businesses.length > 0){
        const results = await getRecommendInfluencer(businesses[0].description);

        // Ensure results is an array before setting state
        if (Array.isArray(results)) {
          // Take only top 5 recommendations
          setRecommendations(results.slice(0, 5));
        } else {
          console.error('API did not return an array:', results);
          setRecommendations([]);
        }
      } else {
        setRecommendations([]);
      }
    } catch (e) {
      console.error('Error loading match influencers:', e);
      setRecommendations([]);
    }
  }

  const loadBusinessDetails = async () => {
    try {
      const response = await BusinessService.getUserBusinesses();
      // Backend now returns an array, so we can use it directly
      setBusinesses(response || []);

    }catch (e) {
      setBusinesses([]);
      console.log(e)
    }
  }

  return (
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="bg-indigo-600 px-4 pt-12 pb-4 rounded-b-3xl">
          <View className="flex-row items-center justify-between mt-10">
            <AppName fontSize={32} color="#fff" />
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
          <TopInfluencers top5Influencers={topInfluencers} />

          {/* Recent Matches Section */}
          <RecentMatchesInfluencers recommendations={recommendations} />
          {/* Home Business Profile Card*/}
          <HomeBusinessProfileCard businessDetails = {businesses[0]} />
        </ScrollView>

        {/* WhatsApp Floating Action Button */}
        <WhatsAppButton
          phoneNumber="+14155238886"
          message="Hi! I'm interested in connecting with influencers through your platform."
        />

        {/*<FooterNav />*/}
        {
          Platform.OS === "ios" ? <AppleFooterNav /> : <FooterNav />
        }
      </View>
  );
};

export default HomeScreen;
