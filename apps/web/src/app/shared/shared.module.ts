import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormInputComponent } from './components/form-input/form-input.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { NotificationBellComponent } from './components/notification-bell/notification-bell.component';
import { ChatDrawerComponent } from './components/chat-drawer/chat-drawer.component';
import { ChatWindowComponent } from './components/chat-window/chat-window.component';

@NgModule({
  declarations: [
    FormInputComponent,
    NavbarComponent,
    FooterComponent,
    NotificationBellComponent,
    ChatDrawerComponent,
    ChatWindowComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    FormInputComponent,
    NavbarComponent,
    FooterComponent,
    NotificationBellComponent,
    ChatDrawerComponent,
    ChatWindowComponent
  ]
})
export class SharedModule { }
