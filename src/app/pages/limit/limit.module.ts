import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LimitComponent } from './limit.component';
import { LimitRoutingModule } from './limit-routing.module';



@NgModule({
  declarations: [
    LimitComponent
  ],
  imports: [
    CommonModule,
    LimitRoutingModule
  ]
})
export class LimitModule { }
