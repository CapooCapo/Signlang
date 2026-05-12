import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Quiz, QuizQuestion } from '../../models/learning-lab.model';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
  standalone: false,
})
export class QuizComponent {
  @Input() quiz!: Quiz;
  @Output() completed = new EventEmitter<void>();

  currentQuestionIndex = 0;
  selectedOption: string | null = null;
  isAnswered = false;
  isCorrect = false;
  score = 0;
  showResults = false;

  get currentQuestion(): QuizQuestion {
    return this.quiz.questions[this.currentQuestionIndex];
  }

  selectOption(option: string): void {
    if (this.isAnswered) return;
    this.selectedOption = option;
  }

  submitAnswer(): void {
    if (!this.selectedOption || this.isAnswered) return;
    
    this.isAnswered = true;
    this.isCorrect = this.selectedOption === this.currentQuestion.correctAnswer;
    
    if (this.isCorrect) {
      this.score++;
    }
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.quiz.questions.length - 1) {
      this.currentQuestionIndex++;
      this.resetState();
    } else {
      this.showResults = true;
      if (this.score === this.quiz.questions.length) {
        this.completed.emit();
      }
    }
  }

  resetState(): void {
    this.selectedOption = null;
    this.isAnswered = false;
    this.isCorrect = false;
  }

  restart(): void {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.showResults = false;
    this.resetState();
  }
}
