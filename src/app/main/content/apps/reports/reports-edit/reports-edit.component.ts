import {Component, OnInit} from '@angular/core';
import {fuseAnimations} from "../../../../../core/animations";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {HelpersService} from "../../../../shared/helpers.service";
import {PageAction} from "../../../../shared/enums/page-action";
import {ProgressBarService} from "../../../../../core/services/progress-bar.service";
import {User} from "../../users/user.model";
import {UsersService} from "../../users/users.service";
import {AuthService} from "../../../pages/authentication/auth.service";
import {ReportsService} from "../reports.service";
import {Bottle} from "../../bottles/bottle.model";
import {BottlesService} from "../../bottles/bottles.service";
import {ReportTypesService} from "../../report-types/report-types.service";
import {Report} from "../report.model";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-reports-edit',
  templateUrl: './reports-edit.component.html',
  styleUrls: ['./reports-edit.component.scss'],
  animations: fuseAnimations
})
export class ReportsEditComponent implements OnInit {

  item: Report;
  onItemChanged: Subscription;

  form: FormGroup;
  formErrors: any;
  users: User[] = [];
  bottles: Bottle[] = [];
  report_types = [];
  currentUser: any;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private helpersService: HelpersService,
              private progressBarService: ProgressBarService,
              private reportTypesService: ReportTypesService,
              private reportsService: ReportsService,
              private usersService: UsersService,
              private bottlesService: BottlesService,
              private authService: AuthService

  ){

    this.currentUser = authService.getCurrentUser();

    this.formErrors = {
      createdAt : {required: true}
    };
  }

  ngOnInit(){
    this.onItemChanged =
      this.reportsService.onItemChanged
        .subscribe(item => {
          this.item = new Report(item);
        });

    this.getReportTypes();
    this.getUsers();
    this.getBottles();

    this.form = this.formBuilder.group({
      id: [this.item.id],
      bottleId: [this.item.bottleId],
      reportTypeId: [this.item.reportTypeId],
      createdAt: [new Date(this.item.createdAt), Validators.required],
      ownerId  : [this.item.ownerId]
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

  getReportTypes(){
    this.reportTypesService.getItems().then(items => {
      this.report_types = items;
    })
  }


  getUsers(){
    this.usersService.getUsers().then( items => {
      this.users = items;
    })
  }

  getBottles(){
    this.bottlesService.getItems().then( items => {
      this.bottles = items;
    })
  }

  onSubmit() {
   // console.log('onSubmit ', this.form.value);
    this.progressBarService.toggle();
    this.reportsService.editItem(this.form.value).then((val) => {
      this.helpersService.showActionSnackbar(PageAction.Update, true, 'report');
      this.router.navigate(['/reports/list']);
      this.progressBarService.toggle();
    }, (reason) => {
      this.helpersService.showActionSnackbar(PageAction.Update, false, 'report', {style: 'failed-snackbar'});
      this.progressBarService.toggle();
      console.log('error ', reason);
    });
  }


  ngOnDestroy(){
    this.onItemChanged.unsubscribe();
  }

}
