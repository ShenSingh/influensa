import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Alert, Animated, Linking, StyleSheet} from 'react-native';

import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  useDrawerStatus,
} from '@react-navigation/drawer';

import Screens from './Screens';
import {Block, Text, Switch, Button, Image} from '../components';
import {useData, useTheme} from '../hooks';

const Drawer = createDrawerNavigator();

/* drawer menu screens navigation */
const ScreensStack = () => {
  const {colors} = useTheme();
  const isDrawerOpen = useDrawerStatus() === 'open';
  const animation = useRef(new Animated.Value(0)).current;

  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.88],
  });

  const borderRadius = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 16],
  });

  const animatedStyle = {
    borderRadius: borderRadius,
    transform: [{scale: scale}],
  };

  useEffect(() => {
    Animated.timing(animation, {
      duration: 200,
      useNativeDriver: true,
      toValue: isDrawerOpen ? 1 : 0,
    }).start();
  }, [isDrawerOpen, animation]);

  return (
    <Animated.View
      style={StyleSheet.flatten([
        animatedStyle,
        {
          flex: 1,
          overflow: 'hidden',
          borderColor: colors.card,
          borderWidth: isDrawerOpen ? 1 : 0,
        },
      ])}>
      {/*  */}
      <Screens />
    </Animated.View>
  );
};

/* custom drawer menu */
const DrawerContent = (
  props: DrawerContentComponentProps,
) => {
  const {navigation} = props;
  const [active, setActive] = useState('Home');
  const {assets, colors, gradients, sizes} = useTheme();
  const labelColor = colors.text;

  const handleNavigation = useCallback(
    (to: string) => {
      setActive(to);
      // Properly navigate to screens in the stack
      navigation.navigate('Screens', { screen: to });
    },
    [navigation, setActive],
  );

  const handleWebLink = useCallback((url: string) => Linking.openURL(url), []);

  // screen list for Drawer menu
  const screens = [
    {name: 'Home', to: 'Home', icon: assets.home},
    {name: 'Profile', to: 'Profile', icon: assets.profile},
    {name: 'Influencer', to: 'Influencer', icon: assets.basket},
    {name: 'Business', to: 'Business', icon: assets.articles},

    // {name: 'Components', to: 'Components', icon: assets.components},
    // {name: 'Articles', to: 'Articles', icon: assets.document},
    // {name: 'Register', to: 'Register', icon: assets.register},
  ];

  return (
    <DrawerContentScrollView
      {...props}
      scrollEnabled
      removeClippedSubviews
      renderToHardwareTextureAndroid
      contentContainerStyle={{paddingBottom: sizes.padding}}>
      <Block paddingHorizontal={sizes.padding}>
        <Block flex={0} row align="center" marginBottom={sizes.l}>
          <Image
            radius={0}
            width={33}
            height={33}
            color={colors.text}
            source={assets.logo}
            marginRight={sizes.sm}
          />
          <Block>
            <Text size={12} semibold>
              App Name
            </Text>
            <Text size={12} semibold>
              Native
            </Text>
          </Block>
        </Block>

        {screens?.map((screen, index) => {
          const isActive = active === screen.to;
          return (
            <Button
              row
              justify="flex-start"
              marginBottom={sizes.s}
              key={`menu-screen-${screen.name}-${index}`}
              onPress={() => handleNavigation(screen.to)}>
              <Block
                flex={0}
                radius={6}
                align="center"
                justify="center"
                width={sizes.md}
                height={sizes.md}
                marginRight={sizes.s}
                gradient={gradients[isActive ? 'primary' : 'white']}>
                <Image
                  radius={0}
                  width={14}
                  height={14}
                  source={screen.icon}
                  color={colors[isActive ? 'white' : 'black']}
                />
              </Block>
              <Text p semibold={isActive} color={labelColor}>
                {screen.name}
              </Text>
            </Button>
          );
        })}

        <Block
          flex={0}
          height={1}
          marginRight={sizes.md}
          marginVertical={sizes.sm}
          gradient={gradients.menu}
        />

        {/* Styled Sign Out Button */}
        <Block marginTop={sizes.md}>
          <Button
            row
            justify="center"
            align="center"
            radius={sizes.buttonRadius}
            gradient={gradients.danger}
            shadow={false}
            onPress={() => {
              Alert.alert(
                'Sign Out',
                'Are you sure you want to sign out?',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: () => {
                      // Add your sign out logic here
                      console.log('User signed out');
                      // navigation.navigate('Login'); // Example navigation
                    },
                  },
                ],
                { cancelable: true }
              );
            }}
          >
            <Text color={colors.white} semibold>
              Sign Out
            </Text>
          </Button>
        </Block>

        {/* Developer Credit Section */}
        <Block
          align="center"
          marginTop={sizes.l}
          marginBottom={5}
        >
          <Text semibold opacity={0.5} marginBottom={sizes.xs}>
            Developed by
          </Text>
          <Button
            onPress={() => handleWebLink('https://github.com/ShenSingh')}
            paddingVertical={sizes.xs}
            paddingHorizontal={sizes.s}
          >
            <Text
              semibold
              color={colors.primary}
              transform="none"
            >
              ShenSingh
            </Text>
          </Button>
        </Block>
      </Block>
    </DrawerContentScrollView>
  );
};

/* drawer menu navigation */
export default () => {

  return (
    <Block >
      <Drawer.Navigator
        screenOptions={{
          drawerStyle: {
            flex: 1,
            width: '60%',
            borderRightWidth: 0,
            backgroundColor: 'transparent',
          },
          drawerType: 'slide',
          overlayColor: 'transparent',
        }}
        drawerContent={(props) => <DrawerContent {...props} />}>
        <Drawer.Screen
          name="Screens"
          component={ScreensStack}
          options={{
            headerShown: false
          }}
        />
      </Drawer.Navigator>
    </Block>
  );
};
