import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseListComponent } from './pages/course-list.component';
import { CourseDetailComponent } from './pages/course-detail.component';

const routes: Routes = [
  { path: '', component: CourseListComponent },
  { path: ':id', component: CourseDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoursesRoutingModule { }
