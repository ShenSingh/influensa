import React, {useEffect} from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Star, Heart, MapPin, Users, MessageCircle } from 'lucide-react-native';
import { convertGoogleDriveUrl } from '../utils/googleDriveUtils';
import SocialMediaUtils from '../utils/socialMediaUtils';

interface InfluencerCardProps {
  influencer: {
    id: string;
    name: string;
    socialName?: string; // Added Instagram username
    niche: string;
    followers: string;
    engagement: number;
    location: string;
    image: string;
    verified: boolean;
  };
  onPress?: () => void;
  onHeartPress?: () => void;
}

const InfluencerCard = ({ influencer, onPress, onHeartPress }: InfluencerCardProps) => {

  const handleInstagramPress = () => {
    if (influencer.socialName) {
      SocialMediaUtils.showInstagramOptions(influencer.socialName, influencer.name);
    }
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl shadow-sm p-4 mb-4 flex-row"
      onPress={onPress}
    >
      <Image
        source={{ uri: influencer.image }}
        className="w-16 h-16 rounded-full"
        onError={(error) => {
          console.log('Image load error:', error.nativeEvent.error);
        }}
      />
      <View className="ml-4 flex-1">
        <View className="flex-row items-center">
          <Text className="font-bold text-gray-900 text-lg">{influencer.name}</Text>
          {influencer.verified && (
            <View className="ml-2 bg-blue-100 rounded-full p-1">
              <Star color="#3B82F6" fill="#3B82F6" size={12} />
            </View>
          )}
        </View>

        {/* Instagram Username - Clickable */}
        {influencer.socialName && (
          <TouchableOpacity onPress={handleInstagramPress} className="flex-row items-center mt-1">
            <MessageCircle color="#E1306C" size={14} />
            <Text className="text-pink-600 text-sm ml-1 font-medium">@{influencer.socialName}</Text>
          </TouchableOpacity>
        )}

        <Text className="text-indigo-600 text-sm mt-1">{influencer.niche}</Text>
        <View className="flex-row items-center mt-2">
          <MapPin color="#9CA3AF" size={14} />
          <Text className="text-gray-500 text-xs ml-1">{influencer.location}</Text>
        </View>
        <View className="flex-row justify-between mt-3">
          <View className="flex-row items-center">
            <Users color="#9CA3AF" size={14} />
            <Text className="text-gray-500 text-xs ml-1">{influencer.followers} followers</Text>
          </View>
          <TouchableOpacity onPress={onHeartPress} className="p-1">
            <Heart color="#EF4444" size={16} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default InfluencerCard;
