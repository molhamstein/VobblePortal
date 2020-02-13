import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { fuseAnimations } from '../../../../../core/animations';
import { PageAction } from '../../../../shared/enums/page-action';
import { HelpersService } from '../../../../shared/helpers.service';
import { AgenciesService } from '../agencies.service';
import { Agency } from '../agency.model';

@Component({
  selector: 'app-edit-agency',
  templateUrl: './edit-agency.component.html',
  styleUrls: ['./edit-agency.component.scss'],
  animations: fuseAnimations
})
export class EditAgencyComponent implements OnInit {

  agency: Agency;
  onItemChanged: Subscription;

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
    this.onItemChanged = this.agencyService.onItemChanged.subscribe(agency => {
      this.agency = new Agency(agency);
    });

    this.form = this.formBuilder.group({
      name: [this.agency.name, Validators.required],
      status: [this.agency.status, Validators.required]
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

    this.agencyService.editItem(this.form.value, this.agency.id).then((val) => {
      this.helpersService.showActionSnackbar(PageAction.Update, true, 'agency');
      this.router.navigate(['/agency/list']);
    }, (reason) => {
      this.helpersService.showActionSnackbar(PageAction.Update, false, 'agency', { style: 'failed-snackbar' });
    });

  }

}
