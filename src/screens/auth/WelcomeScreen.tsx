import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
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
  const [inviteLink, setInviteLink] = useState('');
  const [showInviteInput, setShowInviteInput] = useState(false);

  const handleRegisterWithInvite = () => {
    // Extract invitation ID from the link
    let invitationId: string | undefined;

    if (inviteLink.trim()) {
      // Parse the invitation link to extract the ID
      // Format: epilepsy-app://invite/abc123
      const match = inviteLink.match(/invite\/([a-zA-Z0-9_-]+)/);

      if (match && match[1]) {
        invitationId = match[1];
        console.log('[WELCOME] Navigating to register with invitation:', invitationId);
      } else {
        Alert.alert(
          'Invalid Link',
          'Please enter a valid invitation link',
          [{ text: 'OK' }]
        );
        return;
      }
    }

    // Navigate to register screen with optional invitationId
    navigation.navigate('Register', { invitationId });
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Epilepsy Friend</Text>
          <Text style={styles.subtitle}>
            Your helper application to monitor{'\n'}and help you bla bla your child
          </Text>
        </View>

        <View style={styles.formContainer}>
          {/* Toggle button for invitation link */}
          {!showInviteInput && (
            <TouchableOpacity
              style={styles.inviteLinkButton}
              onPress={() => setShowInviteInput(true)}
            >
              <Text style={styles.inviteLinkButtonText}>
                📨 Have an invitation link?
              </Text>
            </TouchableOpacity>
          )}

          {/* Invitation Link Input (shown when toggled) */}
          {showInviteInput && (
            <View style={styles.inviteSection}>
              <View style={styles.inviteHeader}>
                <Text style={styles.inviteLabel}>Paste your invitation link</Text>
                <TouchableOpacity onPress={() => {
                  setShowInviteInput(false);
                  setInviteLink('');
                }}>
                  <Text style={styles.cancelText}>✕</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.inviteInput}
                placeholder="epilepsy-app://invite/..."
                placeholderTextColor="#999"
                value={inviteLink}
                onChangeText={setInviteLink}
                autoCapitalize="none"
                autoCorrect={false}
                autoFocus
              />
            </View>
          )}

          <View style={styles.buttonContainer}>
            <CustomButton
              title="Already have an account"
              onPress={() => navigation.navigate('Login')}
              variant="primary"
            />

            <CustomButton
              title="Be a member"
              onPress={handleRegisterWithInvite}
              variant="secondary"
            />
          </View>
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
  formContainer: {
    gap: 24,
  },
  inviteLinkButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  inviteLinkButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  inviteSection: {
    gap: 8,
  },
  inviteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  inviteLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  cancelText: {
    fontSize: 20,
    color: '#999',
    paddingHorizontal: 8,
  },
  inviteInput: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: 14,
    color: '#000000',
  },
  buttonContainer: {
    gap: 16,
  },
});