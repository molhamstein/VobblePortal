import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { fuseAnimations } from "../../../../../core/animations";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HelpersService } from "../../../../shared/helpers.service";
import { PageAction } from "../../../../shared/enums/page-action";
import { ProgressBarService } from "../../../../../core/services/progress-bar.service";
import { ProductsService } from "../products.service";
import { AppConfig } from "../../../../shared/app.config";
import { UploadFileService } from "../../../../shared/upload-file.service";
import { TypeGoodsService } from "../../type-goods/type-goods.service";

@Component({
  selector: "app-products-new",
  templateUrl: "./products-new.component.html",
  styleUrls: ["./products-new.component.scss"],
  animations: fuseAnimations
})
export class ProductsNewComponent implements OnInit {
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
    this.getTypeGoods();

    this.form = this.formBuilder.group({
      name_ar: ["", Validators.required],
      name_en: ["", Validators.required],
      price_coins: [0, Validators.required],
      price: [0, Validators.required],
      description_ar: ["", Validators.required],
      description_en: ["", Validators.required],
      bottleCount: [0],
      coinsCount: [0],
      validity: [0],
      androidProduct: [""],
      appleProduct: [""],
      typeGoodsId: [""]
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
    //console.log(event);
    this.readFile(event.target);
  }

  uploadImage(image) {
    if (image && image !== "") {
      const formData: FormData = new FormData();
      //console.log('typeof images[i] ', typeof image);
      if (typeof image !== "string") {
        formData.append("file", image);
        this.uploadFileService.uploadFile(formData).then(
          val => {
            //console.log('val ', val);
            this.form.value.icon = val[0].file;
            this.submit();
          },
          reason => {
            console.log("error ", reason);
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
    // console.log('onSubmit ', this.form.value);
    this.productsService.newItem(this.form.value).then(
      val => {
        this.helpersService.showActionSnackbar(
          PageAction.Create,
          true,
          "product"
        );
        this.router.navigate(["/products/list"]);
        this.progressBarService.toggle();
      },
      reason => {
        this.helpersService.showActionSnackbar(
          PageAction.Create,
          false,
          "product",
          { style: "failed-snackbar" }
        );
        this.progressBarService.toggle();
        console.log("error ", reason);
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
