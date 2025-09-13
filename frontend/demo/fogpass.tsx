import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { ArrowLeft, Mail } from 'lucide-react-native';

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState('');
    const [step, setStep] = useState(1); // 1: Enter email, 2: Check email, 3: Reset success
    const [isLoading, setIsLoading] = useState(false);

    const handleResetPassword = () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email address');
            return;
        }

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setStep(2);
        }, 1500);
    };

    const handleBackToLogin = () => {
        // In a real app, this would navigate back to login
        Alert.alert('Navigation', 'This would navigate back to login screen');
    };

    return (
        <ScrollView className="flex-1 bg-[#F7F7FF]">
            <View className="flex-1 p-4">
                {/* Header with back button */}
                {step !== 3 && (
                    <View className="flex-row items-center mb-8 mt-2">
                        <TouchableOpacity
                            onPress={() => step === 1 ? handleBackToLogin() : setStep(step - 1)}
                            className="p-2"
                        >
                            <ArrowLeft size={24} color="#6E44FF" />
                        </TouchableOpacity>
                    </View>
                )}

                <View className="flex-1 justify-center">
                    {/* Step 1: Enter Email */}
                    {step === 1 && (
                        <View className="items-center">
                            <View className="bg-[#6E44FF] p-4 rounded-full mb-6">
                                <Mail size={32} color="white" />
                            </View>

                            <Text className="text-2xl font-bold text-[#2C2C2C] mb-2 text-center">
                                Forgot Password?
                            </Text>
                            <Text className="text-[#6C757D] text-center mb-8 text-base">
                                Enter your email address and we&#39;ll send you a link to reset your password
                            </Text>

                            <View className="w-full mb-6">
                                <Text className="text-[#2C2C2C] font-medium mb-2">
                                    Email Address
                                </Text>
                                <TextInput
                                    className="bg-white border border-[#E0E0E0] rounded-xl px-4 py-3 text-[#2C2C2C]"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            <TouchableOpacity
                                className={`bg-[#6E44FF] rounded-xl py-3 w-full items-center ${isLoading ? 'opacity-70' : ''}`}
                                onPress={handleResetPassword}
                                disabled={isLoading}
                            >
                                <Text className="text-white font-bold text-base">
                                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Step 2: Check Email */}
                    {step === 2 && (
                        <View className="items-center">
                            <View className="bg-[#6E44FF] p-4 rounded-full mb-6">
                                <Mail size={32} color="white" />
                            </View>

                            <Text className="text-2xl font-bold text-[#2C2C2C] mb-2 text-center">
                                Check Your Email
                            </Text>
                            <Text className="text-[#6C757D] text-center mb-8 text-base">
                                We&#39;ve sent a password reset link to{'\n'}
                                <Text className="font-bold">{email}</Text>
                            </Text>

                            <View className="w-full mb-6">
                                <Text className="text-[#2C2C2C] text-center mb-4">
                                    Didn&#39;t receive the email? Check your spam folder or
                                </Text>

                                <TouchableOpacity
                                    className="bg-white border border-[#6E44FF] rounded-xl py-3 items-center mb-4"
                                    onPress={handleResetPassword}
                                >
                                    <Text className="text-[#6E44FF] font-bold text-base">
                                        Resend Email
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                className="bg-[#6E44FF] rounded-xl py-3 w-full items-center"
                                onPress={() => setStep(3)}
                            >
                                <Text className="text-white font-bold text-base">
                                    Continue to Login
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Step 3: Reset Success */}
                    {step === 3 && (
                        <View className="items-center">
                            <View className="bg-[#6E44FF] p-4 rounded-full mb-6">
                                <Mail size={32} color="white" />
                            </View>

                            <Text className="text-2xl font-bold text-[#2C2C2C] mb-2 text-center">
                                Password Reset Successful!
                            </Text>
                            <Text className="text-[#6C757D] text-center mb-8 text-base">
                                Your password has been successfully reset. You can now login with your new password.
                            </Text>

                            <TouchableOpacity
                                className="bg-[#6E44FF] rounded-xl py-3 w-full items-center"
                                onPress={handleBackToLogin}
                            >
                                <Text className="text-white font-bold text-base">
                                    Back to Login
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
    );
}
