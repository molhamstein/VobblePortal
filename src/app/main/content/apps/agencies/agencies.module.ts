import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgenciesService } from './agencies.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [AgenciesService],
  declarations: []
})
export class AgenciesModule { }
