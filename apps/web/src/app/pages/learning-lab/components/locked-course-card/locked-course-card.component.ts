import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course } from '../../models/learning-lab.model';

@Component({
  selector: 'app-locked-course-card',
  templateUrl: './locked-course-card.component.html',
  styleUrls: ['./locked-course-card.component.scss'],
  standalone: false,
})
export class LockedCourseCardComponent {
  @Input() course!: Course;
}
