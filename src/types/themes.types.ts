export interface Course {
  id: string;
  name: string;
  description: string;
  image?: string;
  content: CourseContent[];
}

export interface CourseContent {
  type: 'text' | 'image';
  content: string;
}

export interface Theme {
  id: string;
  title: string;
  color: string;
  courses: Course[];
}