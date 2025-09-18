import React, { useState, useEffect } from 'react';
import {View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Platform, ActivityIndicator, Modal, Image} from 'react-native';
import { Save, User, Mail, Lock, Camera, Edit3, Eye, EyeOff, LogOut } from 'lucide-react-native';
import FooterNav from "@/components/FooterNav";
import {AppName} from "@/components/AppName";
import AppleFooterNav from "@/components/AppleFooterNav";
import UserService, { UpdateUserRequest, ChangePasswordRequest } from '@/services/user.service';
import { GetUser } from '@/types/User';
import { router } from 'expo-router';

export default function UserScreen() {
    const [user, setUser] = useState<GetUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);

    // Edit Profile Modal State
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editUserName, setEditUserName] = useState('');
    const [editEmail, setEditEmail] = useState('');

    // Change Password Modal State
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Forgot Password Modal State
    const [forgotPasswordModalVisible, setForgotPasswordModalVisible] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

    // Default profile image
    const defaultProfileImage = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D';

    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        try {
            setLoading(true);
            const userProfile = await UserService.getUserProfile();
            setUser(userProfile);
        } catch (error) {
            console.error('Error loading user profile:', error);
            Alert.alert('Error', 'Failed to load user profile');
        } finally {
            setLoading(false);
        }
    };

    const openEditModal = () => {
        if (user) {
            setEditUserName(user.userName);
            setEditEmail(user.email);
            setEditModalVisible(true);
        }
    };

    const handleUpdateProfile = async () => {
        if (!editUserName.trim()) {
            Alert.alert('Error', 'Please enter your username');
            return;
        }
        if (!editEmail.trim()) {
            Alert.alert('Error', 'Please enter your email');
            return;
        }

        try {
            setSaving(true);
            const updateData: UpdateUserRequest = {
                userName: editUserName.trim(),
                email: editEmail.trim(),
            };

            const updatedUser = await UserService.updateProfile(updateData);
            setUser(updatedUser);
            setEditModalVisible(false);
            Alert.alert('Success', 'Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('Error', 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (!currentPassword.trim()) {
            Alert.alert('Error', 'Please enter your current password');
            return;
        }
        if (!newPassword.trim()) {
            Alert.alert('Error', 'Please enter a new password');
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New passwords do not match');
            return;
        }
        if (newPassword.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters long');
            return;
        }

        try {
            setSaving(true);
            const passwordData: ChangePasswordRequest = {
                currentPassword: currentPassword.trim(),
                newPassword: newPassword.trim(),
            };

            await UserService.changePassword(passwordData);
            setPasswordModalVisible(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            Alert.alert('Success', 'Password changed successfully!');
        } catch (error: any) {
            console.error('Error changing password:', error);
            
            // Extract the specific error message from the backend
            let errorMessage = 'Failed to change password. Please try again.';
            
            if (error.response?.data?.message) {
                // Backend sent a specific error message
                errorMessage = error.response.data.message;
            } else if (error.message) {
                // Axios error message
                errorMessage = error.message;
            }
            
            Alert.alert('Error', errorMessage);
        } finally {
            setSaving(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!forgotPasswordEmail.trim()) {
            Alert.alert('Error', 'Please enter your email address');
            return;
        }

        try {
            setSaving(true);
            await UserService.forgotPassword(forgotPasswordEmail.trim());
            setForgotPasswordModalVisible(false);
            setForgotPasswordEmail('');
            Alert.alert('Success', 'Password reset email sent! Please check your inbox.');
        } catch (error) {
            console.error('Error sending forgot password email:', error);
            Alert.alert('Error', 'Failed to send reset email. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: () => {
                        // Navigate to login screen
                        router.replace('/(auth)/signInScreen');
                    },
                },
            ]
        );
    };

    if (loading) {
        return (
            <View className="flex-1 bg-gray-50 justify-center items-center">
                <ActivityIndicator size="large" color="#4f46e5" />
                <Text className="text-gray-500 mt-2">Loading profile...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-indigo-600 p-6 pt-12 rounded-b-3xl">
                <View className="flex-row items-center justify-between mt-10">
                    <AppName fontSize={32} color="#fff" />
                    <TouchableOpacity onPress={handleLogout} className="p-2">
                        <LogOut size={24} color="white" />
                    </TouchableOpacity>
                </View>
                <Text className="text-2xl font-bold text-white mt-8">My Profile</Text>
                <Text className="text-indigo-100 mt-2">Manage your account settings</Text>
            </View>

            <ScrollView className="flex-1 p-4">
                {/* Profile Card */}
                <View className="bg-white rounded-2xl p-6 shadow-sm mb-4">
                    {/* Profile Image */}
                    <View className="items-center mb-6">
                        <View className="relative">
                            <Image
                                source={{
                                    uri: defaultProfileImage
                                }}
                                className="w-24 h-24 rounded-full"
                            />
                            <TouchableOpacity
                                className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-2"
                                onPress={() => Alert.alert('Coming Soon', 'Profile image upload will be available soon!')}
                            >
                                <Camera size={16} color="white" />
                            </TouchableOpacity>
                        </View>
                        <Text className="text-xl font-bold text-gray-900 mt-3">{user?.userName}</Text>
                        <Text className="text-gray-600">{user?.email}</Text>
                    </View>

                    {/* Profile Actions */}
                    <TouchableOpacity
                        className="bg-indigo-600 rounded-xl p-4 flex-row items-center justify-center mb-3"
                        onPress={openEditModal}
                    >
                        <Edit3 color="white" size={20} />
                        <Text className="text-white font-semibold text-base ml-2">Edit Profile</Text>
                    </TouchableOpacity>
                </View>

                {/* Account Settings */}
                <View className="bg-white rounded-2xl p-6 shadow-sm mb-4">
                    <Text className="text-lg font-bold text-gray-900 mb-4">Account Settings</Text>

                    <TouchableOpacity
                        className="flex-row items-center py-4 border-b border-gray-100"
                        onPress={() => setPasswordModalVisible(true)}
                    >
                        <Lock color="#6b7280" size={20} />
                        <Text className="text-gray-700 font-medium ml-3 flex-1">Change Password</Text>
                        <Text className="text-gray-400">{">"}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-row items-center py-4"
                        onPress={() => setForgotPasswordModalVisible(true)}
                    >
                        <Mail color="#6b7280" size={20} />
                        <Text className="text-gray-700 font-medium ml-3 flex-1">Forgot Password</Text>
                        <Text className="text-gray-400">{">"}</Text>
                    </TouchableOpacity>
                </View>

                {/* Account Info */}
                <View className="bg-white rounded-2xl p-6 shadow-sm">
                    <Text className="text-lg font-bold text-gray-900 mb-4">Account Information</Text>

                    <View className="flex-row items-center py-3">
                        <User color="#6b7280" size={20} />
                        <View className="ml-3 flex-1">
                            <Text className="text-gray-500 text-sm">Username</Text>
                            <Text className="text-gray-900 font-medium">{user?.userName}</Text>
                        </View>
                    </View>

                    <View className="flex-row items-center py-3">
                        <Mail color="#6b7280" size={20} />
                        <View className="ml-3 flex-1">
                            <Text className="text-gray-500 text-sm">Email</Text>
                            <Text className="text-gray-900 font-medium">{user?.email}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Edit Profile Modal */}
            <Modal
                visible={editModalVisible}
                animationType="slide"
                presentationStyle="formSheet"
                onRequestClose={() => setEditModalVisible(false)}
            >
                <View className="flex-1 bg-gray-50">
                    <View className="bg-indigo-600 p-6 pt-12">
                        <View className="flex-row items-center justify-between mt-10">
                            <Text className="text-2xl font-bold text-white">Edit Profile</Text>
                            <TouchableOpacity
                                className="bg-white bg-opacity-20 rounded-full px-4 py-2"
                                onPress={() => setEditModalVisible(false)}
                            >
                                <Text className="text-white font-medium">Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView className="flex-1 p-4">
                        <View className="bg-white rounded-2xl p-5 shadow-sm">
                            <View className="mb-5">
                                <View className="flex-row items-center mb-2">
                                    <User size={18} color="#4f46e5" />
                                    <Text className="ml-2 text-gray-700 font-medium">Username *</Text>
                                </View>
                                <TextInput
                                    className="border border-gray-200 rounded-xl p-4 text-base"
                                    placeholder="Enter your username"
                                    value={editUserName}
                                    onChangeText={setEditUserName}
                                />
                            </View>

                            <View className="mb-5">
                                <View className="flex-row items-center mb-2">
                                    <Mail size={18} color="#4f46e5" />
                                    <Text className="ml-2 text-gray-700 font-medium">Email *</Text>
                                </View>
                                <TextInput
                                    className="border border-gray-200 rounded-xl p-4 text-base"
                                    placeholder="Enter your email"
                                    value={editEmail}
                                    onChangeText={setEditEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            <TouchableOpacity
                                className="bg-indigo-600 rounded-xl p-4 flex-row items-center justify-center mt-4"
                                onPress={handleUpdateProfile}
                                disabled={saving}
                            >
                                {saving ? (
                                    <ActivityIndicator color="white" size="small" />
                                ) : (
                                    <>
                                        <Save color="white" size={20} />
                                        <Text className="text-white font-semibold text-base ml-2">Save Changes</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </Modal>

            {/* Change Password Modal */}
            <Modal
                visible={passwordModalVisible}
                animationType="slide"
                presentationStyle="formSheet"
                onRequestClose={() => setPasswordModalVisible(false)}
            >
                <View className="flex-1 bg-gray-50">
                    <View className="bg-indigo-600 p-6 pt-12">
                        <View className="flex-row items-center justify-between mt-10">
                            <Text className="text-2xl font-bold text-white">Change Password</Text>
                            <TouchableOpacity
                                className="bg-white bg-opacity-20 rounded-full px-4 py-2"
                                onPress={() => setPasswordModalVisible(false)}
                            >
                                <Text className="text-white font-medium">Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView className="flex-1 p-4">
                        <View className="bg-white rounded-2xl p-5 shadow-sm">
                            {/* Current Password */}
                            <View className="mb-5">
                                <View className="flex-row items-center mb-2">
                                    <Lock size={18} color="#4f46e5" />
                                    <Text className="ml-2 text-gray-700 font-medium">Current Password *</Text>
                                </View>
                                <View className="flex-row items-center border border-gray-200 rounded-xl">
                                    <TextInput
                                        className="flex-1 p-4 text-base"
                                        placeholder="Enter current password"
                                        value={currentPassword}
                                        onChangeText={setCurrentPassword}
                                        secureTextEntry={!showCurrentPassword}
                                    />
                                    <TouchableOpacity
                                        className="p-4"
                                        onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                                    >
                                        {showCurrentPassword ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* New Password */}
                            <View className="mb-5">
                                <View className="flex-row items-center mb-2">
                                    <Lock size={18} color="#4f46e5" />
                                    <Text className="ml-2 text-gray-700 font-medium">New Password *</Text>
                                </View>
                                <View className="flex-row items-center border border-gray-200 rounded-xl">
                                    <TextInput
                                        className="flex-1 p-4 text-base"
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChangeText={setNewPassword}
                                        secureTextEntry={!showNewPassword}
                                    />
                                    <TouchableOpacity
                                        className="p-4"
                                        onPress={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Confirm Password */}
                            <View className="mb-5">
                                <View className="flex-row items-center mb-2">
                                    <Lock size={18} color="#4f46e5" />
                                    <Text className="ml-2 text-gray-700 font-medium">Confirm New Password *</Text>
                                </View>
                                <View className="flex-row items-center border border-gray-200 rounded-xl">
                                    <TextInput
                                        className="flex-1 p-4 text-base"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry={!showConfirmPassword}
                                    />
                                    <TouchableOpacity
                                        className="p-4"
                                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TouchableOpacity
                                className="bg-indigo-600 rounded-xl p-4 flex-row items-center justify-center mt-4"
                                onPress={handleChangePassword}
                                disabled={saving}
                            >
                                {saving ? (
                                    <ActivityIndicator color="white" size="small" />
                                ) : (
                                    <>
                                        <Lock color="white" size={20} />
                                        <Text className="text-white font-semibold text-base ml-2">Change Password</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </Modal>

            {/* Forgot Password Modal */}
            <Modal
                visible={forgotPasswordModalVisible}
                animationType="slide"
                presentationStyle="formSheet"
                onRequestClose={() => setForgotPasswordModalVisible(false)}
            >
                <View className="flex-1 bg-gray-50">
                    <View className="bg-indigo-600 p-6 pt-12">
                        <View className="flex-row items-center justify-between mt-10">
                            <Text className="text-2xl font-bold text-white">Reset Password</Text>
                            <TouchableOpacity
                                className="bg-white bg-opacity-20 rounded-full px-4 py-2"
                                onPress={() => setForgotPasswordModalVisible(false)}
                            >
                                <Text className="text-white font-medium">Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView className="flex-1 p-4">
                        <View className="bg-white rounded-2xl p-5 shadow-sm">
                            <Text className="text-gray-600 mb-6 text-center">
                                Enter your email address and we&#39;ll send you a link to reset your password.
                            </Text>

                            <View className="mb-5">
                                <View className="flex-row items-center mb-2">
                                    <Mail size={18} color="#4f46e5" />
                                    <Text className="ml-2 text-gray-700 font-medium">Email Address *</Text>
                                </View>
                                <TextInput
                                    className="border border-gray-200 rounded-xl p-4 text-base"
                                    placeholder="Enter your email"
                                    value={forgotPasswordEmail}
                                    onChangeText={setForgotPasswordEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            <TouchableOpacity
                                className="bg-indigo-600 rounded-xl p-4 flex-row items-center justify-center mt-4"
                                onPress={handleForgotPassword}
                                disabled={saving}
                            >
                                {saving ? (
                                    <ActivityIndicator color="white" size="small" />
                                ) : (
                                    <>
                                        <Mail color="white" size={20} />
                                        <Text className="text-white font-semibold text-base ml-2">Send Reset Email</Text>
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
