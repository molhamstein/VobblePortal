import { NgModule } from '@angular/core';
import { BottlesListComponent } from './bottles-list/bottles-list.component';
import { BottlesNewComponent } from './bottles-new/bottles-new.component';
import { BottlesEditComponent } from './bottles-edit/bottles-edit.component';
import { BottlesViewComponent } from './bottles-view/bottles-view.component';
import {Routes, RouterModule} from "@angular/router";
import {SharedModule} from "../../../../core/modules/shared.module";
import {BottlesService} from "./bottles.service";

const routes: Routes = [
  {
    path     : 'list',
    component: BottlesListComponent,
    resolve  : {
      data: BottlesService
    },
    data: {resolverType: 'list', page:0, itemsPerPage:100}
  },
  {
    path     : 'new',
    component: BottlesNewComponent
  },
  {
    path     : 'edit/:id',
    component: BottlesEditComponent,
    resolve  : {
      data: BottlesService
    },
    data: {resolverType: 'view'}
  },
  {
    path     : 'view/:id',
    component: BottlesViewComponent,
    resolve  : {
      data: BottlesService
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
    BottlesService
  ],
  declarations: [BottlesListComponent, BottlesNewComponent, BottlesEditComponent, BottlesViewComponent]
})
export class BottlesModule { }
