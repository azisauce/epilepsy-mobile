import React, { useState } from 'react';
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
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
  });

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

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) setEmailError('');
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) setPasswordError('');
  };

  const handleLogin = async () => {
    // Reset errors
    setEmailError('');
    setPasswordError('');

    // Validate email
    if (!email) {
      setEmailError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.errors.join(' & '));
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      showAlert('Oups!', 'Email or password is incorrect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Password reset functionality coming soon');
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>

          <View style={styles.content}>
            <Text style={styles.title}>Rejoin us !</Text>

            <View style={styles.formContainer}>
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
                    autoComplete="password"
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off' : 'eye'} // eye-off = crossed eye
                      size={24}
                      color="#000"
                    />
                  </TouchableOpacity>
                </View>
                {passwordError ? (
                  <Text style={styles.errorText}>{passwordError}</Text>
                ) : null}
              </View>

              <TouchableOpacity
                style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={styles.loginButtonText}>
                  Login
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.forgotPasswordButton}
                onPress={handleForgotPassword}
              >
                <Text style={styles.forgotPasswordText}>
                  Forget your password?
                </Text>
              </TouchableOpacity>
            </View>
            <CustomAlert
              visible={alertVisible}
              title={alertConfig.title}
              message={alertConfig.message}
              onClose={() => setAlertVisible(false)}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  eyeIcon: {
    fontSize: 20,
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
  loginButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  loginButtonDisabled: {
    backgroundColor: '#F5F5F5',
    borderColor: '#CCCCCC',
    opacity: 0.7,
  },
  loginButtonText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  forgotPasswordButton: {
    alignSelf: 'center',
    marginTop: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#000000',
    textAlign: 'center',
  },
});