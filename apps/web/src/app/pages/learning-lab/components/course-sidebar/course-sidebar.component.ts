import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course } from '../../models/learning-lab.model';

@Component({
  selector: 'app-course-sidebar',
  templateUrl: './course-sidebar.component.html',
  styleUrls: ['./course-sidebar.component.scss'],
  standalone: false,
})
export class CourseSidebarComponent {
  // Signal Inputs
  courses = input<Course[]>([]);
  currentCourseId = input<string | undefined>(undefined);
  currentLessonId = input<string | undefined>(undefined);
  
  // Output initializers
  selectLesson = output<{
    courseId: string;
    lessonId: string;
  }>();
  
  selectLockedCourse = output<Course>();

  onLessonClick(courseId: string, lessonId: string, isLocked: boolean): void {
    if (!isLocked) {
      this.selectLesson.emit({ courseId, lessonId });
    }
  }

  onCourseHeaderClick(course: Course): void {
    if (course.isLocked) {
      this.selectLockedCourse.emit(course);
    }
  }

  isLessonActive(lessonId: string): boolean {
    return this.currentLessonId() === lessonId;
  }
}
