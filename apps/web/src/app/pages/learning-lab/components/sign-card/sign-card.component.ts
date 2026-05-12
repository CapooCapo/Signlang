import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignItem } from '../../models/learning-lab.model';

@Component({
  selector: 'app-sign-card',
  templateUrl: './sign-card.component.html',
  styleUrls: ['./sign-card.component.scss'],
  standalone: false,
})
export class SignCardComponent {
  @Input() sign!: SignItem;
}
