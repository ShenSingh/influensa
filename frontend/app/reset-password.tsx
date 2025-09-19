import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AppName } from '@/components/AppName';
import UserService from '@/services/user.service';

export default function ResetPasswordScreen() {
    const { token } = useLocalSearchParams<{ token: string }>();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
    const [resetComplete, setResetComplete] = useState(false);

    useEffect(() => {
        // Validate token on component mount
        if (!token) {
            setIsTokenValid(false);
            Alert.alert('Invalid Link', 'No reset token provided. Please use the link from your email.');
        } else {
            setIsTokenValid(true);
        }
    }, [token]);

    const handleResetPassword = async () => {
        // Validation
        if (!newPassword.trim()) {
            Alert.alert('Error', 'Please enter a new password');
            return;
        }
        if (newPassword.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters long');
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        try {
            setLoading(true);

            // Call the reset password service method
            await UserService.resetPassword({
                token: token,
                newPassword: newPassword.trim(),
            });

            setResetComplete(true);

            // Platform-specific success handling
            if (Platform.OS === 'web') {
                console.log("web")
                // For web, use simple browser alert and then navigate
                alert('Success! Your password has been reset successfully. You can now login with your new password.');
                // Navigate to login after user dismisses the alert
                router.replace('/(auth)/signInScreen');
            } else {
                // For mobile platforms, show native alert
                Alert.alert(
                    'Success!',
                    'Your password has been reset successfully. You can now login with your new password.',
                    [
                        {
                            text: 'Go to Login',
                            onPress: () => router.replace('/(auth)/signInScreen')
                        }
                    ]
                );
            }
        } catch (error: any) {
            console.error('Error resetting password:', error);
            // Platform-specific error handling
            const errorMessage = error?.response?.data?.message || 'Failed to reset password. The link may have expired.';

            if (Platform.OS === 'web') {
                alert(errorMessage);
            } else {
                Alert.alert('Error', errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    if (isTokenValid === false) {
        return (
            <View className="flex-1 bg-gray-50 justify-center items-center px-4">
                <View className="bg-white rounded-2xl p-8 w-full max-w-md shadow-sm">
                    <View className="items-center mb-6">
                        <View className="bg-red-100 rounded-full p-4 mb-4">
                            <Lock size={32} color="#ef4444" />
                        </View>
                        <Text className="text-xl font-bold text-gray-900 mb-2">Invalid Reset Link</Text>
                        <Text className="text-gray-600 text-center">
                            This password reset link is invalid or has expired. Please request a new password reset.
                        </Text>
                    </View>

                    <TouchableOpacity
                        className="bg-indigo-600 rounded-xl p-4 mb-3"
                        onPress={() => router.replace('/(auth)/signInScreen')}
                    >
                        <Text className="text-white font-semibold text-base text-center">Back to Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    if (resetComplete) {
        return (
            <View className="flex-1 bg-gray-50 justify-center items-center px-4">
                <View className="bg-white rounded-2xl p-8 w-full max-w-md shadow-sm">
                    <View className="items-center mb-6">
                        <View className="bg-green-100 rounded-full p-4 mb-4">
                            <CheckCircle size={32} color="#10b981" />
                        </View>
                        <Text className="text-xl font-bold text-gray-900 mb-2">Password Reset Complete!</Text>
                        <Text className="text-gray-600 text-center">
                            Your password has been successfully updated. You can now login with your new password.
                        </Text>
                    </View>

                    <TouchableOpacity
                        className="bg-indigo-600 rounded-xl p-4"
                        onPress={() => router.replace('/(auth)/signInScreen')}
                    >
                        <Text className="text-white font-semibold text-base text-center">Go to Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-indigo-600 rounded-b-3xl">
                <View className="flex-row items-center justify-center mt-10">
                    <AppName fontSize={32} color="#fff" />
                </View>
                <Text className="text-2xl font-bold text-white mt-8 text-center">Reset Your Password</Text>
                <Text className="text-indigo-100 mt-2 text-center">Enter your new password below</Text>
            </View>

            <ScrollView className="flex-1 px-4 py-6">
                <View className="bg-white rounded-2xl p-6 shadow-sm">
                    <Text className="text-gray-600 mb-6 text-center">
                        Please enter your new password. Make sure it&#39;s at least 6 characters long and secure.
                    </Text>

                    {/* New Password */}
                    <View className="mb-5">
                        <View className="flex-row items-center mb-2">
                            <Lock size={18} color="#4f46e5" />
                            <Text className="ml-2 text-gray-700 font-medium">New Password *</Text>
                        </View>
                        <View className="flex-row items-center border border-gray-200 rounded-xl">
                            <TextInput
                                className="flex-1 p-4 text-base"
                                placeholder="Enter your new password"
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry={!showNewPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                className="p-4"
                                onPress={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? (
                                    <EyeOff size={20} color="#6b7280" />
                                ) : (
                                    <Eye size={20} color="#6b7280" />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Confirm Password */}
                    <View className="mb-6">
                        <View className="flex-row items-center mb-2">
                            <Lock size={18} color="#4f46e5" />
                            <Text className="ml-2 text-gray-700 font-medium">Confirm Password *</Text>
                        </View>
                        <View className="flex-row items-center border border-gray-200 rounded-xl">
                            <TextInput
                                className="flex-1 p-4 text-base"
                                placeholder="Confirm your new password"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirmPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                className="p-4"
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff size={20} color="#6b7280" />
                                ) : (
                                    <Eye size={20} color="#6b7280" />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Password Requirements */}
                    <View className="bg-gray-50 rounded-xl p-4 mb-6">
                        <Text className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</Text>
                        <Text className="text-sm text-gray-600">• At least 6 characters long</Text>
                        <Text className="text-sm text-gray-600">• Contains both letters and numbers (recommended)</Text>
                        <Text className="text-sm text-gray-600">• Avoid using common passwords</Text>
                    </View>

                    {/* Reset Button */}
                    <TouchableOpacity
                        className={`rounded-xl p-4 flex-row items-center justify-center ${
                            loading ? 'bg-gray-400' : 'bg-indigo-600'
                        }`}
                        onPress={handleResetPassword}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" size="small" />
                        ) : (
                            <>
                                <Lock color="white" size={20} />
                                <Text className="text-white font-semibold text-base ml-2">
                                    Reset Password
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>

                    {/* Back to Login */}
                    <TouchableOpacity
                        className="mt-4 p-4"
                        onPress={() => router.replace('/(auth)/signInScreen')}
                    >
                        <Text className="text-indigo-600 font-medium text-center">
                            Back to Login
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
