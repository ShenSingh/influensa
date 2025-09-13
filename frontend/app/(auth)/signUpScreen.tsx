import React, { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react-native";
import { router } from "expo-router";

const SignUpScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSignUp = () => {
    // Handle sign-up logic here
    console.log("onSignUp");
    // For now, navigate to dashboard
    router.replace("/(dashboard)/homeScreen");
  };

  const onSwitchToSignIn = () => {
    router.replace('/(auth)/signInScreen');
  };

  return (
    <View className="flex-1 bg-[#F7F7FF]">
      <ScrollView className="flex-1 px-6 pt-16">
        <View className="items-center mb-10 mt-32">
          <Text className="text-3xl font-bold text-[#6E44FF] mb-2">Create Account</Text>
          <Text className="text-[#6C757D]">Join our influencer community today</Text>
        </View>

        <View className="mb-6 mt-32">
          <Text className="text-[#2C2C2C] font-medium mb-2 ml-2">Full Name</Text>
          <View className="flex-row items-center bg-white rounded-xl px-4 py-3">
            <User color="#6C757D" size={20} className="mr-3" />
            <TextInput
              className="flex-1 text-[#2C2C2C]"
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
            />
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-[#2C2C2C] font-medium mb-2 ml-2">Email</Text>
          <View className="flex-row items-center bg-white rounded-xl px-4 py-3">
            <Mail color="#6C757D" size={20} className="mr-3" />
            <TextInput
              className="flex-1 text-[#2C2C2C]"
              placeholder="Enter your email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-[#2C2C2C] font-medium mb-2 ml-2">Password</Text>
          <View className="flex-row items-center bg-white rounded-xl px-4 py-3">
            <Lock color="#6C757D" size={20} className="mr-3" />
            <TextInput
              className="flex-1 text-[#2C2C2C]"
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff color="#6C757D" size={20} />
              ) : (
                <Eye color="#6C757D" size={20} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          className="bg-[#6E44FF] py-4 rounded-xl mb-6 mt-24 items-center justify-center"
          onPress={onSignUp}
        >
          <Text className="text-white text-lg font-semibold">Sign Up</Text>
        </TouchableOpacity>

        <View className="flex-row items-center justify-center mb-8">
          <Text className="text-[#6C757D]">Already have an account?</Text>
          <TouchableOpacity onPress={onSwitchToSignIn}>
            <Text className="text-[#6E44FF] font-semibold ml-2">Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default SignUpScreen;
