import {Component, OnInit} from '@angular/core';
import {fuseAnimations} from "../../../../../core/animations";
import {FormGroup, FormBuilder, Validators, FormControl} from "@angular/forms";
import {Router} from "@angular/router";
import {HelpersService} from "../../../../shared/helpers.service";
import {PageAction} from "../../../../shared/enums/page-action";
import {ItemsService} from "../items.service";
import {ProductsService} from "../../products/products.service";
import {ProgressBarService} from "../../../../../core/services/progress-bar.service";
import {User} from "../../users/user.model";
import {UsersService} from "../../users/users.service";
import {AuthService} from "../../../pages/authentication/auth.service";
import {Observable} from "rxjs";
import {map, startWith} from 'rxjs/operators';


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

  filteredUsers: Observable<User[]>;


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
   // this.getUsers();

    this.form = this.formBuilder.group({
      isConsumed: [true, Validators.required],
      valid: [true, Validators.required],
      storeToken: ['', Validators.required],
      storeType: ['', Validators.required],
      startAt: [new Date(), Validators.required],
      endAt : [null],
      productId : ['', Validators.required],
      ownerId  :new FormControl(this.currentUser,Validators.required)
    });

    this.form.valueChanges.subscribe(() => {
      this.onFormValuesChanged();
    });


    this.filteredUsers = this.form['controls'].ownerId.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filter(val))
      );

  }

  filter(val): User[] {
    if(val && typeof val == "string") {
      return this.users.filter(option =>
        option.username.toLowerCase().includes(val.toLowerCase()));
    }

  }

  onSearch(flag, keyword){
    if(flag == 'user')
      this.usersService.getUsersAutocpmlete(keyword).then( items => {
        this.users = items;
      })
  }

  displayFn(user: User): string {
    return user.username;
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


  onSubmit() {
    this.form.value.ownerId = this.form.value.ownerId.id;
    this.progressBarService.toggle();
    //console.log('onSubmit ', this.form.value);
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
