import { Routes } from "@angular/router";
import { SharedModule } from "./../../../../core/modules/shared.module";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { GiftItemsService } from "./gift-items.service";
import { GiftItemComponent } from "./gift-items.component";

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
