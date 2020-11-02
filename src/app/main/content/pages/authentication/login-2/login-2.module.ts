import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../../core/modules/shared.module';
import {RouterModule} from '@angular/router';

import {FuseLogin2Component} from './login-2.component';

const routes = [
  {
    path: 'auth/login',
    component: FuseLogin2Component
  }
];

@NgModule({
  declarations: [
    FuseLogin2Component
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
})

export class Login2Module {

}
