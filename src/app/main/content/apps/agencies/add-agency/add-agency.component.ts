import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '../../../../../core/animations';
import { PageAction } from '../../../../shared/enums/page-action';
import { HelpersService } from '../../../../shared/helpers.service';
import { AgenciesService } from '../agencies.service';

@Component({
  selector: 'app-add-agency',
  templateUrl: './add-agency.component.html',
  styleUrls: ['./add-agency.component.scss'],
  animations: fuseAnimations 
})
export class AddAgencyComponent implements OnInit {


  form: FormGroup;
  formErrors: any;

  constructor(private formBuilder: FormBuilder, private router: Router,
    private helpersService: HelpersService, private agencyService: AgenciesService) {

    this.formErrors = {
      name: { required: true },
      status: { required: true }
    };
  }

  ngOnInit() {


    this.form = this.formBuilder.group({
      name: ["", Validators.required],
      status: ["", Validators.required]
    });

    this.form.valueChanges.subscribe(() => {
      this.onFormValuesChanged();
    });

  }


  onFormValuesChanged() {
    for (const field in this.formErrors) {
      if (!this.formErrors.hasOwnProperty(field)) {
        continue;
      }
      this.formErrors[field] = {};
      const control = this.form.get(field);
      if (control && control.dirty && !control.valid) {
        this.formErrors[field] = control.errors;
      }
    }
  }

  onSubmit() {
   
  
    this.agencyService.newItem(this.form.value).then((val) => {
      this.helpersService.showActionSnackbar(PageAction.Create, true, 'agency');
      this.router.navigate(['/agency/list']);
    }, (reason) => {
      this.helpersService.showActionSnackbar(PageAction.Create, false, 'agency', { style: 'failed-snackbar' });
    });

  }

}
