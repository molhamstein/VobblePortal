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
import {Subscription} from "rxjs";
import {Item} from "../item.model";

@Component({
  selector: 'app-items-edit',
  templateUrl: './items-edit.component.html',
  styleUrls: ['./items-edit.component.scss'],
  animations   : fuseAnimations
})
export class ItemsEditComponent implements OnInit {
  item: Item;
  onItemChanged: Subscription;

  form: FormGroup;
  formErrors: any;
  products: any[];
  users: User[] = [];


  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private helpersService: HelpersService,
              private progressBarService: ProgressBarService,
              private itemsService: ItemsService,
              private productsService: ProductsService,
              private usersService: UsersService){


    this.formErrors = {
      isConsumed: {required: true},
      valid : {required: true},
      storeToken : {required: true},
      storeType  : {required: true},
      startAt   : {required: true}
    };

  }

  ngOnInit(){
    this.onItemChanged =
      this.itemsService.onItemChanged
        .subscribe(item => {
          this.item = new Item(item);
        });

    this.getProducts();
    this.getUsers();

    this.form = this.formBuilder.group({
      id: [this.item.id],
      isConsumed: [this.item.isConsumed, Validators.required],
      valid: [this.item.valid, Validators.required],
      storeToken: [this.item.storeToken, Validators.required],
      storeType: [this.item.storeType, Validators.required],
      startAt: [new Date(this.item.startAt), Validators.required],
      endAt : [new Date(this.item.endAt)],
      productId : [this.item.productId, Validators.required],
      ownerId  : [this.item.ownerId, Validators.required]
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
    this.progressBarService.toggle();
    console.log('onSubmit ', this.form.value);
    this.itemsService.editItem(this.form.value).then((val) => {
      this.helpersService.showActionSnackbar(PageAction.Update, true, 'item');
      this.router.navigate(['/items/list']);
      this.progressBarService.toggle();
    }, (reason) => {
      this.helpersService.showActionSnackbar(PageAction.Update, false, 'item', {style: 'failed-snackbar'});
      this.progressBarService.toggle();
      console.log('error ', reason);
    });
  }


}
