import { View, Text, Button } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();

  const handleLogin = async () => {
    await login('test@test.com', '123456'); 
  };

  return (
    <View>
      <Text>Login</Text>
      <Button title="Log in" onPress={handleLogin} />
      <Button
        title="Go to Register"
        onPress={() => navigation.navigate('Register')}
      />
    </View>
  );
}
