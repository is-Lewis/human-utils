import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './src/theme';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useFonts, ShareTechMono_400Regular } from '@expo-google-fonts/share-tech-mono';
import { ActivityIndicator, View } from 'react-native';
import { Logger } from './src/services/Logger';
import { useEffect } from 'react';
import { SENTRY_DSN } from '@env';

export default function App() {
  useEffect(() => {
    // Initialise logger with Sentry on app mount
    if (SENTRY_DSN) {
      Logger.init(SENTRY_DSN);
    }
  }, []);

  const [fontsLoaded] = useFonts({
    ShareTechMono_400Regular,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <RootNavigator />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
