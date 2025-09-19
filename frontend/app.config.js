export default {
  expo: {
    name: "Influenza",
    slug: "Influenza",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/logo/black-logo.png",
    scheme: "influenza",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    linking: {
      prefixes: ["influenza://"],
      config: {
        screens: {
          "reset-password": "reset-password",
          "(auth)/signInScreen": "(auth)/signInScreen"
        }
      }
    },
    splash: {
      image: "./assets/images/logo/black-logo.png",
      resizeMode: "contain",
      backgroundColor: "#6E44FF"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.Influenza.app"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/logo/black-logo.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      package: "com.Influenza.app"
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/logo/black-logo.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image:"./assets/images/logo/black-logo.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#6E44FF"
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      eas: {
        projectId: "923be5ff-b43a-4dbe-83db-35ba061e0f5b"
      }
    }
  }
};
