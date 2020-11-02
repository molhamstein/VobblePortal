import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { fuseAnimations } from "../../../../../core/animations";
import { ProgressBarService } from "../../../../../core/services/progress-bar.service";
import { AppConfig } from "../../../../shared/app.config";
import { PageAction } from "../../../../shared/enums/page-action";
import { HelpersService } from "../../../../shared/helpers.service";
import { UploadFileService } from "../../../../shared/upload-file.service";
import { TypeGoodsService } from "../../type-goods/type-goods.service";
import { ChatBasrProductsService } from './../chat-base-products.service';

@Component({
  selector: "app-chat-products-new",
  templateUrl: "./chat-products-new.component.html",
  styleUrls: ["./chat-products-new.component.scss"],
  animations: fuseAnimations
})
export class ChatProductsNewComponent implements OnInit {
  form: FormGroup;
  formErrors: any;
  type_goods: any[];
  defaultIcon: string;
  icon: string = "";
  baseProductId: string = ""
  @ViewChild("file") fileSelector: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private helpersService: HelpersService,
    private progressBarService: ProgressBarService,
    private typeGoodsService: TypeGoodsService,
    private productsService: ChatBasrProductsService,
    private uploadFileService: UploadFileService
  ) {

    this.baseProductId = this.route.snapshot.paramMap.get('id'); //this.route.params["id"]

    this.defaultIcon = AppConfig.defaultShoreIcon;

    this.formErrors = {
      name_ar: { required: true },
      name_en: { required: true },
      price: { required: true },
      productSold: { required: true },
    };
  }

  ngOnInit() {

    this.form = this.formBuilder.group({
      baseProductId: [this.baseProductId],
      name_ar: ["", Validators.required],
      name_en: ["", Validators.required],
      price: [0, Validators.required],
      productSold: [0, Validators.required],
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
    this.productsService.newChildItem(this.form.value).then(
      val => {
        this.helpersService.showActionSnackbar(
          PageAction.Create,
          true,
          "chat products"
        );
        this.router.navigate(["/chat-base-products/edit/" + this.baseProductId]);
        this.progressBarService.toggle();
      },
      reason => {
        this.helpersService.showActionSnackbar(
          PageAction.Create,
          false,
          "chat products",
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
