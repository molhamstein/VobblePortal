import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../../../core/modules/shared.module";
import { PerDayComponent } from './per-days/per-day.component';
import { PerUserComponent } from './per-users/per-user.component';
import { PurchasesReportsService } from './purchases-reports.service';

const routes: Routes = [
  {
    path: 'perUser',
    component: PerUserComponent,
    resolve: {
      PurchasesReportsService
    },
    data: { resolverType: 'perUser' }
  },
  {
    path: 'perDay',
    component: PerDayComponent,
    resolve: {
      PurchasesReportsService
    },
    data: { resolverType: 'perDay' }
  }


];



@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers: [PurchasesReportsService],
  declarations: [PerUserComponent,PerDayComponent]
})
export class PurchasesReportsModule { }
