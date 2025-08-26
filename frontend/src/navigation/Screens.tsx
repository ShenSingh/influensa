import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {Articles, Components, Home, Profile, Register, Login, Pro} from '../screens';
import {useScreenOptions} from '../hooks';

const Stack = createStackNavigator();

export default () => {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions.stack}>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{title: 'Home'}}
      />

      <Stack.Screen
        name="Components"
        component={Components}
        options={screenOptions.components}
      />

      <Stack.Screen
        name="Articles"
        component={Articles}
        options={screenOptions.back}
      />

      <Stack.Screen
        name="Profile"
        component={Profile}
        options={screenOptions.profile}
      />

      <Stack.Screen
        name="Register"
        component={Register}
        options={screenOptions.back}
      />

      <Stack.Screen
        name="Pro"
        component={Pro}
        options={screenOptions.pro}
      />

      <Stack.Screen
        name="Login"
        component={Login}
        options={screenOptions.back}
      />
    </Stack.Navigator>
  );
};
