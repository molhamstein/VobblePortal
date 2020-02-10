import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgenciesService } from './agencies.service';
import { AddAgencyComponent } from './add-agency/add-agency.component';
import { EditAgencyComponent } from './edit-agency/edit-agency.component';
import { ListAgencyComponent } from './list-agency/list-agency.component';
import { SharedModule } from '../../../../core/modules/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { ViewAgencyComponent } from './view-agency/view-agency.component';


const routes: Routes = [
  {
    path     : 'list',
    component: ListAgencyComponent,
    resolve  : {
      data: AgenciesService
    },
    data: {resolverType: 'list', page:0, itemsPerPage:50}
  },
  {
    path     : 'new',
    component: AddAgencyComponent
  },
  {
    path     : 'edit/:id',
    component: EditAgencyComponent,
    resolve  : {
      data: AgenciesService
    },
    data: {resolverType: 'view'}
  },
  {
    path     : 'view/:id',
    component: ViewAgencyComponent,
    resolve  : {
      data: AgenciesService
    },
    data: {resolverType: 'view'}
  },
  {
    path     : '',
    pathMatch: 'full',
    redirectTo: 'list'
  },
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers: [AgenciesService],
  declarations: [AddAgencyComponent, EditAgencyComponent, ListAgencyComponent, ViewAgencyComponent]
})
export class AgenciesModule { }
