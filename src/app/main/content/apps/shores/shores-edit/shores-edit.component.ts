import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { fuseAnimations } from "../../../../../core/animations";
import { ProgressBarService } from "../../../../../core/services/progress-bar.service";
import { AppConfig } from "../../../../shared/app.config";
import { PageAction } from "../../../../shared/enums/page-action";
import { HelpersService } from "../../../../shared/helpers.service";
import { UploadFileService } from "../../../../shared/upload-file.service";
import { Shore } from "../shore.model";
import { ShoresService } from "../shores.service";

@Component({
  selector: 'app-shores-edit',
  templateUrl: './shores-edit.component.html',
  styleUrls: ['./shores-edit.component.scss'],
  animations: fuseAnimations
})
export class ShoresEditComponent implements OnInit {

  item: Shore;
  onItemChanged: Subscription;

  form: FormGroup;
  formErrors: any;
  cover: string ;
  icon: string;
  defaultCover: string;
  defaultIcon: string;

  @ViewChild('file') fileSelector: ElementRef;
  @ViewChild('file_cover') fileSelector_cover: ElementRef;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private helpersService: HelpersService,
              private progressBarService: ProgressBarService,
              private shoresService: ShoresService,
              private uploadFileService: UploadFileService) {
    this.formErrors = {
      name_en: {required: true},
      name_ar: {required: true}
    };
  }

  ngOnInit() {
    this.onItemChanged =
      this.shoresService.onItemChanged
        .subscribe(item => {
          this.item = new Shore(item);
        });

    this.defaultCover = AppConfig.defaultShoreCover;
    this.defaultIcon = AppConfig.defaultShoreIcon;
    this.cover = this.item.cover;
    this.icon = this.item.icon;

    this.form = this.formBuilder.group({
      name_ar: [this.item.name_ar, Validators.required],
      name_en: [this.item.name_en, Validators.required],
      cover: [this.item.cover],
      id: [this.item.id],
      icon: [this.item.icon]
    });

    this.form.valueChanges.subscribe(() => {
      this.onFormValuesChanged();
    });

  }

  ngOnDestroy(){
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


  readFile(inputValue: any, type): void {
    let reader: FileReader = new FileReader();
    if (type == 'cover') {
      this.form.value.cover = inputValue.files[0];
      reader.onloadend = (e) => {
        this.cover = reader.result;
      };
      reader.readAsDataURL(this.form.value.cover);
    } else {
      this.form.value.icon = inputValue.files[0];
      reader.onloadend = (e) => {
        this.icon = reader.result;
      };
      reader.readAsDataURL(this.form.value.icon);
    }
  }

  browseFiles(type) {
    if(type == 'icon')
      this.fileSelector.nativeElement.click();
    else  this.fileSelector_cover.nativeElement.click();

    return false;
  }

  removeFile(type) {
    if (type == 'cover') {
      this.cover = '';
      this.form.value.cover = '';
    } else {
      this.icon = '';
      this.form.value.icon = '';
    }
  }

  onFileChange(event, type) {
    this.readFile(event.target, type);
  }


  submit() {
    this.shoresService.editItem(this.form.value).then((val) => {
      this.helpersService.showActionSnackbar(PageAction.Update, true, 'shore');
      this.router.navigate(['/shores/list']);
      this.progressBarService.toggle();
    }, (reason) => {
      this.helpersService.showActionSnackbar(PageAction.Update, false, 'shore', {style: 'failed-snackbar'});
      this.progressBarService.toggle();
      
    });
  }

  processCoverAndIcon(cover, icon){
    var isCover = false, isIcon = false;
    if(cover !== '' && icon !==''){
      if(typeof cover !== 'string'){
        isCover = true;
      }else{
        isCover = false;
      }

      if(typeof icon !== 'string'){
          isIcon = true;
      }else{
          isIcon = false;
      }
    }else{
      if(cover !== ''){
        if(typeof cover !== 'string'){
            isCover = true;
        }else{
          isCover = false;
        }
      }
      if(icon !== ''){
        if(typeof icon !== 'string'){
          isIcon = true;
        }else{
          isIcon = false;
        }
      }
    }

    if(isCover && isIcon){
      this.uploadIconAndCover(cover, icon)
    }else {
      if(!isCover && !isIcon)
        this.submit();

      if(isCover){
        this.uploadCover(cover)
      }

      if(isIcon){
        this.uploadIcon(icon)
      }
    }
  }

  uploadCover(cover){
    const formData: FormData = new FormData();
    formData.append('file', cover);
    this.uploadFileService.uploadFile(formData).then((val) => {
      this.form.value.cover = val[0].file;
      this.submit();
    }, (reason) => {
      
    });
  }

  uploadIcon(icon){
    const formData: FormData = new FormData();
    formData.append('file', icon);
    this.uploadFileService.uploadFile(formData).then((val) => {
      this.form.value.icon = val[0].file;
      this.submit();
    }, (reason) => {
      
    });
  }

  uploadIconAndCover(cover, icon){
    const formData: FormData = new FormData();
    formData.append('file', cover);
    formData.append('file', icon);
    this.uploadFileService.uploadFile(formData).then((val) => {
      this.form.value.cover = val[0].file;
      this.form.value.icon = val[1].file;
      this.submit();
    }, (reason) => {
      
    });
  }

  onSubmit() {
    this.progressBarService.toggle();
    var cover = '', icon = '';
    if(this.cover !== '') cover = this.form.value.cover; else {this.form.value.cover = ''; this.cover = ''}
    if(this.icon !== '') icon = this.form.value.icon; else {this.form.value.icon = '';this.icon = ''}
    if(cover =='' && icon == ''){
      this.submit();
    }else this.processCoverAndIcon(cover, icon);

  }

}
