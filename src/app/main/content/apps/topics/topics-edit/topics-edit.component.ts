import { Topic } from "../topic.model";
import { Subscription } from "rxjs";
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
  selector: "app-topics-edit",
  templateUrl: "./topics-edit.component.html",
  styleUrls: ["./topics-edit.component.scss"],
  animations: fuseAnimations
})
export class TopicsEditComponent implements OnInit {
  item: Topic;
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
    private topicsService: TopicsService,
    private uploadFileService: UploadFileService
  ) {
    this.defaultIcon = AppConfig.defaultShoreIcon;

    this.formErrors = {
      text_ar: { required: true },
      text_en: { required: true }
    };
  }

  ngOnInit() {
    this.onItemChanged = this.topicsService.onItemChanged.subscribe(item => {
      this.item = new Topic(item);
    });


    this.form = this.formBuilder.group({
      status: [this.item.status, Validators.required],
      id: [this.item.id],
      text_ar: [this.item.text_ar, Validators.required],
      text_en: [this.item.text_en, Validators.required],
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




  submit() {
    this.progressBarService.toggle();
    //
    this.topicsService.editItem(this.form.value).then(
      val => {
        this.helpersService.showActionSnackbar(
          PageAction.Update,
          true,
          "product"
        );
        this.router.navigate(["/topics/list"]);
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
    this.submit();
  }
}
