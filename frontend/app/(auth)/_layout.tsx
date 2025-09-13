import React from "react"
import { Stack } from "expo-router"

const AuthLayout = () => {
  return (
    <Stack
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    >
      <Stack.Screen name="welcomeScreen" options={{ title: "Welcome" }} />
      <Stack.Screen name="signInScreen" options={{ title: "Sign In" }} />
      <Stack.Screen name="signUpScreen" options={{ title: "Sign Up" }} />
    </Stack>
  )
}

export default AuthLayout
