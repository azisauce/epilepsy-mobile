import auth from '@react-native-firebase/auth';
import { firestore } from '../config/firebase.config';
import { User } from '../types/user.types';
import { RegisterData, LoginCredentials } from '../types/auth.types';
import { logger } from '../utils/logger';

const USERS_COLLECTION = firestore().collection('users');

/**
 * Register a new user
 */
export const register = async (data: RegisterData) => {
  const { email, password, firstName, lastName, phoneNumber, role } = data;

  try {
    logger.logOperation('REGISTER', 'start', { email, firstName, lastName });

    // Step 1: Create Firebase Auth user
    console.log('🔐 Creating Firebase auth user with email:', email);
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    const uid = userCredential.user.uid;
    console.log('✅ Firebase auth user created successfully. UID:', uid);

    // Step 2: Create Firestore user document
    const userDoc: User = {
      id: uid,
      email,
      firstName,
      lastName,
      phoneNumber: phoneNumber ?? null,
      role: role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('📝 Writing user document to Firestore:', userDoc);
    await USERS_COLLECTION.doc(uid).set(userDoc);
    console.log('✅ User document successfully written to Firestore');

    logger.logOperation('REGISTER', 'success', { uid, email });
    return userDoc;
  } catch (error: any) {
    console.error('❌ Registration error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    logger.logOperation('REGISTER', 'error', { error: error.message, code: error.code });
    throw error;
  }
};

/**
 * Login user
 */
export const login = async (data: LoginCredentials) => {
  const { email, password } = data;

  try {
    logger.logOperation('LOGIN', 'start', { email });
    console.log('🔐 Signing in user:', email);

    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    console.log('✅ Login successful for user:', email);

    logger.logOperation('LOGIN', 'success', { email });
    return userCredential.user;
  } catch (error: any) {
    console.error('❌ Login error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    logger.logOperation('LOGIN', 'error', { error: error.message, code: error.code });
    throw error;
  }
};

/**
 * Logout user
 */
export const logout = async () => {
  try {
    logger.logOperation('LOGOUT', 'start');
    console.log('🔐 Signing out user');

    await auth().signOut();
    console.log('✅ User successfully logged out');

    logger.logOperation('LOGOUT', 'success');
  } catch (error: any) {
    console.error('❌ Logout error:', error);
    logger.logOperation('LOGOUT', 'error', { error: error.message });
    throw error;
  }
};

/**
 * Get user profile from Firestore
 */
export const getUserProfile = async (uid: string) => {
  try {
    console.log('📖 Fetching user profile for UID:', uid);
    const doc = await USERS_COLLECTION.doc(uid).get();

    if (!doc.exists) {
      console.warn('⚠️ User profile not found for UID:', uid);
      return null;
    }

    console.log('✅ User profile fetched successfully');
    return doc.data() as User;
  } catch (error: any) {
    console.error('❌ Error fetching user profile:', error);
    console.error('Error message:', error.message);
    throw error;
  }
};
