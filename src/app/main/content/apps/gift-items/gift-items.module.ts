import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { SharedModule } from "./../../../../core/modules/shared.module";
import { GiftItemComponent } from "./gift-items.component";
import { GiftItemsService } from "./gift-items.service";

const routes: Routes = [
  {
    path: "gift-items",
    component: GiftItemComponent,
    resolve: {
      data: GiftItemsService
    }
  }
];
@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes), NgxChartsModule],
  exports: [RouterModule],
  providers: [GiftItemsService],
  declarations: [GiftItemComponent]
})
export class GiftItemModule {}
