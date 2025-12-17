import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme';
import { HomeScreen, UuidGeneratorScreen } from '../screens';

export type RootStackParamList = {
  Home: undefined;
  UuidGenerator: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
    const { theme } = useTheme();

    return (
        <NavigationContainer theme={theme === 'dark' ? DarkTheme : DefaultTheme }>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="UuidGenerator" component={UuidGeneratorScreen} />
        </Stack.Navigator>
        </NavigationContainer>
    );
};