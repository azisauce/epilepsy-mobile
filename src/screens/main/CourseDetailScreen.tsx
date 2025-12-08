import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { SafeAreaProvider } from 'react-native-safe-area-context';


export default function CourseDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { course, themeColor } = route.params;

  const renderContent = (item, index) => {
    if (item.type === 'text') {
      return (
        <Text key={index} style={styles.contentText}>
          {item.content}
        </Text>
      );
    } else if (item.type === 'image') {
      return (
        <Image
          key={index}
          source={{ uri: item.content }}
          style={styles.contentImage}
          resizeMode="cover"
        />
      );
    }
    return null;
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <View style={[styles.header, { backgroundColor: themeColor }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {course.image && (
          <Image
            source={{ uri: course.image }}
            style={styles.headerImage}
            resizeMode="cover"
          />
        )}
        
        <View style={styles.contentContainer}>
          <Text style={styles.courseTitle}>{course.name}</Text>
          <Text style={styles.courseDescription}>{course.description}</Text>
          
          <View style={styles.divider} />
          
          <View style={styles.courseContent}>
            {course.content.map((item, index) => renderContent(item, index))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 15,
    paddingTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  headerImage: {
    width: '100%',
    height: 250,
  },
  contentContainer: {
    padding: 20,
  },
  courseTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  courseDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 20,
  },
  courseContent: {
    gap: 20,
  },
  contentText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 26,
    marginBottom: 15,
  },
  contentImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 15,
  },
});