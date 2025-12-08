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

export const themesData: Theme[] = [
  {
    id: '1',
    title: 'Programming',
    color: '#007AFF',
    courses: [
      {
        id: '1-1',
        name: 'Introduction to JavaScript',
        description: 'Learn the basics of JavaScript programming',
        image: 'https://via.placeholder.com/400x200/007AFF/FFFFFF?text=JavaScript',
        content: [
          {
            type: 'text',
            content: 'JavaScript is a versatile programming language that powers the web. In this course, you\'ll learn the fundamentals of JavaScript including variables, functions, and control structures.'
          },
          {
            type: 'image',
            content: 'https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Code+Example'
          },
          {
            type: 'text',
            content: 'You\'ll start by understanding how to declare variables using let, const, and var. Then we\'ll explore functions, loops, and conditional statements that form the building blocks of any JavaScript program.'
          }
        ]
      },
      {
        id: '1-2',
        name: 'React Native Fundamentals',
        description: 'Build mobile apps with React Native',
        image: 'https://via.placeholder.com/400x200/61DAFB/000000?text=React+Native',
        content: [
          {
            type: 'text',
            content: 'React Native allows you to build native mobile applications using JavaScript and React. This course covers components, styling, and navigation.'
          },
          {
            type: 'text',
            content: 'You\'ll learn how to create reusable components, manage state, and handle user interactions in a mobile environment.'
          }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Design',
    color: '#FF6B6B',
    courses: [
      {
        id: '2-1',
        name: 'UI/UX Principles',
        description: 'Master the art of user interface design',
        image: 'https://via.placeholder.com/400x200/FF6B6B/FFFFFF?text=UI+UX',
        content: [
          {
            type: 'text',
            content: 'Great design is about creating intuitive and beautiful experiences. This course covers fundamental principles of UI/UX design including layout, typography, and color theory.'
          },
          {
            type: 'image',
            content: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Design+Grid'
          },
          {
            type: 'text',
            content: 'You\'ll learn about user research, wireframing, prototyping, and testing your designs with real users.'
          }
        ]
      },
      {
        id: '2-2',
        name: 'Mobile Design Patterns',
        description: 'Common patterns for mobile interfaces',
        image: 'https://via.placeholder.com/400x200/9B59B6/FFFFFF?text=Mobile+Design',
        content: [
          {
            type: 'text',
            content: 'Mobile design requires special consideration for smaller screens and touch interactions. Learn the most effective patterns for navigation, forms, and data display.'
          }
        ]
      }
    ]
  },
  {
    id: '3',
    title: 'Business',
    color: '#F39C12',
    courses: [
      {
        id: '3-1',
        name: 'Startup Fundamentals',
        description: 'Learn how to launch your startup',
        image: 'https://via.placeholder.com/400x200/F39C12/FFFFFF?text=Startup',
        content: [
          {
            type: 'text',
            content: 'Starting a business requires more than just a good idea. This course covers business planning, funding, and growth strategies.'
          },
          {
            type: 'text',
            content: 'You\'ll learn how to validate your idea, create a business model, pitch to investors, and scale your startup.'
          }
        ]
      }
    ]
  },
  {
    id: '4',
    title: 'Marketing',
    color: '#27AE60',
    courses: [
      {
        id: '4-1',
        name: 'Digital Marketing Basics',
        description: 'Master online marketing strategies',
        image: 'https://via.placeholder.com/400x200/27AE60/FFFFFF?text=Marketing',
        content: [
          {
            type: 'text',
            content: 'Digital marketing is essential for any modern business. Learn about SEO, social media marketing, content marketing, and email campaigns.'
          },
          {
            type: 'image',
            content: 'https://via.placeholder.com/300x200/27AE60/FFFFFF?text=Marketing+Funnel'
          }
        ]
      }
    ]
  },
  {
    id: '5',
    title: 'Photography',
    color: '#E74C3C',
    courses: [
      {
        id: '5-1',
        name: 'Photography Basics',
        description: 'Learn the fundamentals of photography',
        image: 'https://via.placeholder.com/400x200/E74C3C/FFFFFF?text=Photography',
        content: [
          {
            type: 'text',
            content: 'Photography is about capturing moments and telling stories. Learn about composition, lighting, and camera settings.'
          },
          {
            type: 'image',
            content: 'https://via.placeholder.com/300x200/E74C3C/FFFFFF?text=Camera+Settings'
          },
          {
            type: 'text',
            content: 'You\'ll understand the exposure triangle: aperture, shutter speed, and ISO, and how they work together to create stunning images.'
          }
        ]
      }
    ]
  },
  {
    id: '6',
    title: 'Finance',
    color: '#3498DB',
    courses: [
      {
        id: '6-1',
        name: 'Personal Finance 101',
        description: 'Manage your money effectively',
        image: 'https://via.placeholder.com/400x200/3498DB/FFFFFF?text=Finance',
        content: [
          {
            type: 'text',
            content: 'Financial literacy is crucial for long-term success. This course covers budgeting, saving, investing, and retirement planning.'
          },
          {
            type: 'text',
            content: 'You\'ll learn how to create a budget, build an emergency fund, and make smart investment decisions for your future.'
          }
        ]
      }
    ]
  }
];