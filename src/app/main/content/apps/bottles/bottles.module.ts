import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../../../core/modules/shared.module";
import { BottlesEditComponent } from './bottles-edit/bottles-edit.component';
import { BottlesListComponent } from './bottles-list/bottles-list.component';
import { BottlesNewComponent } from './bottles-new/bottles-new.component';
import { BottlesViewModalComponent } from './bottles-view-modal/bottles-view-modal.component';
import { BottlesViewComponent } from './bottles-view/bottles-view.component';
import { BottlesService } from "./bottles.service";

const routes: Routes = [
  {
    path     : 'list',
    component: BottlesListComponent,
    resolve  : {
      data: BottlesService
    },
    data: {resolverType: 'list', page:0, itemsPerPage:50}
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

  entryComponents: [
    BottlesViewModalComponent
  ],

  providers   : [
    BottlesService
  ],
  declarations: [BottlesListComponent, BottlesNewComponent, BottlesEditComponent, BottlesViewComponent, BottlesViewModalComponent]
})
export class BottlesModule { }
