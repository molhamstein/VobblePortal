import { NgModule } from '@angular/core';
import {SharedModule} from "../../../../core/modules/shared.module";
import {TypeGoodsService} from "./type-goods.service";

@NgModule({
  imports: [
    SharedModule
  ],
  providers:[TypeGoodsService],
  declarations: []
})
export class TypeGoodsModule { }
