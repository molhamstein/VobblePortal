import { NgModule } from '@angular/core';
import {SharedModule} from "../../../../core/modules/shared.module";
import {ReportTypesService} from "./report-types.service";

@NgModule({
  imports: [
    SharedModule
  ],
  providers:[ReportTypesService],
  declarations: []
})
export class ReportTypesModule { }
