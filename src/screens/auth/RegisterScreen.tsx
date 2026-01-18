import React, { useState, useEffect } from 'react';
import Ionicons from '@react-native-vector-icons/ionicons';
import CustomAlert from '../../components/CustomAlert';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { UserRole } from '../../types/user.types';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getInvitationById, acceptInvitation } from '../../services/invitation.service';
import type { Invitation } from '../../types/invitation.types';
import CustomButton from '../../components/CustomButton';
import { auth } from '../../config/firebase.config';
import { COLORS } from '../../constants/colors';

type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: { invitationId?: string };
};

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;
type RegisterRouteProp = RouteProp<AuthStackParamList, 'Register'>;

const USER_ROLES: { label: string; value: UserRole }[] = [
  { label: 'Parent', value: 'parent' },
  { label: 'Child', value: 'child' },
];

export default function RegisterScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RegisterRouteProp>();
  const { register, refreshProfile } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('parent');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Invitation state
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loadingInvitation, setLoadingInvitation] = useState(false);

  // Error states
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
  });

  // Load invitation if invitationId is provide d
  useEffect(() => {
    const loadInvitation = async () => {
      const { invitationId } = route.params || {};

      if (invitationId) {
        setLoadingInvitation(true);
        try {
          console.log('[REGISTER] Loading invitation:', invitationId);
          const inviteData = await getInvitationById(invitationId);

          if (!inviteData) {
            showAlert('Invalid Invitation', 'This invitation link is invalid or has expired.');
            return;
          }

          if (inviteData.status !== 'pending') {
            showAlert('Invitation Unavailable', `This invitation has already been ${inviteData.status}.`);
            return;
          }

          setInvitation(inviteData);

          // Auto-set the role to the opposite of the inviter's role
          const suggestedRole: UserRole = inviteData.inviterRole === 'parent' ? 'child' : 'parent';
          setUserRole(suggestedRole);

          console.log('[REGISTER] Invitation loaded successfully', {
            inviter: inviteData.inviterName,
            role: suggestedRole,
          });

          showAlert(
            'Invitation Found!',
            `${inviteData.inviterName} (${inviteData.inviterRole}) has invited you to connect. Complete registration to accept.`
          );
        } catch (error: any) {
          console.error('[REGISTER] Error loading invitation:', error);
          showAlert('Error', 'Failed to load invitation details.');
        } finally {
          setLoadingInvitation(false);
        }
      }
    };

    loadInvitation();
  }, [route.params]);

  const showAlert = (title: string, message: string) => {
    setAlertConfig({ title, message });
    setAlertVisible(true);
  };

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation
  const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Minimum 8 characters required');
    }

    if (!/[a-zA-Z]/.test(password)) {
      errors.push('Must contain at least one letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Must contain at least one digit');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  // Check if form is valid
  const isFormValid = (): boolean => {
    return (
      firstName.trim() !== '' &&
      lastName.trim() !== '' &&
      email.trim() !== '' &&
      phoneNumber.trim() !== '' &&
      password !== '' &&
      confirmPassword !== '' &&
      !firstNameError &&
      !lastNameError &&
      !emailError &&
      !phoneNumberError &&
      !passwordError &&
      !confirmPasswordError
    );
  };

  // Real-time validation handlers
  const handleFirstNameChange = (text: string) => {
    setFirstName(text);
    if (!text.trim()) {
      setFirstNameError('First name is required');
    } else {
      setFirstNameError('');
    }
  };

  const handleLastNameChange = (text: string) => {
    setLastName(text);
    if (!text.trim()) {
      setLastNameError('Last name is required');
    } else {
      setLastNameError('');
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (!text.trim()) {
      setEmailError('Email is required');
    } else if (!validateEmail(text)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handlePhoneNumberChange = (text: string) => {
    setPhoneNumber(text);
    if (!text.trim()) {
      setPhoneNumberError('Phone number is required');
    } else {
      setPhoneNumberError('');
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    const passwordValidation = validatePassword(text);
    if (!text) {
      setPasswordError('Password is required');
    } else if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.errors.join(' & '));
    } else {
      setPasswordError('');
    }

    // Also validate confirm password if it has a value
    if (confirmPassword) {
      if (text !== confirmPassword) {
        setConfirmPasswordError('Passwords do not match');
      } else {
        setConfirmPasswordError('');
      }
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (!text) {
      setConfirmPasswordError('Please confirm your password');
    } else if (text !== password) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleRegister = async () => {
    // Final validation check
    let hasError = false;

    if (!firstName.trim()) {
      setFirstNameError('First name is required');
      hasError = true;
    }
    if (!lastName.trim()) {
      setLastNameError('Last name is required');
      hasError = true;
    }
    if (!email.trim()) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    }
    if (!phoneNumber.trim()) {
      setPhoneNumberError('Phone number is required');
      hasError = true;
    }
    if (!password) {
      setPasswordError('Password is required');
      hasError = true;
    } else {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        setPasswordError(passwordValidation.errors.join(' & '));
        hasError = true;
      }
    }
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);
    try {
      // Register the user
      await register({
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        role: userRole,
      });

      console.log('[REGISTER] User registered successfully');

      // If there's an invitation, accept it after registration
      if (invitation && route.params?.invitationId) {
        try {
          console.log('[REGISTER] Accepting invitation:', invitation.id);

          // Small delay to ensure user document is created and auth state updated
          await new Promise<void>(resolve => setTimeout(() => resolve(), 2000));

          // Get the newly created user ID from Firebase auth
          const currentUser = auth().currentUser;

          if (!currentUser) {
            throw new Error('No authenticated user found after registration');
          }

          console.log('[REGISTER] Current user ID:', currentUser.uid);
          console.log('[REGISTER] Accepting invitation with role:', userRole);

          // Accept the invitation
          await acceptInvitation({
            invitationId: invitation.id,
            acceptingUserId: currentUser.uid,
            acceptingUserRole: userRole,
          });

          console.log('[REGISTER] Invitation accepted successfully');

          // Refresh the profile to get updated relationship arrays
          console.log('[REGISTER] Refreshing user profile...');
          await refreshProfile();
          console.log('[REGISTER] Profile refreshed with updated relationships');

          showAlert(
            'Registration Successful!',
            `Your account has been created and you've been connected with ${invitation.inviterName}!`
          );
        } catch (inviteError: any) {
          console.error('[REGISTER] Error accepting invitation:', inviteError);
          showAlert(
            'Registration Successful',
            'Your account was created, but there was an issue accepting the invitation. You can try connecting again later.'
          );
        }
      }
    } catch (error: any) {
      showAlert('Registration Error', error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const selectedRoleLabel = USER_ROLES.find(role => role.value === userRole)?.label || 'Parent';
  const isButtonDisabled = loading || !isFormValid();

  return (
    <SafeAreaProvider style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Join Us</Text>

            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>First name</Text>
                <TextInput
                  style={[styles.input, firstNameError && styles.inputError]}
                  placeholder="first name"
                  placeholderTextColor="#999"
                  value={firstName}
                  onChangeText={handleFirstNameChange}
                  autoCapitalize="words"
                  autoComplete="name-given"
                />
                {firstNameError ? (
                  <Text style={styles.errorText}>{firstNameError}</Text>
                ) : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Last name</Text>
                <TextInput
                  style={[styles.input, lastNameError && styles.inputError]}
                  placeholder="last name"
                  placeholderTextColor="#999"
                  value={lastName}
                  onChangeText={handleLastNameChange}
                  autoCapitalize="words"
                  autoComplete="name-family"
                />
                {lastNameError ? (
                  <Text style={styles.errorText}>{lastNameError}</Text>
                ) : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={[styles.input, emailError && styles.inputError]}
                  placeholder="email"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={handleEmailChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
                {emailError ? (
                  <Text style={styles.errorText}>{emailError}</Text>
                ) : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone number</Text>
                <TextInput
                  style={[styles.input, phoneNumberError && styles.inputError]}
                  placeholder="phone number"
                  placeholderTextColor="#999"
                  value={phoneNumber}
                  onChangeText={handlePhoneNumberChange}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                />
                {phoneNumberError ? (
                  <Text style={styles.errorText}>{phoneNumberError}</Text>
                ) : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>User type</Text>
                {invitation ? (
                  // If there's an invitation, show locked role with info
                  <View style={styles.lockedRoleContainer}>
                    <View style={styles.selectInput}>
                      <Text style={styles.selectText}>{selectedRoleLabel}</Text>
                      <Text style={styles.lockIcon}>🔒</Text>
                    </View>
                    <Text style={styles.roleInfoText}>
                      Role set by invitation from {invitation.inviterName}
                    </Text>
                  </View>
                ) : (
                  // Normal role selector when no invitation
                  <TouchableOpacity
                    style={styles.selectInput}
                    onPress={() => setShowRoleModal(true)}
                  >
                    <Text style={styles.selectText}>{selectedRoleLabel}</Text>
                    <Text style={styles.selectArrow}>▼</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.input, styles.passwordInput, passwordError && styles.inputError]}
                    placeholder="password"
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={handlePasswordChange}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="password-new"
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={24}
                      color="#000"
                    />
                  </TouchableOpacity>
                </View>
                {passwordError ? (
                  <Text style={styles.errorText}>{passwordError}</Text>
                ) : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.input, styles.passwordInput, confirmPasswordError && styles.inputError]}
                    placeholder="confirm password"
                    placeholderTextColor="#999"
                    value={confirmPassword}
                    onChangeText={handleConfirmPasswordChange}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoComplete="password-new"
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye-off' : 'eye'}
                      size={24}
                      color="#000"
                    />
                  </TouchableOpacity>
                </View>
                {confirmPasswordError ? (
                  <Text style={styles.errorText}>{confirmPasswordError}</Text>
                ) : null}
              </View>
            </View>

            <CustomAlert
              visible={alertVisible}
              title={alertConfig.title}
              message={alertConfig.message}
              onClose={() => setAlertVisible(false)}
            />
          </View>
        </ScrollView>

        {/* Fixed Register Button */}
        <View style={styles.buttonContainer}>
          <CustomButton
            title={loading ? 'Registering...' : 'Register'}
            onPress={handleRegister}
            variant="primary"
            style={isButtonDisabled ? styles.registerButtonDisabled : undefined}
          />
        </View>
      </KeyboardAvoidingView>

      {/* Role Selection Modal */}
      <Modal
        visible={showRoleModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowRoleModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowRoleModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select User Type</Text>
            {USER_ROLES.map((role) => (
              <TouchableOpacity
                key={role.value}
                style={[
                  styles.modalOption,
                  userRole === role.value && styles.modalOptionSelected,
                ]}
                onPress={() => {
                  setUserRole(role.value);
                  setShowRoleModal(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    userRole === role.value && styles.modalOptionTextSelected,
                  ]}
                >
                  {role.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'ios' ? 40 : 40,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 40,
    color: COLORS.secondary,
    fontWeight: '300',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  title: {
    fontSize: 32,
    fontWeight: '400',
    color: COLORS.secondary,
    textAlign: 'center',
    marginBottom: 60,
  },
  formContainer: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 18,
    color: COLORS.secondary,
    fontWeight: '400',
    marginLeft: 4,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: 16,
    color: COLORS.black,
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginLeft: 4,
    marginTop: 2,
  },
  selectInput: {
    backgroundColor: COLORS.white,
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectText: {
    fontSize: 16,
    color: COLORS.black,
  },
  selectArrow: {
    fontSize: 12,
    color: COLORS.secondary,
  },
  lockedRoleContainer: {
    gap: 8,
  },
  lockIcon: {
    fontSize: 16,
    color: COLORS.gray,
  },
  roleInfoText: {
    fontSize: 12,
    color: COLORS.gray,
    fontStyle: 'italic',
    marginTop: 4,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    backgroundColor: 'transparent',
  },
  registerButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  registerButtonDisabled: {
    backgroundColor: COLORS.gray,
    opacity: 0.7,
  },
  registerButtonText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.secondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 15,
    marginBottom: 12,
  },
  modalOptionSelected: {
    backgroundColor: COLORS.lightGray,
    borderColor: COLORS.primary,
  },
  modalOptionText: {
    fontSize: 16,
    color: COLORS.black,
    textAlign: 'center',
  },
  modalOptionTextSelected: {
    fontWeight: '600',
    color: COLORS.primary,
  },
});