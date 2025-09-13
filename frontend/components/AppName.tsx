import { useFonts } from "expo-font";
import { Text, View, ActivityIndicator } from "react-native";

type AppNameProps = {
    fontSize?: number;
    color?: string;
    style?: object;
};

export const AppName = ({
                            fontSize = 32,
                            color = "#6E44FF",
                            style = {},
                        }: AppNameProps) => {
    const [fontsLoaded] = useFonts({
        "MuseoModerno-Medium": require("../assets/fonts/MuseoModerno-Medium.ttf"),
    });

    if (!fontsLoaded) {
        return <ActivityIndicator />;
    }

    return (
        <View>
            <Text
                style={[
                    {
                        fontFamily: "MuseoModerno-Medium",
                        fontSize,
                        fontWeight: "bold",
                        color,
                        marginBottom: 8,
                    },
                    style,
                ]}
            >
                Influenza
            </Text>
        </View>
    );
};
