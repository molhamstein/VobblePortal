import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../../../core/modules/shared.module";
import { BlockListComponent } from './block-list/block-list.component';
import { BlockService } from './block.service';

const routes: Routes = [
  {
    path     : 'list',
    component: BlockListComponent,
    resolve  : {
      items: BlockService
    },
    data: {resolverType: 'list', page:0, itemsPerPage:50}
  }
 
];



@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers:[BlockService],
  declarations: [BlockListComponent]
})
export class BlockModule { }
