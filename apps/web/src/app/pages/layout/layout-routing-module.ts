import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home-page';
import { Layout } from './layout';
import { Course } from './pages/course/course';

const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', component: HomePage, pathMatch: 'full' },
      // thêm trang khác:
        { path: 'course', component: Course}
      // { path: 'learn', component: LearnPage },
      // { path: 'profile', component: ProfilePage },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
