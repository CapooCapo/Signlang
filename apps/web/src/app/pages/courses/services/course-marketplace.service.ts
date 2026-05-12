import { Injectable, signal, computed } from '@angular/core';
import { MarketplaceCourse } from '../models/course-marketplace.model';
import { MARKETPLACE_COURSES } from '../data/marketplace-courses.data';

@Injectable({
  providedIn: 'root'
})
export class CourseMarketplaceService {
  private _courses = signal<MarketplaceCourse[]>(MARKETPLACE_COURSES);
  
  public courses = computed(() => this._courses());

  getCourseById(id: string): MarketplaceCourse | undefined {
    return this._courses().find(c => c.id === id);
  }

  // Mock Chat Room
  getChatRoomId(courseId: string, userId: string): string {
    return `chat_${courseId}_${userId}`;
  }
}
