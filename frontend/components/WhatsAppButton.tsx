import React from 'react';
import { TouchableOpacity, Linking, Alert, Platform } from 'react-native';
import { MessageCircle } from 'lucide-react-native';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber = '+14155238886',
  message = 'Hi! I\'m interested in connecting with influencers through your platform.'
}) => {

  const openWhatsApp = async () => {
    try {
      // Format phone number (remove spaces, dashes, and non-numeric characters except +)
      const formattedNumber = phoneNumber.replace(/[^\d+]/g, '');

      // Encode the message for URL
      const encodedMessage = encodeURIComponent(message);

      // WhatsApp URL scheme
      const whatsappUrl = `whatsapp://send?phone=${formattedNumber}&text=${encodedMessage}`;

      // Check if WhatsApp is installed
      const supported = await Linking.canOpenURL(whatsappUrl);

      if (supported) {
        await Linking.openURL(whatsappUrl);
      } else {
        // If WhatsApp is not installed, show alert with options
        Alert.alert(
          'WhatsApp not found',
          'WhatsApp is not installed on your device. Would you like to install it?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Install',
              onPress: () => {
                // Open app store/play store
                const storeUrl = Platform.OS === 'ios'
                  ? 'https://apps.apple.com/app/whatsapp-messenger/id310633997'
                  : 'https://play.google.com/store/apps/details?id=com.whatsapp';
                Linking.openURL(storeUrl);
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      Alert.alert('Error', 'Failed to open WhatsApp. Please try again.');
    }
  };

  return (
    <TouchableOpacity
      onPress={openWhatsApp}
      className="absolute bottom-28 right-6 bg-green-500 rounded-full p-4 shadow-lg"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      <MessageCircle color="white" size={28} />
    </TouchableOpacity>
  );
};

export default WhatsAppButton;
