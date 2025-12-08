import { View, Text, StyleSheet } from 'react-native';

export default function ThemesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Themes</Text>
      <Text style={styles.subtitle}>Customize your app appearance</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
});