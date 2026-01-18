import { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert, RefreshControl } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { firestore } from '../../config/firebase.config';
import LinkedList, { LinkedUser } from '../../components/LinkedList';
import CustomHeader from '../../components/CustomHeader';
import { Parent, Child } from '../../types/user.types';

const USERS_COLLECTION = firestore().collection('users');

export default function HomeScreen() {
  const { profile, refreshProfile } = useAuth();
  const [linkedUsers, setLinkedUsers] = useState<LinkedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (profile) {
      fetchLinkedUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]); // Only re-run when profile ID changes

  const fetchLinkedUsers = async () => {
    if (!profile) return;

    setLoading(true);
    try {
      console.log('[HOME] Fetching linked users for role:', profile.role);

      let userIds: string[] = [];

      // Get the list of linked user IDs based on role
      if (profile.role === 'parent') {
        const parentProfile = profile as Parent;
        userIds = parentProfile.linkedChildrenIds || [];
        console.log('[HOME] Parent linked children IDs:', userIds);
      } else if (profile.role === 'child') {
        const childProfile = profile as Child;
        userIds = childProfile.linkedParentsIds || [];
        console.log('[HOME] Child linked parents IDs:', userIds);
      }

      if (userIds.length === 0) {
        console.log('[HOME] No linked users found');
        setLinkedUsers([]);
        setLoading(false);
        return;
      }

      // Fetch user details for each linked ID
      const usersData: LinkedUser[] = [];

      for (const userId of userIds) {
        try {
          const userDoc = await USERS_COLLECTION.doc(userId).get();

          if (userDoc.exists()) {
            const userData = userDoc.data();
            usersData.push({
              id: userId,
              firstName: userData?.firstName || '',
              lastName: userData?.lastName || '',
              email: userData?.email || '',
              role: userData?.role || 'child',
            });
          } else {
            console.warn('[HOME] User document not found:', userId);
          }
        } catch (error) {
          console.error('[HOME] Error fetching user:', userId, error);
        }
      }

      console.log('[HOME] Fetched linked users:', usersData.length);
      setLinkedUsers(usersData);
    } catch (error: any) {
      console.error('[HOME] Error fetching linked users:', error);
      Alert.alert('Error', 'Failed to load connected users');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // First refresh profile to get latest relationships
      if (refreshProfile) {
        await refreshProfile();
      }
      // but we call it here to be sure or in case dependencies strictly don't change but data does)
      await fetchLinkedUsers();
    } catch (error) {
      console.error('[HOME] Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshProfile, profile]);

  const handleUserPress = (user: LinkedUser) => {
    console.log('[HOME] User pressed:', user);
    // TODO: Navigate to user detail screen or show actions
    Alert.alert(
      user.firstName + ' ' + user.lastName,
      `Email: ${user.email}\nRole: ${user.role}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <CustomHeader
          variant="welcome"
          userName={profile?.firstName}
          userRole={profile?.role as 'parent' | 'child'}
        />

        <View style={styles.listContainer}>
          <LinkedList
            users={linkedUsers}
            userRole={profile?.role as 'parent' | 'child'}
            onUserPress={handleUserPress}
            loading={loading && !refreshing} // Don't show loading spinner if pulling to refresh (native spinner shows)
          />
        </View>
      </ScrollView>
    </View>
  );
}

import { COLORS } from '../../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});