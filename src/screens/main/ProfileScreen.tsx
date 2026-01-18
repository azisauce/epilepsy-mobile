import { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useAuth } from '../../context/AuthContext';
import CustomButton from '../../components/CustomButton';
import CustomHeader from '../../components/CustomHeader';
import { generateInviteLink } from '../../services/invitation.service';
import { COLORS } from '../../constants/colors';

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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <CustomHeader
          variant="profile"
          title="Profile"
          userName={`${profile?.firstName} ${profile?.lastName}`}
          userRole={profile?.role as 'parent' | 'child'}
        />

        <View style={styles.content}>
          {inviteLink && (
            <View style={styles.linkContainer}>
              <Text style={styles.linkLabel}>Your Invite Link:</Text>
              <Text style={styles.linkText}>{inviteLink}</Text>
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
              variant="primary"
              style={styles.logoutButton}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: 'center',
  },
  linkContainer: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    width: '100%',
    marginBottom: 20,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  linkLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.secondary,
    marginBottom: 8,
  },
  linkText: {
    fontSize: 12,
    color: COLORS.primary,
    fontFamily: 'monospace',
    backgroundColor: COLORS.lightGray,
    padding: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  logoutButton: {
    borderColor: COLORS.error,
  },
});