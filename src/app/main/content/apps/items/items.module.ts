import { NgModule } from '@angular/core';
import { ItemsListComponent } from './items-list/items-list.component';
import { ItemsNewComponent } from './items-new/items-new.component';
import { ItemsEditComponent } from './items-edit/items-edit.component';
import { ItemsViewComponent } from './items-view/items-view.component';
import {ItemsService} from "./items.service";
import {Routes, RouterModule} from "@angular/router";
import {SharedModule} from "../../../../core/modules/shared.module";

const routes: Routes = [
  {
    path     : 'list',
    component: ItemsListComponent,
    resolve  : {
      data: ItemsService
    },
    data: {resolverType: 'list', page:0, itemsPerPage:10}
  },
  {
    path     : 'new',
    component: ItemsNewComponent
  },
  {
    path     : 'edit/:id',
    component: ItemsEditComponent,
    resolve  : {
      data: ItemsService
    },
    data: {resolverType: 'view'}
  },
  {
    path     : 'view/:id',
    component: ItemsViewComponent,
    resolve  : {
      data: ItemsService
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
    ItemsService
  ],
  declarations: [ItemsListComponent, ItemsNewComponent, ItemsEditComponent, ItemsViewComponent]
})
export class ItemsModule { }
