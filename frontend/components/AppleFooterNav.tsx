// components/FooterNav.tsx

import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native"
import React from "react"
import { useRouter, useSegments } from "expo-router"
import { BlurView } from "expo-blur"
import { LinearGradient } from "expo-linear-gradient"
import { Briefcase, Home, Search, User } from "lucide-react-native"

const tabs = [
    { label: "Home", path: "/homeScreen", icon: Home },
    { label: "Influencer", path: "/influencerScreen", icon: User },
    { label: "Match", path: "/matchInfluencerScreen", icon: Search },
    { label: "Business", path: "/userBusinessScreen", icon: Briefcase },
] as const

// Define our active and inactive colors
const ACTIVE_COLOR = "#FFFFFF"
const INACTIVE_COLOR = "rgba(255, 255, 255, 0.6)"

const FooterNav = () => {
    const router = useRouter()
    const segments = useSegments()
    const activeRoute = "/" + (segments[segments.length - 1] || "")

    return (
        // The outer View floats the component at the bottom of the screen.
        // This is crucial for the blur effect to work on the content underneath.
        <View style={styles.container}>
            <BlurView
                intensity={80}
                tint="dark"
                style={styles.blurView}
            >
                {/* The gradient creates the "sheen" or "liquid" highlight effect */}
                <LinearGradient
                    colors={["rgba(255, 255, 255, 0.15)", "rgba(255, 255, 255, 0.05)"]}
                    style={styles.gradient}
                />
                <View style={styles.innerContainer}>
                    {tabs.map((tab) => {
                        const isActive = activeRoute === tab.path
                        const IconComponent = tab.icon
                        const color = isActive ? ACTIVE_COLOR : INACTIVE_COLOR

                        return (
                            <TouchableOpacity
                                key={tab.path}
                                style={styles.tab}
                                onPress={() => router.push(tab.path as any)}
                            >
                                <IconComponent size={24} color={color} />
                                <Text style={[styles.tabText, { color }]}>{tab.label}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </BlurView>
        </View>
    )
}

// Using StyleSheet for better organization and performance
const styles = StyleSheet.create({
    container: {
        position: "absolute", // Makes the nav bar float over the screen content
        bottom: 20,
        left: 20,
        right: 20,
        borderRadius: 30,
        overflow: "hidden", // Ensures the blur and gradient respect the border radius
        // Add a subtle shadow for a "lifting" effect
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    blurView: {
        width: "100%",
        height: "100%",
    },
    gradient: {
        ...StyleSheet.absoluteFillObject, // Makes the gradient fill the entire BlurView
    },
    innerContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingVertical: 12,
    },
    tab: {
        alignItems: "center",
        gap: 2, // Space between icon and text
    },
    tabText: {
        fontSize: 11,
        fontWeight: "500",
    },
})

export default FooterNav
