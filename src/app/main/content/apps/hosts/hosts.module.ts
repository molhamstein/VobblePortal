import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HostsListComponent } from './hosts-list/hosts-list.component';
import { HostsService } from './hosts.service';
import { Routes } from '@angular/router/src/config';
import { SharedModule } from '../../../../core/modules/shared.module';
import { RouterModule } from '@angular/router';
import { UsersService } from '../users/users.service';



const routes: Routes = [
  {
      path: "list",
      component: HostsListComponent,
      resolve: {
          items: HostsService
      },
      data: { resolverType: "list", page: 0, itemsPerPage: 100 }
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
