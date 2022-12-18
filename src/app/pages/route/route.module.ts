import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteComponent } from './route.component';
import { RouteRoutingModule } from './route-routing.module';
import { AddRouteComponent } from './add-route/add-route.component';



@NgModule({
  declarations: [
    RouteComponent,
    AddRouteComponent
  ],
  imports: [
    CommonModule,
    RouteRoutingModule
  ]
})
export class RouteModule { }
