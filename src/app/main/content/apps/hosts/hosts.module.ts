import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router/src/config';
import { SharedModule } from '../../../../core/modules/shared.module';
import { UsersService } from '../users/users.service';
import { HostsListComponent } from './hosts-list/hosts-list.component';
import { HostsService } from './hosts.service';



const routes: Routes = [
  {
      path: "list",
      component: HostsListComponent,
      resolve: {
          items: HostsService
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
  providers: [HostsService, UsersService],
  declarations: [HostsListComponent]
})
export class HostsModule { }
