import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme';
import { HomeScreen, UuidGeneratorScreen } from '../screens';
import { Base64EncoderScreen } from '../screens/Base64EncoderScreen';
import { JsonFormatterScreen } from '../screens/JsonFormatterScreen';
import { LoremIpsumScreen } from '../screens/LoremIpsumScreen';
import { CaseConverterScreen } from '../screens/CaseConverterScreen';
import { CustomHeader } from './CustomHeader';

export type RootStackParamList = {
  Home: undefined;
  UuidGenerator: undefined;
  Base64Encoder: undefined;
  JsonFormatter: undefined;
  LoremIpsum: undefined;
  CaseConverter: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { theme } = useTheme();

  return (
    <NavigationContainer theme={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator
        screenOptions={{
          header: (props) => <CustomHeader {...props} />,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="UuidGenerator" component={UuidGeneratorScreen} />
        <Stack.Screen name="Base64Encoder" component={Base64EncoderScreen} />
        <Stack.Screen name="JsonFormatter" component={JsonFormatterScreen} />
        <Stack.Screen name="LoremIpsum" component={LoremIpsumScreen} />
        <Stack.Screen name="CaseConverter" component={CaseConverterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
