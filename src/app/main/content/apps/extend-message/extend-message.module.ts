import { Routes } from "@angular/router";
import { SharedModule } from "./../../../../core/modules/shared.module";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { ExtendMessageService } from "./extend-message.service";
import { ExtendMessageComponent } from "./extend-message.component";

const routes: Routes = [
  {
    path: "extend-message",
    component: ExtendMessageComponent,
    resolve: {
      data: ExtendMessageService
    }
  }
];
@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes), NgxChartsModule],
  exports: [RouterModule],
  providers: [ExtendMessageService],
  declarations: [ExtendMessageComponent]
})
export class ExtendMessageModule {}
