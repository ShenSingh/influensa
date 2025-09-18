import React, { useState, useEffect } from 'react';
import {View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Platform, ActivityIndicator, Modal} from 'react-native';
import { Save, Building, Users, Target, Edit3, Trash2 } from 'lucide-react-native';
import FooterNav from "@/components/FooterNav";
import {AppName} from "@/components/AppName";
import AppleFooterNav from "@/components/AppleFooterNav";
import BusinessService from '@/services/business.service';
import { Business, CreateBusinessRequest } from '@/types/Business';

export default function UserBusinessScreen() {
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
    const [saving, setSaving] = useState(false);

    // Form state
    const [businessName, setBusinessName] = useState('');
    const [businessType, setBusinessType] = useState('');
    const [description, setDescription] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    const [additionalInfo, setAdditionalInfo] = useState('');

    useEffect(() => {
        loadBusinesses();
    }, []);

    const loadBusinesses = async () => {
        try {
            setLoading(true);
            const response = await BusinessService.getUserBusinesses();

            // Backend now returns an array, so we can use it directly
            setBusinesses(response || []);
        } catch (error) {
            console.error('Error loading businesses:', error);
            Alert.alert('Error', 'Failed to load business details');
            // Set empty array on error to prevent map errors
            setBusinesses([]);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setBusinessName('');
        setBusinessType('');
        setDescription('');
        setTargetAudience('');
        setAdditionalInfo('');
        setEditingBusiness(null);
    };

    const openCreateModal = () => {
        resetForm();
        setModalVisible(true);
    };

    const openEditModal = (business: Business) => {
        setEditingBusiness(business);
        setBusinessName(business.businessName);
        setBusinessType(business.businessType);
        setDescription(business.description);
        setTargetAudience(business.targetAudience);
        setAdditionalInfo(business.additionalInfo);
        setModalVisible(true);
    };

    const handleSave = async () => {
        if (!businessName.trim()) {
            Alert.alert('Error', 'Please enter your business name');
            return;
        }
        if (!businessType.trim()) {
            Alert.alert('Error', 'Please enter your business type');
            return;
        }
        if (!description.trim()) {
            Alert.alert('Error', 'Please enter a description');
            return;
        }
        try {
            setSaving(true);
            const businessData: CreateBusinessRequest = {
                businessName: businessName.trim(),
                businessType: businessType.trim(),
                description: description.trim(),
                targetAudience: targetAudience.trim(),
                additionalInfo: additionalInfo.trim(),
            };

            if (editingBusiness) {
                // Update existing business
                await BusinessService.updateBusiness(editingBusiness._id, businessData);
                Alert.alert('Success', 'Business details updated successfully!');
            } else {
                // Create new business
                await BusinessService.createBusiness(businessData);
                Alert.alert('Success', 'Business details saved successfully!');
            }

            setModalVisible(false);
            resetForm();
            await loadBusinesses(); // Reload the list
        } catch (error) {
            console.error('Error saving business:', error);
            Alert.alert('Error', 'Failed to save business details');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = (business: Business) => {
        Alert.alert(
            'Confirm Delete',
            `Are you sure you want to delete "${business.businessName}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await BusinessService.deleteBusiness(business._id);
                            Alert.alert('Success', 'Business deleted successfully!');
                            loadBusinesses();
                        } catch (error) {
                            console.error('Error deleting business:', error);
                            Alert.alert('Error', 'Failed to delete business');
                        }
                    },
                },
            ]
        );
    };

    const BusinessCard = ({ business }: { business: Business }) => (
        <View className="bg-white rounded-2xl p-5 shadow-sm mb-4">
            <View className="flex-row justify-between items-start mb-3">
                <Text className="text-lg font-bold text-gray-800 flex-1">{business.businessName}</Text>
                <View className="flex-row">
                    <TouchableOpacity
                        className="p-2 mr-2"
                        onPress={() => openEditModal(business)}
                    >
                        <Edit3 size={18} color="#4f46e5" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="p-2"
                        onPress={() => handleDelete(business)}
                    >
                        <Trash2 size={18} color="#ef4444" />
                    </TouchableOpacity>
                </View>
            </View>

            <Text className="text-indigo-600 font-medium mb-2">{business.businessType}</Text>
            <Text className="text-gray-600 mb-3">{business.description}</Text>

            {business.targetAudience && (
                <View className="flex-row items-center mb-2">
                    <Users size={14} color="#6b7280" />
                    <Text className="text-gray-600 ml-2">Target: {business.targetAudience}</Text>
                </View>
            )}

            {business.additionalInfo && (
                <Text className="text-gray-500 text-sm mt-2">{business.additionalInfo}</Text>
            )}
        </View>
    );

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-indigo-600 p-6 pt-12 rounded-b-3xl">
                <View className="flex-row items-center justify-between mt-10">
                    <AppName fontSize={32} color="#fff" />
                </View>
                <Text className="text-2xl font-bold text-white mt-8">Business Profile</Text>
                <Text className="text-indigo-100 mt-2">Manage your business information</Text>
            </View>

            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#4f46e5" />
                    <Text className="text-gray-500 mt-2">Loading businesses...</Text>
                </View>
            ) : (
                <ScrollView className="flex-1 p-4">
                    {businesses.length === 0 ? (
                        <View className="bg-white rounded-2xl p-8 items-center">
                            <Building size={48} color="#d1d5db" />
                            <Text className="text-gray-500 text-lg mt-4 mb-2">No businesses yet</Text>
                            <Text className="text-gray-400 text-center mb-6">
                                Create your first business profile to get started
                            </Text>
                            <TouchableOpacity
                                className="bg-indigo-600 rounded-xl px-6 py-3"
                                onPress={openCreateModal}
                            >
                                <Text className="text-white font-semibold">Create Business</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        businesses.map((business) => (
                            <BusinessCard key={business._id} business={business} />
                        ))
                    )}
                </ScrollView>
            )}

            {/* Create/Edit Modal */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                presentationStyle="formSheet"
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 bg-gray-50">
                    <View className="bg-indigo-600 p-6 pt-12">
                        <View className="flex-row items-center justify-between mt-10">
                            <Text className="text-2xl font-bold text-white">
                                {editingBusiness ? 'Edit Business' : 'New Business'}
                            </Text>
                            <TouchableOpacity
                                className="bg-white bg-opacity-20 rounded-full px-4 py-2"
                                onPress={() => setModalVisible(false)}
                            >
                                <Text className="text-white font-medium">Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView className="flex-1 p-4">
                        <View className="bg-white rounded-2xl p-5 shadow-sm">
                            <View className="mb-5">
                                <View className="flex-row items-center mb-2">
                                    <Building size={18} color="#4f46e5" />
                                    <Text className="ml-2 text-gray-700 font-medium">Business Name *</Text>
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
                                    <Text className="ml-2 text-gray-700 font-medium">Business Type *</Text>
                                </View>
                                <TextInput
                                    className="border border-gray-200 rounded-xl p-4 text-base"
                                    placeholder="e.g., Technology, Fashion, Food..."
                                    value={businessType}
                                    onChangeText={setBusinessType}
                                />
                            </View>

                            <View className="mb-5">
                                <View className="flex-row items-center mb-2">
                                    <Building size={18} color="#4f46e5" />
                                    <Text className="ml-2 text-gray-700 font-medium">Description *</Text>
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

                            <View className="mb-5">
                                <View className="flex-row items-center mb-2">
                                    <Building size={18} color="#4f46e5" />
                                    <Text className="ml-2 text-gray-700 font-medium">Additional Info</Text>
                                </View>
                                <TextInput
                                    className="border border-gray-200 rounded-xl p-4 text-base"
                                    placeholder="Address, website, or other details"
                                    value={additionalInfo}
                                    onChangeText={setAdditionalInfo}
                                />
                            </View>

                            <TouchableOpacity
                                className="bg-indigo-600 rounded-xl p-4 flex-row items-center justify-center mt-4"
                                onPress={handleSave}
                                disabled={saving}
                            >
                                {saving ? (
                                    <ActivityIndicator color="white" size="small" />
                                ) : (
                                    <>
                                        <Save color="white" size={20} className="mr-2" />
                                        <Text className="text-white font-semibold text-base ml-2">
                                            {editingBusiness ? 'Update Business' : 'Save Business'}
                                        </Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </Modal>

            {Platform.OS === "ios" ? <AppleFooterNav /> : <FooterNav />}
        </View>
    );
}
