import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './src/theme';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useFonts, ShareTechMono_400Regular } from '@expo-google-fonts/share-tech-mono';
import { ActivityIndicator, View } from 'react-native';
import { Logger } from './src/services/Logger';
import { useEffect } from 'react';
import { SENTRY_DSN } from '@env';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://4e496c784a94973515cce62e9ed68caa@o4510589328621568.ingest.de.sentry.io/4510589330325584',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

export default Sentry.wrap(function App() {
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
});