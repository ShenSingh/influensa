import React, {useCallback, useEffect, useState} from 'react';
import {Platform, Linking} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import {useTheme} from '../hooks';
import * as regex from '../constants/regex';
import {Block, Button, Input, Image, Text, Checkbox} from '../components';

const isAndroid = Platform.OS === 'android';

interface IRegistration {
  name: string;
  email: string;
  password: string;
  agreed: boolean;
}
interface IRegistrationValidation {
  name: boolean;
  email: boolean;
  password: boolean;
  agreed: boolean;
}

const Register = () => {
  const navigation = useNavigation();
  const [isValid, setIsValid] = useState<IRegistrationValidation>({
    name: false,
    email: false,
    password: false,
    agreed: false,
  });
  const [registration, setRegistration] = useState<IRegistration>({
    name: '',
    email: '',
    password: '',
    agreed: false,
  });
  const {assets, colors, gradients, sizes} = useTheme();

  const handleChange = useCallback(
    (value: any) => {
      setRegistration((state) => ({...state, ...value}));
    },
    [setRegistration],
  );

  const handleSignUp = useCallback(() => {
    if (!Object.values(isValid).includes(false)) {
      /** send/save registratin data */
      console.log('handleSignUp', registration);
    }
  }, [isValid, registration]);

  useEffect(() => {
    setIsValid((state) => ({
      ...state,
      name: regex.name.test(registration.name),
      email: regex.email.test(registration.email),
      password: regex.password.test(registration.password),
      agreed: registration.agreed,
    }));
  }, [registration, setIsValid]);

  return (
    <Block safe marginTop={sizes.md}>
      <Block paddingHorizontal={sizes.s}>
        <Block flex={0} style={{zIndex: 0}}>
          <Image
            background
            resizeMode="cover"
            padding={sizes.sm}
            radius={sizes.cardRadius}
            source={assets.background}
            height={sizes.height * 0.3}>
            <Button
              row
              flex={0}
              justify="flex-start"
              onPress={() => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                } else {
                  navigation.navigate('Screens', { screen: 'Home' });
                }
              }}>
              <Image
                radius={0}
                width={10}
                height={18}
                color={colors.white}
                source={assets.arrow}
                transform={[{rotate: '180deg'}]}
              />
              <Text p white marginLeft={sizes.s}>
                Go Back
              </Text>
            </Button>

            <Text
              p
              semibold
              center
              color={colors.white}
              paddingTop={sizes.xl}
              size={sizes.m}
              style={{
                fontFamily: 'OpenSans-ExtraBold',
                letterSpacing: 1,
                textTransform: 'uppercase',
                fontSize: 30,
                fontWeight: 'bold',
              }}
            >
              INFLUENZA
            </Text>
          </Image>
        </Block>
        {/* register form */}
        <Block
          keyboard
          behavior={!isAndroid ? 'padding' : 'height'}
          marginTop={-(sizes.height * 0.2 - sizes.l)}>
          <Block
            flex={0}
            radius={sizes.sm}
            marginHorizontal="8%"
            shadow={!isAndroid}
          >
            <Block
              blur
              flex={0}
              intensity={90}
              radius={sizes.sm}
              overflow="hidden"
              justify="space-evenly"
              tint={colors.blurTint}
              paddingVertical={sizes.sm}>
              <Text
                  style={{
                    color: '#FFFFFF',
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    fontSize: 24,
                    textAlign: 'center',
                    marginTop:sizes.m
                  }}>
                Sign Up
              </Text>
              <Block
                row
                flex={0}
                align="center"
                justify="center"
                marginBottom={sizes.xxl}
                paddingHorizontal={sizes.xxl}>

              </Block>
              {/* form inputs */}
              <Block paddingHorizontal={sizes.sm}>
                <Input
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label="Name"
                  placeholder="Enter your name"
                  success={Boolean(registration.name && isValid.name)}
                  danger={Boolean(registration.name && !isValid.name)}
                  onChangeText={(value) => handleChange({name: value})}
                />
                <Input
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label="Email"
                  keyboardType="email-address"
                  placeholder="Enter your email"
                  success={Boolean(registration.email && isValid.email)}
                  danger={Boolean(registration.email && !isValid.email)}
                  onChangeText={(value) => handleChange({email: value})}
                />
                <Input
                  secureTextEntry
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label="Password"
                  placeholder="Enter your password"
                  onChangeText={(value) => handleChange({password: value})}
                  success={Boolean(registration.password && isValid.password)}
                  danger={Boolean(registration.password && !isValid.password)}
                />
              </Block>
              {/* checkbox terms */}
              <Block row flex={0} align="center" paddingHorizontal={sizes.sm}>
                <Checkbox
                  marginRight={sizes.sm}
                  checked={registration?.agreed}
                  onPress={(value) => handleChange({agreed: value})}
                />
                <Text paddingRight={sizes.s}>
                  I agree to the{' '}
                  <Text
                    semibold
                    onPress={() => {
                      Linking.openURL('https://www.creative-tim.com/terms');
                    }}>
                    Terms & Conditions
                  </Text>
                </Text>
              </Block>
              <Button
                onPress={handleSignUp}
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                gradient={gradients.primary}
                disabled={Object.values(isValid).includes(false)}>
                <Text bold white transform="uppercase">
                  Sign Up
                </Text>
              </Button>
              <Button
                primary
                outlined
                shadow={!isAndroid}
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                onPress={() => navigation.navigate(`Login`)}>
                <Text bold primary transform="uppercase">
                  Sign In
                </Text>
              </Button>
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default Register;
