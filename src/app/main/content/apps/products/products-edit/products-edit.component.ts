import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { fuseAnimations } from "../../../../../core/animations";
import { ProgressBarService } from "../../../../../core/services/progress-bar.service";
import { AppConfig } from "../../../../shared/app.config";
import { PageAction } from "../../../../shared/enums/page-action";
import { HelpersService } from "../../../../shared/helpers.service";
import { UploadFileService } from "../../../../shared/upload-file.service";
import { TypeGoodsService } from "../../type-goods/type-goods.service";
import { Product } from "../product.model";
import { ProductsService } from "../products.service";

@Component({
  selector: "app-products-edit",
  templateUrl: "./products-edit.component.html",
  styleUrls: ["./products-edit.component.scss"],
  animations: fuseAnimations
})
export class ProductsEditComponent implements OnInit {
  item: Product;
  onItemChanged: Subscription;

  form: FormGroup;
  formErrors: any;
  type_goods: any[];
  defaultIcon: string;
  icon: string = "";

  @ViewChild("file") fileSelector: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private helpersService: HelpersService,
    private progressBarService: ProgressBarService,
    private typeGoodsService: TypeGoodsService,
    private productsService: ProductsService,
    private uploadFileService: UploadFileService
  ) {
    this.defaultIcon = AppConfig.defaultShoreIcon;

    this.formErrors = {
      name_ar: { required: true },
      name_en: { required: true },
      price: { required: true },
      price_coins: { required: true },
      description_ar: { required: true },
      description_en: { required: true }
    };
  }

  ngOnInit() {
    this.onItemChanged = this.productsService.onItemChanged.subscribe(item => {
      this.item = new Product(item);
    });

    this.icon = this.item.icon;
    this.getTypeGoods();

    this.form = this.formBuilder.group({
      id: [this.item.id],
      name_ar: [this.item.name_ar, Validators.required],
      name_en: [this.item.name_en, Validators.required],
      price: [this.item.price, Validators.required],
      price_coins: [this.item.price_coins, Validators.required],
      description_ar: [this.item.description_ar, Validators.required],
      description_en: [this.item.description_en, Validators.required],
      bottleCount: [this.item.bottleCount],
      coinsCount: [this.item.coinsCount],
      validity: [this.item.validity],
      androidProduct: [this.item.androidProduct],
      appleProduct: [this.item.appleProduct],
      typeGoodsId: [this.item.typeGoodsId]
    });

    this.form.valueChanges.subscribe(() => {
      this.onFormValuesChanged();
    });
  }

  ngOnDestroy() {
    this.onItemChanged.unsubscribe();
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

  getTypeGoods() {
    this.typeGoodsService.getItems().then(items => {
      this.type_goods = items;
    });
  }

  readFile(inputValue: any): void {
    this.form.value.icon = inputValue.files[0];
    let reader: FileReader = new FileReader();

    reader.onloadend = e => {
      this.icon = reader.result;
    };
    reader.readAsDataURL(this.form.value.icon);
  }

  browseFiles() {
    this.fileSelector.nativeElement.click();
    return false;
  }

  removeFile() {
    this.icon = "";
    this.form.value.icon = "";
  }

  onFileChange(event) {
    //
    this.readFile(event.target);
  }

  uploadImage(image) {
    if (image && image !== "") {
      const formData: FormData = new FormData();
      //
      if (typeof image !== "string") {
        formData.append("file", image);
        this.uploadFileService.uploadFile(formData).then(
          val => {
            // 
            this.form.value.icon = val[0].file;
            this.submit();
          },
          reason => {
            
          }
        );
      } else {
        this.form.value.icon = image;
        this.submit();
      }
    } else {
      this.submit();
    }
  }

  submit() {
    this.progressBarService.toggle();
    //
    this.productsService.editItem(this.form.value).then(
      val => {
        this.helpersService.showActionSnackbar(
          PageAction.Update,
          true,
          "product"
        );
        this.router.navigate(["/products/list"]);
        this.progressBarService.toggle();
      },
      reason => {
        this.helpersService.showActionSnackbar(
          PageAction.Update,
          false,
          "product",
          { style: "failed-snackbar" }
        );
        this.progressBarService.toggle();
        
      }
    );
  }

  onSubmit() {
    this.progressBarService.toggle();
    var icon = "";
    if (this.icon !== "") icon = this.form.value.icon;
    else {
      this.form.value.icon = "";
      this.icon = "";
    }
    this.uploadImage(icon);
  }
}
