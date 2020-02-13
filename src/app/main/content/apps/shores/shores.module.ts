import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../../../core/modules/shared.module";
import { ShoresEditComponent } from './shores-edit/shores-edit.component';
import { ShoresListComponent } from './shores-list/shores-list.component';
import { ShoresNewComponent } from './shores-new/shores-new.component';
import { ShoresViewComponent } from './shores-view/shores-view.component';
import { ShoresService } from "./shores.service";


const routes: Routes = [
  {
    path     : 'list',
    component: ShoresListComponent,
    resolve  : {
      data: ShoresService
    },
    data: {resolverType: 'list', page:0, itemsPerPage:50}
  },
  {
    path     : 'new',
    component: ShoresNewComponent
  },
  {
    path     : 'edit/:id',
    component: ShoresEditComponent,
    resolve  : {
      data: ShoresService
    },
    data: {resolverType: 'view'}
  },
  {
    path     : 'view/:id',
    component: ShoresViewComponent,
    resolve  : {
      data: ShoresService
    },
    data: {resolverType: 'view'}
  },
  {
    path     : '',
    pathMatch: 'full',
    redirectTo: 'list'
  },
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers   : [
    ShoresService
  ],
  declarations: [ShoresListComponent, ShoresNewComponent, ShoresEditComponent, ShoresViewComponent]
})
export class ShoresModule { }
