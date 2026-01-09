import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { useAuth } from '../context/AuthContext';

// Deep linking configuration
const linking = {
  prefixes: ['epilepsy-app://', 'https://epilepsy-app.com'],
  config: {
    screens: {
      Welcome: 'welcome',
      Login: 'login',
      Register: 'invite/:invitationId',
    },
  },
};

export default function RootNavigator() {
  const { user } = useAuth(); // Firebase auth user

  return (
    <NavigationContainer
      linking={linking as any}
      fallback={null}
      onReady={() => {
        console.log('[NAVIGATION] Navigation ready, deep linking configured');
      }}
    >
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
