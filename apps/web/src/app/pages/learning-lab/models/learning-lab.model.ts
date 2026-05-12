export interface SignItem {
  label: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  gestureSteps?: string[];
  meaning?: string;
  usageExample?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

export interface PracticeExercise {
  id: string;
  title: string;
  type: 'spelling' | 'matching' | 'gesture';
  content: any;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  signs?: SignItem[];
  quiz?: Quiz;
  practice?: PracticeExercise;
  isCompleted?: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  isLocked: boolean;
  progress: number;
  xpPoints: number;
}

export interface UserProgress {
  completedLessonIds: string[];
  unlockedCourseIds: string[];
  currentCourseId: string;
  currentLessonId: string;
  xp: number;
  streak: number;
  lastVisit: string;
}
