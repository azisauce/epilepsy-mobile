import { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useAuth } from '../../context/AuthContext';
import CustomButton from '../../components/CustomButton';
import { generateInviteLink } from '../../services/invitation.service';

export default function ProfileScreen() {
  const { logout, profile } = useAuth();
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateInviteLink = async () => {
    if (!profile) return;

    setLoading(true);
    try {
      const result = await generateInviteLink({
        inviterId: profile.id,
        inviterRole: profile.role,
        inviterName: `${profile.firstName} ${profile.lastName}`,
      });

      setInviteLink(result.deepLink);

      // Automatically copy to clipboard
      Clipboard.setString(result.deepLink);

      Alert.alert(
        'Invite Link Generated!',
        'The link has been copied to your clipboard. Share it with your family member.',
        [{ text: 'OK' }]
      );

      console.log('[PROFILE] Invite link generated:', result.deepLink);
    } catch (error: any) {
      console.error('[PROFILE] Error generating invite link:', error);
      Alert.alert('Error', error.message || 'Failed to generate invite link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.name}>{profile?.firstName} {profile?.lastName}</Text>
      <Text style={styles.role}>Role: {profile?.role}</Text>

      {inviteLink && (
        <View style={styles.linkContainer}>
          <Text style={styles.linkLabel}>Your Invite Link:</Text>
          <Text style={styles.linkText} numberOfLines={2}>{inviteLink}</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <CustomButton
          title={loading ? 'Generating...' : 'Generate Invite Link'}
          onPress={handleGenerateInviteLink}
          variant="primary"
        />

        <CustomButton
          title="Logout"
          onPress={logout}
          variant="secondary"
          style={styles.logoutButton}
          textColor="#FF3B30"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  name: {
    fontSize: 20,
    color: '#666',
    marginBottom: 10,
  },
  role: {
    fontSize: 16,
    color: '#999',
    marginBottom: 30,
    textTransform: 'capitalize',
  },
  linkContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    width: '90%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  linkLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  linkText: {
    fontSize: 12,
    color: '#007AFF',
    fontFamily: 'monospace',
  },
  buttonContainer: {
    width: '80%',
    marginTop: 20,
    gap: 16,
  },
  logoutButton: {
    borderColor: '#FF3B30',
  },
});