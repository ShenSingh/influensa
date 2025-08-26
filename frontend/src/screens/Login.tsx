import React, {useCallback, useEffect, useState} from 'react';
import {Platform, Text as RNText} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import {useTheme} from '../hooks';
import * as regex from '../constants/regex';
import {Block, Button, Input, Image, Text} from '../components';

const isAndroid = Platform.OS === 'android';

interface ILogin {
  email: string;
  password: string;
}
interface ILoginValidation {
  email: boolean;
  password: boolean;
}

const Login = () => {
  const navigation = useNavigation();
  const [isValid, setIsValid] = useState<ILoginValidation>({
    email: false,
    password: false,
  });
  const [login, setLogin] = useState<ILogin>({
    email: '',
    password: '',
  });
  const {assets, colors, gradients, sizes} = useTheme();

  const handleChange = useCallback(
    (value: any) => {
      setLogin((state) => ({...state, ...value}));
    },
    [setLogin],
  );

  const handleSignIn = useCallback(() => {
    if (!Object.values(isValid).includes(false)) {
      /** send/save login data */
      console.log('handleSignIn', login);
      // Add your login logic here
      // navigation.navigate('Home');
    }
  }, [isValid, login]);

  const handleForgotPassword = useCallback(() => {
    // Add forgot password logic here
    console.log('Forgot password clicked');
  }, []);

  useEffect(() => {
    setIsValid((state) => ({
      ...state,
      email: regex.email.test(login.email),
      password: regex.password.test(login.password),
    }));
  }, [login, setIsValid]);

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
              onPress={() => navigation.goBack()}>
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

            <RNText
                style={{
                  color: '#FFFFFF',
                  fontFamily: 'OpenSans-ExtraBold',
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  fontSize: 30,
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}>
              INFLUENZA
            </RNText>
          </Image>
        </Block>
        {/* login form */}
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

              <Block
                flex={0}
                align="center"
                justify="center"
                marginBottom={sizes.s}
                paddingTop={sizes.l}>
                <RNText
                  style={{
                    color: '#FFFFFF',
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    fontSize: 24,
                    textAlign: 'center'
                  }}>
                  Sign In
                </RNText>
              </Block>

              <Block
                  row
                  flex={0}
                  align="center"
                  justify="center"
                  marginBottom={sizes.xxl}
                  // paddingBottom={sizes.xxl}
                  paddingHorizontal={sizes.xxl}>

              </Block>
              {/* form inputs */}
              <Block paddingHorizontal={sizes.sm}>
                <Input
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label="Email"
                  keyboardType="email-address"
                  placeholder="Enter your email"
                  success={Boolean(login.email && isValid.email)}
                  danger={Boolean(login.email && !isValid.email)}
                  onChangeText={(value) => handleChange({email: value})}
                />
                <Input
                  secureTextEntry
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label="Password"
                  placeholder="Enter your password"
                  onChangeText={(value) => handleChange({password: value})}
                  success={Boolean(login.password && isValid.password)}
                  danger={Boolean(login.password && !isValid.password)}
                />
              </Block>

              {/* forgot password */}
              <Block flex={0} align="flex-end" paddingHorizontal={sizes.sm}>
                <Button onPress={handleForgotPassword}>
                  <Text p primary semibold>
                    Forgot Password?
                  </Text>
                </Button>
              </Block>

              <Button
                onPress={handleSignIn}
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                gradient={gradients.primary}
                disabled={Object.values(isValid).includes(false)}>
                <Text bold white transform="uppercase">
                  Sign In
                </Text>
              </Button>

              <Button
                primary
                outlined
                shadow={!isAndroid}
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                onPress={() => navigation.navigate('Register')}>
                <Text bold primary transform="uppercase">
                  Create Account
                </Text>
              </Button>
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default Login;
