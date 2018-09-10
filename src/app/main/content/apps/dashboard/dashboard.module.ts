import { Routes } from "@angular/router";
import { SharedModule } from "./../../../../core/modules/shared.module";
import { RouterModule } from "@angular/router";
import { DashboardService } from "./dashboard.service";
import { NgModule } from "@angular/core";
import { DashboardComponent } from "./dashboard.component";
import { NgxChartsModule } from "@swimlane/ngx-charts";

const routes: Routes = [
  {
    path: "dashboard",
    component: DashboardComponent,
    resolve: {
      data: DashboardService
    }
  }
];
@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes), NgxChartsModule],
  exports: [RouterModule],
  providers: [DashboardService],
  declarations: [DashboardComponent]
})
export class DashboardModule {}
