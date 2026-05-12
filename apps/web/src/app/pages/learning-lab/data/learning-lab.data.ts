import { Course } from '../models/learning-lab.model';

export const LEARNING_COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'Introduction to Sign Language',
    description: 'Learn the basics of sign language, deaf culture, and communication etiquette.',
    isLocked: false,
    progress: 0,
    xpPoints: 100,
    lessons: [
      {
        id: 'c1-l1',
        title: 'What is sign language?',
        content: 'Sign language is a visual-gestural language that uses hand shapes, movements, and facial expressions to convey meaning. It is not universal; different countries have their own sign languages.',
        quiz: {
          id: 'q-c1-l1',
          title: 'Check your understanding',
          questions: [
            {
              id: 'q1',
              question: 'Is sign language universal?',
              options: ['Yes, it is the same everywhere', 'No, different countries have their own versions'],
              correctAnswer: 'No, different countries have their own versions'
            }
          ]
        }
      },
      {
        id: 'c1-l2',
        title: 'Deaf Culture Basics',
        content: 'Deaf culture is a set of social beliefs, behaviors, and values influenced by deafness. Respect and eye contact are crucial.',
        signs: [
          { label: 'Friend', description: 'Interlocking index fingers.', meaning: 'Friend', difficulty: 'Beginner' }
        ]
      },
      {
        id: 'c1-l3',
        title: 'Communication Etiquette',
        content: 'Always maintain eye contact. Do not speak over a person signing. Focus on their signs and facial expressions.',
        quiz: {
          id: 'q-c1-l3',
          title: 'Etiquette Quiz',
          questions: [
            {
              id: 'q1',
              question: 'What is crucial when communicating?',
              options: ['Looking away', 'Eye contact', 'Shouting'],
              correctAnswer: 'Eye contact'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'course-2',
    title: 'Alphabet A-Z',
    description: 'Master the manual alphabet (fingerspelling) and numbers 0-10.',
    isLocked: true,
    progress: 0,
    xpPoints: 200,
    lessons: [
      {
        id: 'c2-l1',
        title: 'Letters A to M',
        content: 'Fingerspelling is used for names, places, and words without a specific sign.',
        signs: [
          { label: 'A', description: 'Closed fist with thumb outside.', meaning: 'Letter A' },
          { label: 'B', description: 'Open palm with thumb tucked.', meaning: 'Letter B' },
          { label: 'C', description: 'C-shaped hand.', meaning: 'Letter C' }
        ]
      },
      {
        id: 'c2-l2',
        title: 'Letters N to Z',
        content: 'Continue mastering the alphabet.',
        signs: [
          { label: 'Z', description: 'Draw a Z in the air with index finger.', meaning: 'Letter Z' }
        ]
      },
      {
        id: 'c2-l3',
        title: 'Number Signs 0-10',
        content: 'Learning numbers for ages and quantities.',
        signs: [
          { label: '1', description: 'Index finger up', meaning: 'One' },
          { label: '5', description: 'All fingers open', meaning: 'Five' }
        ]
      }
    ]
  },
  {
    id: 'course-3',
    title: 'Greetings',
    description: 'Learn how to start a conversation and introduce yourself.',
    isLocked: true,
    progress: 0,
    xpPoints: 300,
    lessons: [
      {
        id: 'c3-l1',
        title: 'Hello and Good Morning',
        content: 'Basic greetings to start your day.',
        signs: [
          { label: 'Hello', description: 'Hand moves from forehead outward.', meaning: 'Hello' },
          { label: 'Good Morning', description: 'Hand moves from chin then rises like sun.', meaning: 'Good Morning' }
        ]
      },
      {
        id: 'c3-l2',
        title: 'Thank you and My Name is...',
        content: 'Essential phrases for meeting people.',
        signs: [
          { label: 'Thank you', description: 'Hand from chin outward.', meaning: 'Thank you' },
          { label: 'Name', description: 'Two fingers tap on each other.', meaning: 'Name' }
        ]
      }
    ]
  },
  {
    id: 'course-4',
    title: 'Everyday Expressions',
    description: 'Useful phrases for daily communication.',
    isLocked: true,
    progress: 0,
    xpPoints: 400,
    lessons: [
      {
        id: 'c4-l1',
        title: 'Common Questions',
        content: 'Asking basic info.',
        signs: [
          { label: 'What?', description: 'Palms up, hands moving side to side.', meaning: 'What' },
          { label: 'Help', description: 'Fist on palm moving up.', meaning: 'Help' }
        ]
      },
      {
        id: 'c4-l2',
        title: 'Yes and No',
        content: 'Simple affirmative and negative signs.',
        signs: [
          { label: 'Yes', description: 'Fist nodding.', meaning: 'Yes' },
          { label: 'No', description: 'Index and middle fingers tap thumb.', meaning: 'No' }
        ]
      }
    ]
  }
];
