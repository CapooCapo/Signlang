import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course, Lesson } from '../../models/learning-lab.model';
import { LearningLabService } from '../../services/learning-lab.service';
import { CourseSidebarComponent } from '../../components/course-sidebar/course-sidebar.component';
import { LessonViewerComponent } from '../../components/lesson-viewer/lesson-viewer.component';
import { AlphabetGridComponent } from '../../components/alphabet-grid/alphabet-grid.component';

@Component({
  selector: 'app-learning-sandbox',
  templateUrl: './learning-lab.component.html',
  styleUrls: ['./learning-lab.component.scss'],
  standalone: false,
})
export class LearningSandboxComponent {
  courses = this.learningLabService.labCourses;
  
  activeCourseId = signal<string>('course-1');
  activeLessonId = signal<string>('c1-l1');
  
  selectedLesson = computed(() => {
    const course = this.courses().find(c => c.id === this.activeCourseId());
    return course?.lessons.find(l => l.id === this.activeLessonId());
  });

  constructor(private learningLabService: LearningLabService) {}

  onSelectLesson(event: {courseId: string, lessonId: string}): void {
    this.activeCourseId.set(event.courseId);
    this.activeLessonId.set(event.lessonId);
  }
}
