import { NgModule } from '@angular/core';
import { ReportsListComponent } from './reports-list/reports-list.component';
import { ReportsNewComponent } from './reports-new/reports-new.component';
import { ReportsEditComponent } from './reports-edit/reports-edit.component';
import { ReportsViewComponent } from './reports-view/reports-view.component';
import {Routes, RouterModule} from "@angular/router";
import {ReportsService} from "./reports.service";
import {SharedModule} from "../../../../core/modules/shared.module";

const routes: Routes = [
  {
    path     : 'list',
    component: ReportsListComponent,
    resolve  : {
      items: ReportsService
    },
    data: {resolverType: 'list', page:0, itemsPerPage:10}
  },
  {
    path     : 'new',
    component: ReportsNewComponent
  },
  {
    path     : 'edit/:id',
    component: ReportsEditComponent,
    resolve  : {
      data: ReportsService
    },
    data: {resolverType: 'view'}
  },
  {
    path     : 'view/:id',
    component: ReportsViewComponent,
    resolve  : {
      data: ReportsService
    },
    data: {resolverType: 'view'}
  }
];



@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers:[ReportsService],
  declarations: [ReportsListComponent, ReportsNewComponent, ReportsEditComponent, ReportsViewComponent]
})
export class ReportsModule { }
