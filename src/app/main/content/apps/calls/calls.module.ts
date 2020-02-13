import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../../core/modules/shared.module';
import { UsersService } from '../users/users.service';
import { CallsListComponent } from './calls-list/calls-list.component';
import { CallsService } from './calls.service';

const routes: Routes = [
  {
      path: "list",
      component: CallsListComponent,
      resolve: {
          items: CallsService
      },
      data: { resolverType: "list", page: 0, itemsPerPage: 50 }
  }
]

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers: [CallsService, UsersService],
  declarations: [CallsListComponent]
})
export class CallsModule { }
