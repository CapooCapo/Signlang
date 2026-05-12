import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LayoutComponent } from './layout.component';
import { LayoutRoutingModule } from './layout-routing-module';

@NgModule({
  declarations: [
    LayoutComponent,
    HomePageComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    LayoutRoutingModule,
    RouterModule,
  ],
  exports: [
    LayoutComponent,
  ]
})
export class LayoutModule { }
