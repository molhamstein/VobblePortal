import { NgModule } from '@angular/core';

import { Login2Module } from './authentication/login-2/login-2.module';

import { Register2Module } from './authentication/register-2/register-2.module';

import { ForgotPassword2Module } from './authentication/forgot-password-2/forgot-password-2.module';

//import { ResetPassword2Module } from './authentication/reset-password-2/reset-password-2.module';
import { LockModule } from './authentication/lock/lock.module';
//import { MailConfirmModule } from './authentication/mail-confirm/mail-confirm.module';
//import { ComingSoonModule } from './coming-soon/coming-soon.module';
import { Error404Module } from './errors/404/error-404.module';
//import { Error500Module } from './errors/500/error-500.module';


@NgModule({
    imports: [
        // Auth

        Login2Module,

        Register2Module,

        ForgotPassword2Module,

       // ResetPassword2Module,
        LockModule,
       // MailConfirmModule,

        // Coming-soon
       // ComingSoonModule,

        // Errors
        Error404Module,
       // Error500Module,

    ]
})
export class PagesModule
{
}
