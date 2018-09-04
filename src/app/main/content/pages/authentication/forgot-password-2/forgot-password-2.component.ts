import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '../../../../../core/services/config.service';
import { fuseAnimations } from '../../../../../core/animations';
import {AuthService} from "../auth.service";
import {HelpersService} from "../../../../shared/helpers.service";
import {FuseSplashScreenService} from "../../../../../core/services/splash-screen.service";
import {Router} from "@angular/router";

@Component({
    selector   : 'fuse-forgot-password-2',
    templateUrl: './forgot-password-2.component.html',
    styleUrls  : ['./forgot-password-2.component.scss'],
    animations : fuseAnimations
})
export class FuseForgotPassword2Component implements OnInit
{
    forgotPasswordForm: FormGroup;
    forgotPasswordFormErrors: any;

    constructor(
        private fuseConfig: FuseConfigService,
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private loadingScreen: FuseSplashScreenService,
        private helpers: HelpersService
    )
    {
        this.fuseConfig.setSettings({
            layout: {
                navigation: 'none',
                toolbar   : 'none',
                footer    : 'none'
            }
        });

        this.forgotPasswordFormErrors = {
            email: {required: true}
        };
    }

    ngOnInit()
    {
        this.forgotPasswordForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });

        this.forgotPasswordForm.valueChanges.subscribe(() => {
            this.onForgotPasswordFormValuesChanged();
        });
    }

    onForgotPasswordFormValuesChanged()
    {
        for ( const field in this.forgotPasswordFormErrors )
        {
            if ( !this.forgotPasswordFormErrors.hasOwnProperty(field) )
            {
                continue;
            }

            // Clear previous errors
            this.forgotPasswordFormErrors[field] = {};

            // Get the control
            const control = this.forgotPasswordForm.get(field);

            if ( control && control.dirty && !control.valid )
            {
                this.forgotPasswordFormErrors[field] = control.errors;
            }
        }
    }


  onSubmit() {
   // console.log('submit ', this.forgotPasswordForm.value);
    this.authService.forgot_password(this.forgotPasswordForm.value.email).then(
      (data) => {
       // console.log("data ", data);
        this.router.navigate(['auth/login']);
        this.helpers.showActionSnackbar(null, false, '','',"Reset E-mail has sent successfully");
        this.loadingScreen.hide();
      }, (reason) => {
        this.helpers.showActionSnackbar(null, false, '', {style: 'failed-snackbar'}, "Reset E-mail has NOT sent");
        this.loadingScreen.hide();
        console.log('error ', reason);
      }
    )
  }
}
