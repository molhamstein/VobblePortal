import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {Router, ActivatedRoute} from "@angular/router";
import {fuseAnimations} from "../../../../../core/animations";
import {FuseConfigService} from "../../../../../core/services/config.service";
import {FuseSplashScreenService} from "../../../../../core/services/splash-screen.service";
import {AuthService} from "../auth.service";
import {HelpersService} from "../../../../shared/helpers.service";
import {PageAction} from "../../../../shared/enums/page-action";
import {AppConfig} from "../../../../shared/app.config";


@Component({
  selector   : 'fuse-login-2',
  templateUrl: 'login-2.component.html',
  styleUrls  : ['login-2.component.scss'],
  animations : fuseAnimations
})
export class FuseLogin2Component implements OnInit
{
  loginForm: FormGroup;
  loginFormErrors: any;

  constructor(
    private fuseConfig: FuseConfigService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingScreen: FuseSplashScreenService,
    private helpersService: HelpersService
  )
  {
    this.fuseConfig.setSettings({
      layout: {
        navigation: 'none',
        toolbar   : 'none',
        footer    : 'none'
      }
    });

    this.loginFormErrors = {
      email   : {},
      password: {}
    };
  }

  ngOnInit()
  {
    this.authService.logout();

    this.loginForm = this.formBuilder.group({
      email   : ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.loginForm.valueChanges.subscribe(() => {
      this.onLoginFormValuesChanged();
    });
  }

  onLoginFormValuesChanged()
  {
    for ( const field in this.loginFormErrors )
    {
      if ( !this.loginFormErrors.hasOwnProperty(field) )
      {
        continue;
      }

      // Clear previous errors
      this.loginFormErrors[field] = {};

      // Get the control
      const control = this.loginForm.get(field);

      if ( control && control.dirty && !control.valid )
      {
        this.loginFormErrors[field] = control.errors;
      }
    }
  }


  onSubmit(){

    this.loadingScreen.show();
    this.authService.login(this.loginForm.value).then(
      (data) => {
        this.router.navigate(['/users/list']);
        this.helpersService.showActionSnackbar(null, false, '','',"Login succeed");
        this.loadingScreen.hide();
      }, (reason) =>{
        this.helpersService.showActionSnackbar(null, false, '', {style: 'failed-snackbar'}, "Login failed");
        this.loadingScreen.hide();
        console.log('error ', reason);
      }
    )
  }
}
