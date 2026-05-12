import { Component, OnInit, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course, Lesson } from '../../models/learning-lab.model';
import { LearningLabService } from '../../services/learning-lab.service';
import { CourseSidebarComponent } from '../../components/course-sidebar/course-sidebar.component';
import { LessonViewerComponent } from '../../components/lesson-viewer/lesson-viewer.component';
import { LockedCourseCardComponent } from '../../components/locked-course-card/locked-course-card.component';
import { ProgressTrackerComponent } from '../../components/progress-tracker/progress-tracker.component';

@Component({
  selector: 'app-learning-roadmap',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
  standalone: false,
})
export class LearningRoadmapComponent implements OnInit {
  courses = this.learningLabService.courses;
  progress = this.learningLabService.progress;
  
  selectedLockedCourse = signal<Course | undefined>(undefined);
  
  currentCourseId = computed(() => this.progress()?.currentCourseId);
  currentLessonId = computed(() => this.progress()?.currentLessonId);
  
  selectedLesson = computed(() => {
    const courseId = this.currentCourseId();
    const lessonId = this.currentLessonId();
    if (!courseId || !lessonId) return undefined;
    
    const course = this.courses().find(c => c.id === courseId);
    return course?.lessons.find(l => l.id === lessonId);
  });

  isLastLesson = computed(() => {
    const lessonId = this.currentLessonId();
    const courseId = this.currentCourseId();
    if (!lessonId || !courseId) return false;

    const course = this.courses().find(c => c.id === courseId);
    if (!course) return false;

    const currentIndex = course.lessons.findIndex(l => l.id === lessonId);
    return currentIndex === course.lessons.length - 1;
  });

  constructor(private learningLabService: LearningLabService) {
    effect(() => {
      if (this.selectedLesson()) {
        this.selectedLockedCourse.set(undefined);
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {}

  onSelectLesson(event: {courseId: string, lessonId: string}): void {
    this.selectedLockedCourse.set(undefined);
    this.learningLabService.setCurrentLesson(event.courseId, event.lessonId);
  }

  onSelectLockedCourse(course: Course): void {
    this.selectedLockedCourse.set(course);
  }

  onCompleteLesson(): void {
    const lessonId = this.currentLessonId();
    if (lessonId) {
      this.learningLabService.completeLesson(lessonId);
    }
  }

  onNextLesson(): void {
    const currentCourses = this.courses();
    const courseId = this.currentCourseId();
    const lessonId = this.currentLessonId();

    const currentCourse = currentCourses.find(c => c.id === courseId);
    if (!currentCourse) return;

    const currentIndex = currentCourse.lessons.findIndex(l => l.id === lessonId);
    if (currentIndex < currentCourse.lessons.length - 1) {
      const nextLesson = currentCourse.lessons[currentIndex + 1];
      this.onSelectLesson({ courseId: currentCourse.id, lessonId: nextLesson.id });
    } else {
      const nextCourseIndex = currentCourses.findIndex(c => c.id === courseId) + 1;
      if (nextCourseIndex < currentCourses.length) {
        const nextCourse = currentCourses[nextCourseIndex];
        if (!nextCourse.isLocked) {
          this.onSelectLesson({ courseId: nextCourse.id, lessonId: nextCourse.lessons[0].id });
        }
      }
    }
  }
}
