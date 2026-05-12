import { Injectable, signal, computed } from '@angular/core';
import { Course, UserProgress, Lesson } from '../models/learning-lab.model';
import { LEARNING_COURSES } from '../data/learning-lab.data';

@Injectable({
  providedIn: 'root'
})
export class LearningLabService {
  private readonly STORAGE_KEY = 'signlang_user_progress';
  
  // State as Signals
  private _progress = signal<UserProgress | null>(null);
  
  // Progress Signal
  public progress = computed(() => this._progress());
  
  // Courses Signal (with Locking Logic)
  public courses = computed(() => {
    const p = this._progress();
    if (!p) return [];

    return LEARNING_COURSES.map(course => {
      const isUnlocked = p.unlockedCourseIds.includes(course.id);
      const lessons = course.lessons.map(lesson => ({
        ...lesson,
        isCompleted: p.completedLessonIds.includes(lesson.id)
      }));
      
      const completedCount = lessons.filter(l => l.isCompleted).length;
      const progressPercent = Math.round((completedCount / (lessons.length || 1)) * 100);

      return {
        ...course,
        isLocked: !isUnlocked,
        lessons,
        progress: progressPercent
      };
    });
  });

  // Lab Courses Signal (Everything Unlocked)
  public labCourses = computed(() => {
    return LEARNING_COURSES.map(course => ({
      ...course,
      isLocked: false,
      progress: 100,
      lessons: course.lessons.map(l => ({ ...l, isCompleted: true }))
    }));
  });

  constructor() {
    this.initData();
  }

  private initData(): void {
    const savedProgress = localStorage.getItem(this.STORAGE_KEY);
    let progress: UserProgress;

    if (savedProgress) {
      progress = JSON.parse(savedProgress);
    } else {
      progress = {
        completedLessonIds: [],
        unlockedCourseIds: ['course-1'],
        currentCourseId: 'course-1',
        currentLessonId: 'c1-l1',
        xp: 0,
        streak: 1,
        lastVisit: new Date().toISOString()
      };
      this.saveProgress(progress);
    }

    this._progress.set(progress);
  }

  private saveProgress(progress: UserProgress): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
  }

  completeLesson(lessonId: string): void {
    const currentProgress = this._progress();
    if (!currentProgress || currentProgress.completedLessonIds.includes(lessonId)) return;

    // 1. Add to completed lessons
    const updatedProgress: UserProgress = {
      ...currentProgress,
      completedLessonIds: [...currentProgress.completedLessonIds, lessonId],
      xp: currentProgress.xp + 50
    };

    // 2. Logic to unlock next course if all lessons in current are done
    const allCourses = this.courses();
    const currentCourse = allCourses.find(c => c.lessons.some(l => l.id === lessonId));
    
    if (currentCourse) {
      const lessonsInCourse = currentCourse.lessons.map(l => l.id);
      const allLessonsCompleted = lessonsInCourse.every(id => 
        id === lessonId || updatedProgress.completedLessonIds.includes(id)
      );

      if (allLessonsCompleted) {
        const nextCourseIndex = allCourses.findIndex(c => c.id === currentCourse.id) + 1;
        if (nextCourseIndex < allCourses.length) {
          const nextCourseId = allCourses[nextCourseIndex].id;
          if (!updatedProgress.unlockedCourseIds.includes(nextCourseId)) {
            updatedProgress.unlockedCourseIds.push(nextCourseId);
          }
        }
      }
    }

    this._progress.set(updatedProgress);
    this.saveProgress(updatedProgress);
  }

  setCurrentLesson(courseId: string, lessonId: string): void {
    const currentProgress = this._progress();
    if (!currentProgress) return;

    const updatedProgress = {
      ...currentProgress,
      currentCourseId: courseId,
      currentLessonId: lessonId
    };

    this._progress.set(updatedProgress);
    this.saveProgress(updatedProgress);
  }
}
