import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { SharedModule } from "./../../../../core/modules/shared.module";
import { DashboardComponent } from "./dashboard.component";
import { DashboardService } from "./dashboard.service";

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
