import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../../../core/modules/shared.module";
import { TestBottlesListComponent } from './test-bottles-list/test-bottles-list.component';
import { TestBottlesNewComponent } from './test-bottles-new/test-bottles-new.component';
import { TestBottlesService } from './test-bottles.service';

const routes: Routes = [
  {
    path     : 'list',
    component: TestBottlesListComponent,
    resolve  : {
      data: TestBottlesService
    },
    // data: {resolverType: 'list', page:0, itemsPerPage:50}
  },
  {
    path     : 'new',
    component: TestBottlesNewComponent,
    resolve  : {
      data: TestBottlesService
    },
    // data: {resolverType: 'list', page:0, itemsPerPage:50}
  }
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
  declarations: [TestBottlesListComponent,TestBottlesNewComponent]
})
export class TestBottlesModule { }
