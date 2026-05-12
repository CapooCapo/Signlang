import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Lesson } from '../../models/learning-lab.model';
import { SignCardComponent } from '../sign-card/sign-card.component';
import { QuizComponent } from '../quiz/quiz.component';
import { AlphabetGridComponent } from '../alphabet-grid/alphabet-grid.component';

@Component({
  selector: 'app-lesson-viewer',
  templateUrl: './lesson-viewer.component.html',
  styleUrls: ['./lesson-viewer.component.scss'],
  standalone: false,
})
export class LessonViewerComponent {
  lesson = input.required<Lesson>();
  isLastLesson = input(false);
  
  complete = output<void>();
  next = output<void>();

  onComplete(): void {
    this.complete.emit();
  }

  onNext(): void {
    this.next.emit();
  }
}
