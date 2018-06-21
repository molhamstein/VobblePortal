import {Component, OnInit} from '@angular/core';
import {fuseAnimations} from "../../../../../core/animations";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {HelpersService} from "../../../../shared/helpers.service";
import {PageAction} from "../../../../shared/enums/page-action";
import {ItemsService} from "../items.service";
import {ProductsService} from "../../products/products.service";
import {ProgressBarService} from "../../../../../core/services/progress-bar.service";
import {User} from "../../users/user.model";
import {UsersService} from "../../users/users.service";
import {AuthService} from "../../../pages/authentication/auth.service";

@Component({
  selector: 'app-items-new',
  templateUrl: './items-new.component.html',
  styleUrls: ['./items-new.component.scss'],
  animations: fuseAnimations
})
export class ItemsNewComponent implements OnInit {

  form: FormGroup;
  formErrors: any;
  products: any[];
  users: User[] = [];
  currentUser: any;


  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private helpersService: HelpersService,
              private progressBarService: ProgressBarService,
              private itemsService: ItemsService,
              private productsService: ProductsService,
              private usersService: UsersService,
              private authService: AuthService

  ){

    this.currentUser = authService.getCurrentUser();

    this.formErrors = {
      isConsumed: {required: true},
      valid : {required: true},
      storeToken : {required: true},
      storeType  : {required: true},
      startAt   : {required: true}
    };
  }

  ngOnInit() {

    this.getProducts();
    this.getUsers();

    this.form = this.formBuilder.group({
      isConsumed: [true, Validators.required],
      valid: [true, Validators.required],
      storeToken: ['', Validators.required],
      storeType: ['', Validators.required],
      startAt: [new Date(), Validators.required],
      endAt : [''],
      productId : ['', Validators.required],
      ownerId  : [this.currentUser.id, Validators.required]
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

  getProducts(){
    this.productsService.getItems().then(items => {
      this.products = items;
    })
  }


   getUsers(){
      this.usersService.getUsers().then( items => {
      this.users = items;
    })
   }

  onSubmit() {
    console.log('onSubmit ', this.form.value);
    delete this.form.value.id;
    this.progressBarService.toggle();
    console.log('onSubmit ', this.form.value);
    this.itemsService.newItem(this.form.value).then((val) => {
      this.helpersService.showActionSnackbar(PageAction.Create, true, 'item');
      this.router.navigate(['/items/list']);
      this.progressBarService.toggle();
    }, (reason) => {
      this.helpersService.showActionSnackbar(PageAction.Create, false, 'item', {style: 'failed-snackbar'});
      this.progressBarService.toggle();
      console.log('error ', reason);
    });
  }

}
