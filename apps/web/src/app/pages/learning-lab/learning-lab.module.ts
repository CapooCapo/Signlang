import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearningLabRoutingModule } from './learning-lab-routing.module';

// Pages
import { LearningRoadmapComponent } from './pages/roadmap/course.component';
import { LearningSandboxComponent } from './pages/sandbox/learning-lab.component';

// Components
import { AlphabetGridComponent } from './components/alphabet-grid/alphabet-grid.component';
import { CourseSidebarComponent } from './components/course-sidebar/course-sidebar.component';
import { LessonViewerComponent } from './components/lesson-viewer/lesson-viewer.component';
import { LockedCourseCardComponent } from './components/locked-course-card/locked-course-card.component';
import { ProgressTrackerComponent } from './components/progress-tracker/progress-tracker.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { SignCardComponent } from './components/sign-card/sign-card.component';

@NgModule({
  declarations: [
    LearningRoadmapComponent,
    LearningSandboxComponent,
    AlphabetGridComponent,
    CourseSidebarComponent,
    LessonViewerComponent,
    LockedCourseCardComponent,
    ProgressTrackerComponent,
    QuizComponent,
    SignCardComponent
  ],
  imports: [
    CommonModule,
    LearningLabRoutingModule
  ]
})
export class LearningLabModule { }
