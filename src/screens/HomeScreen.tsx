import { View, Text, Button } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
  const { logout, profile } = useAuth();

  return (
    <View>
      <Text>Welcome {profile?.firstName}</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
