import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';

import { Footer } from '../../share/components/footer/footer';
import { HomePage } from './pages/home-page/home-page';
import { Layout } from './layout';
import { RouterModule } from '@angular/router';
import { LayoutRoutingModule } from './layout-routing-module';
import { Course } from './pages/course/course';
import { SharedModule } from './shared/shared-module';

@NgModule({
  declarations: [
    Layout,
    Footer,
    HomePage,
    Course,
  ],
  imports: [
    SharedModule,
    CommonModule,
    LayoutRoutingModule,
    RouterModule,
    DecimalPipe,
    DatePipe,
  ],
  schemas: [
   //CUSTOM_ELEMENTS_SCHEMA,
    //NO_ERRORS_SCHEMA,
  ],
  exports: [
    Layout,
    Footer,
  ]
})
export class LayoutModule { }
