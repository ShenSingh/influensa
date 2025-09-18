import { Linking, Alert } from 'react-native';

export class SocialMediaUtils {
  /**
   * Opens Instagram app and navigates to a specific user's profile
   * @param username - Instagram username (without @)
   */
  static async openInstagramProfile(username: string): Promise<void> {
    const cleanUsername = username.replace('@', '');
    const instagramUrl = `instagram://user?username=${cleanUsername}`;
    const webUrl = `https://www.instagram.com/${cleanUsername}/`;

    try {
      const canOpen = await Linking.canOpenURL(instagramUrl);
      if (canOpen) {
        await Linking.openURL(instagramUrl);
      } else {
        // If Instagram app is not installed, open in browser
        await Linking.openURL(webUrl);
      }
    } catch (error) {
      console.error('Error opening Instagram:', error);
      Alert.alert('Error', 'Could not open Instagram. Please try again.');
    }
  }

  /**
   * Opens Instagram direct message to a specific user (opens user's chat screen)
   * @param username - Instagram username (without @)
   */
  static async openInstagramDM(username: string): Promise<void> {
    const cleanUsername = username.replace('@', '');

    // Updated Instagram deep links for direct chat
    const instagramChatUrl = `instagram://user?username=${cleanUsername}`;
    const alternativeUrl = `instagram://direct/t/${cleanUsername}`;
    const webUrl = `https://www.instagram.com/direct/t/${cleanUsername}/`;

    try {
      // First try the user profile URL (which allows messaging from profile)
      const canOpenProfile = await Linking.canOpenURL(instagramChatUrl);
      if (canOpenProfile) {
        await Linking.openURL(instagramChatUrl);
        return;
      }

      // Try alternative direct chat URL
      const canOpenDirect = await Linking.canOpenURL(alternativeUrl);
      if (canOpenDirect) {
        await Linking.openURL(alternativeUrl);
        return;
      }

      // If Instagram app is not installed, open web version
      await Linking.openURL(webUrl);
    } catch (error) {
      console.error('Error opening Instagram DM:', error);
      Alert.alert('Error', 'Could not open Instagram. Please try again.');
    }
  }

  /**
   * Opens Instagram direct to user's chat screen immediately
   * @param username - Instagram username (without @)
   */
  static async openInstagramDirectChat(username: string): Promise<void> {
    const cleanUsername = username.replace('@', '');

    // Try multiple URL schemes to get to direct chat
    const urls = [
      `instagram://user?username=${cleanUsername}`, // Opens profile with message option
      `instagram://direct/new/?recipients=${cleanUsername}`, // Direct to new message with user
      `instagram://user?username=${cleanUsername}&message=true`, // Profile with message flag
    ];

    const webUrl = `https://www.instagram.com/${cleanUsername}/`;

    try {
      // Try each URL scheme
      for (const url of urls) {
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
          await Linking.openURL(url);
          return;
        }
      }

      // If none work, open web version
      await Linking.openURL(webUrl);
    } catch (error) {
      console.error('Error opening Instagram chat:', error);
      Alert.alert('Error', 'Could not open Instagram. Please try again.');
    }
  }

  /**
   * Shows options to either view profile or send message
   * @param username - Instagram username (without @)
   * @param displayName - Display name for the alert
   */
  static showInstagramOptions(username: string, displayName?: string): void {
    const cleanUsername = username.replace('@', '');
    const name = displayName || cleanUsername;

    Alert.alert(
      'Instagram Actions',
      `What would you like to do with @${cleanUsername}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'View Profile',
          onPress: () => this.openInstagramProfile(cleanUsername),
        },
        {
          text: 'Send Message',
          onPress: () => this.openInstagramDirectChat(cleanUsername),
        },
      ],
      { cancelable: true }
    );
  }
}

export default SocialMediaUtils;
