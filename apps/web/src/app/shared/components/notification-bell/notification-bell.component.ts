import { Component, inject, OnInit } from '@angular/core';
import { CommunityService } from '../../../core/services/community.service';

@Component({
  selector: 'app-notification-bell',
  templateUrl: './notification-bell.component.html',
  styleUrls: ['./notification-bell.component.scss'],
  standalone: false
})
export class NotificationBellComponent implements OnInit {
  private communityService = inject(CommunityService);
  
  notifications = this.communityService.notifications;
  unreadCount = this.communityService.unreadNotifCount;
  showDropdown = false;

  ngOnInit() {
    this.communityService.getNotifications();
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
    if (this.showDropdown) {
      this.communityService.markAllRead();
    }
  }
}
