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
  const { register } = useAuth();

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

  // Load invitation if invitationId is provided
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

          // Small delay to ensure user document is created
          await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));

          // Get the newly created user ID from auth context
          // This will be available after successful registration
          // We'll need to accept the invitation in the next screen or after auth state updates

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
                <TouchableOpacity
                  style={styles.selectInput}
                  onPress={() => setShowRoleModal(true)}
                >
                  <Text style={styles.selectText}>{selectedRoleLabel}</Text>
                  <Text style={styles.selectArrow}>▼</Text>
                </TouchableOpacity>
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
          <TouchableOpacity
            style={[styles.registerButton, isButtonDisabled && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={isButtonDisabled}
          >
            <Text style={styles.registerButtonText}>
              Register
            </Text>
          </TouchableOpacity>
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
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
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
    color: '#000000',
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
    color: '#000000',
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
    color: '#000000',
    fontWeight: '400',
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#000000',
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
    borderColor: '#DC2626',
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
    marginLeft: 4,
    marginTop: 2,
  },
  selectInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 16,
    color: '#000000',
  },
  selectArrow: {
    fontSize: 12,
    color: '#000000',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  registerButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
  },
  registerButtonDisabled: {
    backgroundColor: '#F5F5F5',
    borderColor: '#CCCCCC',
    opacity: 0.7,
  },
  registerButtonText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 15,
    marginBottom: 12,
  },
  modalOptionSelected: {
    backgroundColor: '#F0F0F0',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
  },
  modalOptionTextSelected: {
    fontWeight: '500',
  },
});