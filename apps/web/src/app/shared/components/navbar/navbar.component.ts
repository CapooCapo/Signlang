import { Component, HostListener } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { ChatService } from '../../../core/services/chat.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  scrolled = false;
  showProfileMenu = false;

  constructor(
    public authService: AuthService,
    public chatService: ChatService
  ) {}

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled = (window.scrollY || 0) > 8;
  }

  logout() {
    this.authService.logout();
  }
}
