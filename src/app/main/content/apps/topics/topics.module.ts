import { TopicsNewComponent } from './topics-new/topics-new.component';
import { NgModule } from '@angular/core';
import {TopicsService} from "./topics.service";
import {SharedModule} from "../../../../core/modules/shared.module";
import {Routes, RouterModule} from "@angular/router";
import { TopicsListComponent } from './topics-list/topics-list.component';
import { TopicsEditComponent } from './topics-edit/topics-edit.component';
import { TopicsViewComponent } from './topics-view/topics-view.component';

const routes: Routes = [
  {
    path     : 'list',
    component: TopicsListComponent,
    resolve  : {
      items: TopicsService
    },
    data: {resolverType: 'list', page:0, itemsPerPage:100}
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
