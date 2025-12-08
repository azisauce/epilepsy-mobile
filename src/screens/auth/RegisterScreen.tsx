import { View, Text, Button } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function RegisterScreen() {
  const { register } = useAuth();

  const handleRegister = async () => {
    await register({
      email: 'test@test1.com',
      password: '123456',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '28097932',
      role: 'parent'
    });
  };

  return (
    <View>
      <Text>Register</Text>
      <Button title="Create Account" onPress={handleRegister} />
    </View>
  );
}
