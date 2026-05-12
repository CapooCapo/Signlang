import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LearningRoadmapComponent } from './pages/roadmap/course.component';
import { LearningSandboxComponent } from './pages/sandbox/learning-lab.component';

const routes: Routes = [
  { path: '', redirectTo: 'roadmap', pathMatch: 'full' },
  { path: 'roadmap', component: LearningRoadmapComponent },
  { path: 'sandbox', component: LearningSandboxComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LearningLabRoutingModule { }
