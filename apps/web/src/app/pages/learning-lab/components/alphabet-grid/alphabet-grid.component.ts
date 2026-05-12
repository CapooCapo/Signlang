import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alphabet-grid',
  templateUrl: './alphabet-grid.component.html',
  styleUrls: ['./alphabet-grid.component.scss'],
  standalone: false,
})
export class AlphabetGridComponent {
  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  getHandSignDescription(letter: string): string {
    const descriptions: {[key: string]: string} = {
      'A': 'Closed fist, thumb outside',
      'B': 'Open palm, thumb tucked',
      'C': 'Curved hand like a C',
      'D': 'Index up, others touch thumb',
      'E': 'Claw-like fingers on thumb',
    };
    return descriptions[letter] || 'Visual hand sign representation';
  }
}
