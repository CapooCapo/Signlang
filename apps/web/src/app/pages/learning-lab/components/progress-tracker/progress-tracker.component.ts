import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProgress } from '../../models/learning-lab.model';

@Component({
  selector: 'app-progress-tracker',
  templateUrl: './progress-tracker.component.html',
  styleUrls: ['./progress-tracker.component.scss'],
  standalone: false,
})
export class ProgressTrackerComponent {
  @Input() progress: UserProgress | null = null;
}
