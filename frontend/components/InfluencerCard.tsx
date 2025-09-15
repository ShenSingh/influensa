import React, {useEffect} from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Star, Heart, MapPin, Users } from 'lucide-react-native';
import { convertGoogleDriveUrl } from '../utils/googleDriveUtils';

interface InfluencerCardProps {
  influencer: {
    id: string;
    name: string;
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
  // Convert Google Drive URL to proper format
  const imageUrl = convertGoogleDriveUrl(influencer.image);

  console.log('InfluencerCard original URL:', influencer.image);
  console.log('InfluencerCard converted URL:', imageUrl);

  return (

    <TouchableOpacity
      className="bg-white rounded-2xl shadow-sm p-4 mb-4 flex-row"
      onPress={onPress}
    >
      <Image
        source={{ uri: imageUrl }}
        className="w-16 h-16 rounded-full"
        onError={(error) => {
          console.log('Image load error:', error.nativeEvent.error);
        }}
        onLoad={() => {
          console.log('Image loaded successfully:', imageUrl);
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
        <Text className="text-indigo-600 text-sm mt-1">{influencer.niche}</Text>
        <View className="flex-row items-center mt-2">
          <MapPin color="#9CA3AF" size={14} />
          <Text className="text-gray-500 text-xs ml-1">{influencer.location}</Text>
        </View>
        <View className="flex-row justify-between mt-3">
          <View className="flex-row items-center">
            <Users color="#9CA3AF" size={14} />
            <Text className="text-gray-700 text-sm ml-1">{influencer.followers}</Text>
          </View>
          <View className="flex-row items-center">
            <Star color="#FBBF24" fill="#FBBF24" size={14} />
            <Text className="text-gray-700 text-sm ml-1">{influencer.engagement}%</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        className="ml-2"
        onPress={onHeartPress}
      >
        <Heart color="#9CA3AF" size={20} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default InfluencerCard;
