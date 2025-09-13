import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { Briefcase, Home, Search, User } from "lucide-react-native";
const AppleFooterNav = () => {
    const router = useRouter();
    const segments = useSegments();
    const activeRoute = "/" + (segments[segments.length - 1] || "");

    return (
            <BlurView intensity={70} tint="light" style={styles.glassNav}>
                <View style={styles.row}>
                    {tabs.map((tab) => {
                        const isActive = activeRoute === tab.path;
                        const IconComponent = tab.icon;
                        return (
                            <TouchableOpacity
                                key={tab.path}
                                style={styles.tab}
                                onPress={() => router.push(tab.path as any)}
                                activeOpacity={0.7}
                            >
                                <IconComponent
                                    size={24}
                                    color={isActive ? "#6E44FF" : "#6C757D"}
                                />
                                <Text style={[styles.label, isActive && styles.activeLabel]}>
                                    {tab.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </BlurView>
        );
};

import { useRouter, useSegments } from "expo-router";

const tabs = [
    { label: "Home", path: "/homeScreen", icon: Home },
    { label: "Influencer", path: "/influencerScreen", icon: User },
    { label: "Match", path: "/matchInfluencerScreen", icon: Search },
    { label: "Business", path: "/userBusinessScreen", icon: Briefcase }
] as const;

const styles = StyleSheet.create({
    glassNav: {
        position: "absolute",
        left: 9,
        right: 9,
        bottom: 24,
        borderRadius: 50,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 8,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 8,
    },
    tab: {
        alignItems: "center",
        flex: 1,
    },
    label: {
        fontSize: 12,
        marginTop: 4,
        color: "#6C757D",
    },
    activeLabel: {
        color: "#6E44FF",
        fontWeight: "bold",
    },
});

export default AppleFooterNav;
