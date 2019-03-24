import { NgModule } from '@angular/core';
import {Routes, RouterModule} from "@angular/router";
import {SharedModule} from "../../../../core/modules/shared.module";
import { TestBottlesService } from './test-bottles.service';
import { TestBottlesListComponent } from './test-bottles-list/test-bottles-list.component';

const routes: Routes = [
  {
    path     : 'list',
    component: TestBottlesListComponent,
    resolve  : {
      data: TestBottlesService
    },
    // data: {resolverType: 'list', page:0, itemsPerPage:10}
  }
  // {
  //   path     : 'new',
  //   component: BottlesNewComponent
  // },
  // {
  //   path     : 'edit/:id',
  //   component: BottlesEditComponent,
  //   resolve  : {
  //     data: BottlesService
  //   },
  //   data: {resolverType: 'view'}
  // },
  // {
  //   path     : 'view/:id',
  //   component: BottlesViewComponent,
  //   resolve  : {
  //     data: BottlesService
  //   },
  //   data: {resolverType: 'view'}
  // },
  // {
  //   path     : '',
  //   pathMatch: 'full',
  //   redirectTo: 'list'
  // },
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers   : [
    TestBottlesService
  ],
  declarations: [TestBottlesListComponent]
})
export class TestBottlesModule { }
