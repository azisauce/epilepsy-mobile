import auth from '@react-native-firebase/auth';
import { firestore } from '../config/firebase.config';
import { User } from '../types/user.types';
import { RegisterData, LoginCredentials } from '../types/auth.types';

const USERS_COLLECTION = firestore().collection('users');

/**
 * Register a new user
 */
export const register = async (data: RegisterData) => {
  const { email, password, firstName, lastName, phoneNumber, role } = data;

  const userCredential = await auth().createUserWithEmailAndPassword(email, password);
  const uid = userCredential.user.uid;

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

  await USERS_COLLECTION.doc(uid).set(userDoc);

  try {
    await USERS_COLLECTION.doc(uid).set(userDoc);
    console.log("Firestore write SUCCESS");
    return userDoc;
  } catch (error) {
    console.log("Firestore write ERROR:", error);
    throw error;
  }
};

/**
 * Login user
 */
export const login = async (data: LoginCredentials) => {
  const { email, password } = data;
  const userCredential = await auth().signInWithEmailAndPassword(email, password);
  return userCredential.user;
};

/**
 * Logout user
 */
export const logout = async () => {
  await auth().signOut();
};

/**
 * Get user profile from Firestore
 */
export const getUserProfile = async (uid: string) => {
  const doc = await USERS_COLLECTION.doc(uid).get();
  if (!doc.exists) return null;
  return doc.data() as User;
};
