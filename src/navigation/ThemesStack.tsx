import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ThemesScreen from '../screens/main/ThemesScreen';
import ThemeCoursesScreen from '../screens/main/ThemeCoursesScreen';
import CourseDetailScreen from '../screens/main/CourseDetailScreen';

const Stack = createNativeStackNavigator();

export default function ThemesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ThemesList" component={ThemesScreen} />
      <Stack.Screen name="ThemeCourses" component={ThemeCoursesScreen} />
      <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
    </Stack.Navigator>
  );
}