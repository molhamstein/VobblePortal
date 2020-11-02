import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../../../core/modules/shared.module";
import { ChatBaseProductsEditComponent } from './chat-base-products-edit/chat-base-products-edit.component';
import { ChatBaseProductsListComponent } from './chat-base-products-list/chat-base-products-list.component';
import { ChatBaseProductsNewComponent } from './chat-base-products-new/chat-base-products-new.component';
import { ChatBasrProductsService } from './chat-base-products.service';
import { ChatProductsEditComponent } from './chat-products-edit/chat-products-edit.component';
import { ChatProductsNewComponent } from './chat-products-new/chat-products-new.component';

const routes: Routes = [
  {
    path: 'list',
    component: ChatBaseProductsListComponent,
    resolve: {
      items: ChatBasrProductsService
    },
    data: { resolverType: 'list', page: 0, itemsPerPage: 50 }
  },
  {
    path: 'new',
    component: ChatBaseProductsNewComponent
  },
  {
    path: 'edit/:id',
    component: ChatBaseProductsEditComponent,
    resolve: {
      data: ChatBasrProductsService
    },
    data: { resolverType: 'view' }
  },
  {
    path: 'new-product/:id',
    component: ChatProductsNewComponent,
    resolve: {
      data: ChatBasrProductsService
    },
    data: { resolverType: 'view' }
  },
  {
    path: 'edit-product/:id',
    component: ChatProductsEditComponent,
    resolve: {
      data: ChatBasrProductsService
    },
    data: { resolverType: 'viewProduct' }
  }
  // {
  //   path     : 'view/:id',
  //   component: ProductsViewComponent,
  //   resolve  : {
  //     data: ProductsService
  //   },
  //   data: {resolverType: 'view'}
  // }
];



@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers: [ChatBasrProductsService],
  declarations: [ChatProductsEditComponent, ChatBaseProductsListComponent, ChatBaseProductsNewComponent, ChatBaseProductsEditComponent, ChatProductsNewComponent]
})
export class ChatBaseProductsModule { }
