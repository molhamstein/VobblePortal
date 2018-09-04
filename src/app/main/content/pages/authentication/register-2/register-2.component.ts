import {Component, OnInit} from '@angular/core';

import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {fuseAnimations} from "../../../../../core/animations";
import {FuseConfigService} from "../../../../../core/services/config.service";
import {FuseSplashScreenService} from "../../../../../core/services/splash-screen.service";
import {HelpersService} from "../../../../shared/helpers.service";
import {PageAction} from "../../../../shared/enums/page-action";


@Component({
  selector: 'fuse-register-2',
  templateUrl: 'register-2.component.html',
  styleUrls: ['register-2.component.scss'],
  animations: fuseAnimations
})
export class FuseRegister2Component implements OnInit {
  registerForm: FormGroup;
  registerFormErrors: any;

  constructor(private fuseConfig: FuseConfigService,
              private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private loadingScreen: FuseSplashScreenService,
              private helpers: HelpersService) {
    this.fuseConfig.setSettings({
      layout: {
        navigation: 'none',
        toolbar: 'none',
        footer: 'none'
      }
    });

    this.registerFormErrors = {
      gender: {},
      username: {required: true, unique: true},
      email: {required: true},
      password: {required: true, minlength: true},
      passwordConfirm: {required: true}
    };
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
        gender: new FormControl('male', Validators.required),
        username: new FormControl('', [Validators.required, (username: FormControl)=>
        {
          if(username.value != '') {
            this.authService.checkUsername(username.value).then(
              (data) => {
                //console.log("data ", data);
                this.registerFormErrors.username.unique = true;
                username.setErrors(null);
              }, (reason) => {
                console.log('error ', reason);
                this.registerFormErrors.username.unique = false;
                username.setErrors({unique: false});
              }
            );
          }
          return null;
        }]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
        passwordConfirm:  new FormControl('', Validators.required),

      }, {validator: this.checkIfMatchingPasswords('password', 'passwordConfirm')}
    );
    /*,,
     {validator: this.checkIfUniqueUsername('username')}*/
    this.registerForm.valueChanges.subscribe(() => {
      this.onRegisterFormValuesChanged();
    });
  }

  checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    //console.log('passwordConfirmationKey');
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey],
        passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({notEquivalent: true})
      }
      else {
        return passwordConfirmationInput.setErrors(null);
      }
    }
  }

  onRegisterFormValuesChanged() {
    for (const field in this.registerFormErrors) {
      if (!this.registerFormErrors.hasOwnProperty(field)) {
        continue;
      }

      // Clear previous errors
      this.registerFormErrors[field] = {};

      // Get the control
      const control = this.registerForm.get(field);

      if (control && control.dirty && !control.valid) {
        this.registerFormErrors[field] = control.errors;
      }
    }
  }

  onSubmit() {
   // console.log('submit');
    this.authService.register(this.registerForm.value).then(
      (data) => {
        //console.log("data ", data);
        this.router.navigate(['auth/login']);
        this.helpers.showActionSnackbar(null, false, '',"Registration succeed");
        this.loadingScreen.hide();
      }, (reason) => {
        this.helpers.showActionSnackbar(null, false, '', {style: 'failed-snackbar'}, "Registration failed");
        this.loadingScreen.hide();
        console.log('error ', reason);
      }
    )
  }
}
