import {Component, OnInit, ElementRef, ViewChild, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {fuseAnimations} from "../../../../../core/animations";
import {AppConfig} from "../../../../shared/app.config";
import {PageAction} from "../../../../shared/enums/page-action";
import {Router} from "@angular/router";
import {HelpersService} from "../../../../shared/helpers.service";
import {FuseSplashScreenService} from "../../../../../core/services/splash-screen.service";
import {AuthService} from "../../../pages/authentication/auth.service";
import {BottlesService} from "../bottles.service";
import {UploadFileService} from "../../../../shared/upload-file.service";
import {ShoresService} from "../../shores/shores.service";
import {Shore} from "../../shores/shore.model";
import {Bottle} from "../bottle.model";
import {Subscription} from "rxjs";
import {ProgressBarService} from "../../../../../core/services/progress-bar.service";

@Component({
  selector: 'app-bottles-edit',
  templateUrl: './bottles-edit.component.html',
  styleUrls: ['./bottles-edit.component.scss'],
  animations: fuseAnimations
})
export class BottlesEditComponent implements OnInit, OnDestroy {

  item: Bottle;
  onItemChanged: Subscription;

  form: FormGroup;
  formErrors: any;
  video: string ='';
  shores: Shore[] = [];

  @ViewChild('file') fileSelector: ElementRef;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private helpersService: HelpersService,
              private progressBarService: ProgressBarService,
              private uploadFileService: UploadFileService,
              private shoresService: ShoresService,
              private bottlesService: BottlesService) {

    this.formErrors = {
      file: {required: true},
      status : {required: true},
      createdAt: {required: true}
    };
  }

  ngOnInit() {

    this.onItemChanged =
      this.bottlesService.onItemChanged
        .subscribe(item => {
          this.item = new Bottle(item);
        });

    this.getShores();
    this.video = this.item.file;
    this.form = this.formBuilder.group({
      id:[this.item.id],
      file:[this.item.file],
      thumbnail:[this.item.thumbnail],
      status: [this.item.status, Validators.required      ],
      createdAt: [this.item.createdAt, Validators.required      ],
      // weight : [''],
      shoreId : [this.item.shoreId],
      // ownerId : ['']
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

  getShores(){
    // if (this.shores.length == 0)
    this.shoresService.getItems().then( items => {
      this.shores = items;
    }, error =>{

    })
  }


  readFileVideo(inputValue: any): void {
    this.form.value.file = inputValue.files[0];
    console.log('this.form.value.file ', this.form.value.file);
    let reader: FileReader = new FileReader();

    reader.onloadend = (e) => {
      this.video = reader.result;
    };
    reader.readAsDataURL(this.form.value.file);
  }

  browseVideos() {
    this.fileSelector.nativeElement.click();
    return false;
  }

  removeFileVideo() {
    this.video = '';
    this.form.value.file = '';
    this.form.value.thumbnail = '';
  }

  onFileChange(event) {
    this.readFileVideo(event.target);
  }

  uploadFiles(file) {
    console.log('file ', file);
    console.log('this.form.value.file ', this.form.value.file);
    //console.log('this.form.value.image ', this.form.value.image);
    if (file && file !== '') {
      const formData: FormData = new FormData();

      console.log('typeof images[i] ', typeof file);
      if (typeof file !== 'string') {
      formData.append('file', file);
      //console.log('formData ', formData);
      this.uploadFileService.uploadFile(formData, 'video').then((val) => {
        //console.log('val ', val);
        this.form.value.thumbnail = val[0].thumbnail;
        this.form.value.file = val[0].file;
        this.submit();
      }, (reason) => {
        console.log('error ', reason);
      });
       } else {
       this.form.value.thumbnail = this.item.thumbnail;
       this.form.value.file = file;
       this.submit();
       }
    } else  this.submit();
  }


  submit(){
    console.log('form add', this.form.value);
    this.bottlesService.editItem(this.form.value).then((val) => {
      this.helpersService.showActionSnackbar(PageAction.Update, true, 'bottle');
      this.router.navigate(['/bottles/list']);
      this.progressBarService.toggle();
    }, (reason) => {
      this.helpersService.showActionSnackbar(PageAction.Update, false, 'bottle', {style: 'failed-snackbar'});
      this.progressBarService.toggle();
      console.log('error ', reason);
    });
  }

  onSubmit() {
    this.progressBarService.toggle();
    this.uploadFiles(this.form.value.file);
  }
}