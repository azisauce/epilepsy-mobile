import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { themesData } from '../../data/themesData';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function ThemesScreen() {
  // Define the navigation prop type
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'ThemesScreen'>>();

  const renderTheme = ({ item }) => (
    <TouchableOpacity
      style={[styles.themeCard, { borderLeftColor: item.color }]}
      onPress={() => navigation.navigate('ThemeCourses', { theme: item })}
    >
      <View style={styles.themeContent}>
        <Text style={styles.themeTitle}>{item.title}</Text>
        <Text style={styles.courseCount}>{item.courses.length} courses</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Themes</Text>
        <Text style={styles.headerSubtitle}>Choose a topic to explore</Text>
      </View>
      <FlatList
        data={themesData}
        renderItem={renderTheme}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 10,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  listContainer: {
    padding: 15,
  },
  themeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  themeContent: {
    flexDirection: 'column',
  },
  themeTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  courseCount: {
    fontSize: 14,
    color: '#999',
  },
});