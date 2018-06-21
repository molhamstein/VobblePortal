import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {fuseAnimations} from "../../../../../core/animations";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {HelpersService} from "../../../../shared/helpers.service";
import {FuseSplashScreenService} from "../../../../../core/services/splash-screen.service";
import {UploadFileService} from "../../../../shared/upload-file.service";
import {ShoresService} from "../shores.service";
import {AppConfig} from "../../../../shared/app.config";
import {PageAction} from "../../../../shared/enums/page-action";
import {ProgressBarService} from "../../../../../core/services/progress-bar.service";

@Component({
  selector: 'app-shores-new',
  templateUrl: './shores-new.component.html',
  styleUrls: ['./shores-new.component.scss'],
  animations: fuseAnimations
})
export class ShoresNewComponent implements OnInit {

  form: FormGroup;
  formErrors: any;
  cover: string = '';
  icon: string = '';
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
    this.defaultCover = AppConfig.defaultShoreCover;
    this.defaultIcon = AppConfig.defaultShoreIcon;

    this.form = this.formBuilder.group({
      name_ar: ['', Validators.required],
      name_en: ['', Validators.required],
      cover: [''],
      icon: ['']
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

  uploadFiles(cover, icon) {
    const formData: FormData = new FormData();
    if (cover != '' && icon != '') {
      if (typeof cover !== 'string' && typeof icon !== 'string') {
        formData.append('file', cover);
        formData.append('file', icon);
        this.uploadFileService.uploadFile(formData).then((val) => {
          this.form.value.cover = val[0].file;
          this.form.value.icon = val[1].file;
          this.submit();
        }, (reason) => {
          console.log('error ', reason);
        });
      } else if (typeof cover !== 'string') {
        formData.append('file', cover);
        this.uploadFileService.uploadFile(formData).then((val) => {
          this.form.value.cover = val[0].file;
          this.submit();
        }, (reason) => {
          console.log('error ', reason);
        });
      } else if (typeof icon !== 'string') {
        formData.append('file', icon);
        this.uploadFileService.uploadFile(formData).then((val) => {
          this.form.value.icon = val[0].file;
          this.submit();
        }, (reason) => {
          console.log('error ', reason);
        });
      } else {
        this.submit();
      }
    }else
      if(cover !=''){
        if (typeof cover !== 'string') {
          formData.append('file', cover);
          this.uploadFileService.uploadFile(formData).then((val) => {
            this.form.value.cover = val[0].file;
            this.submit();
          }, (reason) => {
            console.log('error ', reason);
          });
        }
      }else
        if(icon !=''){
          if (typeof icon !== 'string') {
            formData.append('file', icon);
            this.uploadFileService.uploadFile(formData).then((val) => {
              this.form.value.icon = val[0].file;
              this.submit();
            }, (reason) => {
              console.log('error ', reason);
            });
          }
        }else   this.submit();
  }

  submit() {
    delete this.form.value.id;
    this.shoresService.newItem(this.form.value).then((val) => {
      this.helpersService.showActionSnackbar(PageAction.Create, true, 'shore');
      this.router.navigate(['/shores/list']);
      this.progressBarService.toggle();
    }, (reason) => {
      this.helpersService.showActionSnackbar(PageAction.Create, false, 'shore', {style: 'failed-snackbar'});
      this.progressBarService.toggle();
      console.log('error ', reason);
    });
  }

  onSubmit() {
    this.progressBarService.toggle();
     var cover = '', icon = '';
     if(this.cover !== '') cover = this.form.value.cover; else {this.form.value.cover = ''; this.cover = ''}
     if(this.icon !== '') icon = this.form.value.icon; else {this.form.value.icon = '';this.icon = ''}
     this.uploadFiles(cover,icon);
  }

}
