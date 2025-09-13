import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Save, Building, Users, Target, Phone, Mail } from 'lucide-react-native';

export default function UserBusinessScreen() {
    const [businessName, setBusinessName] = useState('');
    const [industry, setIndustry] = useState('');
    const [description, setDescription] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const handleSave = () => {
        if (!businessName.trim()) {
            Alert.alert('Error', 'Please enter your business name');
            return;
        }

        // In a real app, this would save to a backend
        Alert.alert(
            'Success',
            'Business details saved successfully!',
            [
                { text: 'OK' }
            ]
        );
    };

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-indigo-600 p-6 rounded-b-3xl">
                <Text className="text-2xl font-bold text-white mt-8">Business Profile</Text>
                <Text className="text-indigo-100 mt-2">Manage your business information</Text>
            </View>

            <ScrollView className="flex-1 p-4">
                <View className="bg-white rounded-2xl p-5 shadow-sm">
                    <Text className="text-lg font-semibold text-gray-800 mb-4">Business Information</Text>

                    <View className="mb-5">
                        <View className="flex-row items-center mb-2">
                            <Building size={18} color="#4f46e5" />
                            <Text className="ml-2 text-gray-700 font-medium">Business Name</Text>
                        </View>
                        <TextInput
                            className="border border-gray-200 rounded-xl p-4 text-base"
                            placeholder="Enter your business name"
                            value={businessName}
                            onChangeText={setBusinessName}
                        />
                    </View>

                    <View className="mb-5">
                        <View className="flex-row items-center mb-2">
                            <Target size={18} color="#4f46e5" />
                            <Text className="ml-2 text-gray-700 font-medium">Industry</Text>
                        </View>
                        <TextInput
                            className="border border-gray-200 rounded-xl p-4 text-base"
                            placeholder="e.g., Technology, Fashion, Food..."
                            value={industry}
                            onChangeText={setIndustry}
                        />
                    </View>

                    <View className="mb-5">
                        <View className="flex-row items-center mb-2">
                            <Building size={18} color="#4f46e5" />
                            <Text className="ml-2 text-gray-700 font-medium">Description</Text>
                        </View>
                        <TextInput
                            className="border border-gray-200 rounded-xl p-4 text-base h-24"
                            placeholder="Describe your business..."
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            textAlignVertical="top"
                        />
                    </View>

                    <View className="mb-5">
                        <View className="flex-row items-center mb-2">
                            <Users size={18} color="#4f46e5" />
                            <Text className="ml-2 text-gray-700 font-medium">Target Audience</Text>
                        </View>
                        <TextInput
                            className="border border-gray-200 rounded-xl p-4 text-base"
                            placeholder="Describe your target audience"
                            value={targetAudience}
                            onChangeText={setTargetAudience}
                        />
                    </View>

                    <Text className="text-lg font-semibold text-gray-800 mb-4 mt-6">Contact Information</Text>

                    <View className="mb-5">
                        <View className="flex-row items-center mb-2">
                            <Mail size={18} color="#4f46e5" />
                            <Text className="ml-2 text-gray-700 font-medium">Email</Text>
                        </View>
                        <TextInput
                            className="border border-gray-200 rounded-xl p-4 text-base"
                            placeholder="business@example.com"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                        />
                    </View>

                    <View className="mb-5">
                        <View className="flex-row items-center mb-2">
                            <Phone size={18} color="#4f46e5" />
                            <Text className="ml-2 text-gray-700 font-medium">Phone</Text>
                        </View>
                        <TextInput
                            className="border border-gray-200 rounded-xl p-4 text-base"
                            placeholder="+1 (555) 123-4567"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View className="mb-5">
                        <View className="flex-row items-center mb-2">
                            <Building size={18} color="#4f46e5" />
                            <Text className="ml-2 text-gray-700 font-medium">Additional Info</Text>
                        </View>
                        <TextInput
                            className="border border-gray-200 rounded-xl p-4 text-base"
                            placeholder="Address, website, or other details"
                            value={contactInfo}
                            onChangeText={setContactInfo}
                        />
                    </View>

                    <TouchableOpacity
                        className="bg-indigo-600 rounded-xl p-4 flex-row items-center justify-center mt-4"
                        onPress={handleSave}
                    >
                        <Save color="white" size={20} className="mr-2" />
                        <Text className="text-white font-semibold text-base">Save Business Details</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
