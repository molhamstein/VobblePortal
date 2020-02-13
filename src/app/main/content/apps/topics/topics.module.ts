import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../../../core/modules/shared.module";
import { TopicsEditComponent } from './topics-edit/topics-edit.component';
import { TopicsListComponent } from './topics-list/topics-list.component';
import { TopicsNewComponent } from './topics-new/topics-new.component';
import { TopicsViewComponent } from './topics-view/topics-view.component';
import { TopicsService } from "./topics.service";

const routes: Routes = [
  {
    path     : 'list',
    component: TopicsListComponent,
    resolve  : {
      items: TopicsService
    },
    data: {resolverType: 'list', page:0, itemsPerPage:50}
  },
  {
    path     : 'new',
    component: TopicsNewComponent
  },
  {
    path     : 'edit/:id',
    component: TopicsEditComponent,
    resolve  : {
      data: TopicsService
    },
    data: {resolverType: 'view'}
  },
  {
    path     : 'view/:id',
    component: TopicsViewComponent,
    resolve  : {
      data: TopicsService
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
  providers:[TopicsService],
  declarations: [TopicsListComponent, TopicsNewComponent, TopicsEditComponent, TopicsViewComponent]
})
export class TopicsModule { }
