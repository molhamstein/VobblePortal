import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { fuseAnimations } from "../../../../../core/animations";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HelpersService } from "../../../../shared/helpers.service";
import { PageAction } from "../../../../shared/enums/page-action";
import { ProgressBarService } from "../../../../../core/services/progress-bar.service";
import { TopicsService } from "../topics.service";
import { AppConfig } from "../../../../shared/app.config";
import { UploadFileService } from "../../../../shared/upload-file.service";
import { TypeGoodsService } from "../../type-goods/type-goods.service";

@Component({
  selector: "app-topics-new",
  templateUrl: "./topics-new.component.html",
  styleUrls: ["./topics-new.component.scss"],
  animations: fuseAnimations
})
export class TopicsNewComponent implements OnInit {
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
    private topicsService: TopicsService,
    private uploadFileService: UploadFileService
  ) {
    this.defaultIcon = AppConfig.defaultShoreIcon;

    this.formErrors = {
      text_en: { required: true },
      text_ar: { required: true },
    };
  }

  ngOnInit() {

    this.form = this.formBuilder.group({
      status: ["active"],
      text_en: ["", Validators.required],
      text_ar: ["", Validators.required],
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
      // this.icon = reader.result;
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
    this.topicsService.newItem(this.form.value).then(
      val => {
        this.helpersService.showActionSnackbar(
          PageAction.Create,
          true,
          "topic"
        );
        this.router.navigate(["/topics/list"]);
        this.progressBarService.toggle();
      },
      reason => {
        this.helpersService.showActionSnackbar(
          PageAction.Create,
          false,
          "topic",
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
