import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { SharedModule } from "./../../../../core/modules/shared.module";
import { ExtendMessageComponent } from "./extend-message.component";
import { ExtendMessageService } from "./extend-message.service";

const routes: Routes = [
  {
    path: "extend-message",
    component: ExtendMessageComponent,
    resolve: {
      data: ExtendMessageService
    },
    data: {
      resolverType: "list", page: 0, itemsPerPage: 50
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
