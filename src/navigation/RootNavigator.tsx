import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme';
import { HomeScreen, UuidGeneratorScreen } from '../screens';
import { Base64EncoderScreen } from '../screens/Base64EncoderScreen';
import { CustomHeader } from './CustomHeader';

export type RootStackParamList = {
  Home: undefined;
  UuidGenerator: undefined;
  Base64Encoder: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
    const { theme } = useTheme();

    return (
        <NavigationContainer theme={theme === 'dark' ? DarkTheme : DefaultTheme }>
            <Stack.Navigator
                screenOptions={{
                    header: (props) => <CustomHeader {...props} />,
                }}
            >
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="UuidGenerator" component={UuidGeneratorScreen} />
                <Stack.Screen name="Base64Encoder" component={Base64EncoderScreen} />
        </Stack.Navigator>
        </NavigationContainer>
    );
};