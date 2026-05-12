import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  standalone: false,
  template: `
    <div class="form-group">
      <label [for]="id">{{ label }}</label>
      <div class="input-wrapper" [class.error]="isInvalid">
        <span class="icon" *ngIf="icon">{{ icon }}</span>
        <input
          [id]="id"
          [type]="type"
          [placeholder]="placeholder"
          [formControl]="control"
        />
      </div>
      <div *ngIf="isInvalid" class="error-message">
        <small *ngIf="control.errors?.['required']">{{ label }} is required.</small>
        <small *ngIf="control.errors?.['email']">Invalid email format.</small>
        <small *ngIf="control.errors?.['minlength']">
          {{ label }} must be at least {{ control.errors?.['minlength'].requiredLength }} characters.
        </small>
        <small *ngIf="control.errors?.['mismatch']">Passwords do not match.</small>
      </div>
    </div>
  `,
  styles: [`
    .form-group { margin-bottom: 20px; }
    label { display: block; margin-bottom: 8px; color: #94a3b8; font-size: 14px; }
    .input-wrapper {
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 0 16px;
      transition: all 0.3s ease;
      
      &.error { border-color: #ef4444; }
      .icon { margin-right: 12px; font-size: 18px; }
      input {
        background: transparent;
        border: none;
        color: white;
        padding: 14px 0;
        width: 100%;
        outline: none;
        font-size: 15px;
        &::placeholder { color: #475569; }
      }
    }
    .error-message { color: #ef4444; margin-top: 6px; font-size: 13px; }
  `]
})
export class FormInputComponent {
  @Input() label: string = '';
  @Input() id: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() icon: string = '';
  @Input() control!: FormControl;

  get isInvalid() {
    return this.control?.invalid && (this.control?.dirty || this.control?.touched);
  }
}
