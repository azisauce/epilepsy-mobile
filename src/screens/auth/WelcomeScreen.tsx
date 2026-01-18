import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';

type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: { invitationId?: string };
};

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export default function WelcomeScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Epilepsy Friend</Text>
          <Text style={styles.subtitle}>
            Your helper application to monitor{'\n'}and help you bla bla your child
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Already have an account"
            onPress={() => navigation.navigate('Login')}
            variant="primary"
          />

          <CustomButton
            title="Be a member"
            onPress={() => navigation.navigate('Register', {})}
            variant="secondary"
          />
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '400',
    color: '#000000',
    marginBottom: 40,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 16,
  },
});