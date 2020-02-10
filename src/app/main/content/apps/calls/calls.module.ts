import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallsService } from './calls.service';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../../core/modules/shared.module';
import { CallsListComponent } from './calls-list/calls-list.component';
import { UsersService } from '../users/users.service';

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
