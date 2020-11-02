import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../../../core/modules/shared.module";
import { ProductsEditComponent } from './products-edit/products-edit.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { ProductsNewComponent } from './products-new/products-new.component';
import { ProductsViewComponent } from './products-view/products-view.component';
import { ProductsService } from "./products.service";

const routes: Routes = [
  {
    path     : 'list',
    component: ProductsListComponent,
    resolve  : {
      items: ProductsService
    },
    data: {resolverType: 'list', page:0, itemsPerPage:50}
  },
  {
    path     : 'new',
    component: ProductsNewComponent
  },
  {
    path     : 'edit/:id',
    component: ProductsEditComponent,
    resolve  : {
      data: ProductsService
    },
    data: {resolverType: 'view'}
  },
  {
    path     : 'view/:id',
    component: ProductsViewComponent,
    resolve  : {
      data: ProductsService
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
  providers:[ProductsService],
  declarations: [ProductsListComponent, ProductsNewComponent, ProductsEditComponent, ProductsViewComponent]
})
export class ProductsModule { }
