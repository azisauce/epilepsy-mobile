import { StyleSheet, FlatList, TouchableOpacity, View, Text } from 'react-native';
import { themesData } from '../../data/themesData';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Theme } from '../../types/themes.types';
import CustomHeader from '../../components/CustomHeader';

export default function ThemesScreen() {
  // Define the navigation prop type
  const navigation = useNavigation<StackNavigationProp<any, 'ThemesScreen'>>();

  const renderTheme = ({ item }: { item: Theme }) => (
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
      <CustomHeader
        variant="page"
        title="Themes"
        subtitle="Choose a topic to explore"
      />
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

import { COLORS } from '../../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContainer: {
    padding: 15,
  },
  themeCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    elevation: 2,
    shadowColor: COLORS.black,
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
    color: COLORS.secondary,
    marginBottom: 5,
  },
  courseCount: {
    fontSize: 14,
    color: COLORS.gray,
  },
});