import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
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
//import {UsersService} from "../../users/users.service";
import {Shore} from "../../shores/shore.model";
import {ProgressBarService} from "../../../../../core/services/progress-bar.service";
//import {User} from "../../users/user.model";

@Component({
  selector: 'app-bottles-new',
  templateUrl: './bottles-new.component.html',
  styleUrls: ['./bottles-new.component.scss'],
  animations: fuseAnimations
})
export class BottlesNewComponent implements OnInit {


  form: FormGroup;
  formErrors: any;
  video: string ='';
  shores: Shore[] = [];
//  users: User[] = [];

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

    this.getShores();
    //this.getUsers();

    this.form = this.formBuilder.group({
      file:[''],
      thumbnail:[''],
      status: ['active', Validators.required      ],
      createdAt: [new Date(), Validators.required      ],
      // weight : [''],
      shoreId : [''],
      // ownerId : ['']
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

  getShores(){
   // if (this.shores.length == 0)
      this.shoresService.getItems().then( items => {
        this.shores = items;
      }, error =>{

      })
  }
/*
  getUsers(){
   // if (this.users.length == 0)
      this.usersService.getUsers().then( items => {
        this.users = items;
      }, error =>{

      })
  }*/


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
        //if (typeof file !== 'string') {
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
       /* } else {
          //this.form.value.thumbnail = thisthumbnail;
          //this.form.value.file = file;
          this.submit();
        }*/
      } else  this.submit();
    }


  submit(){
    delete this.form.value.id;
    console.log('form add', this.form.value);
    this.bottlesService.newItem(this.form.value).then((val) => {
      this.helpersService.showActionSnackbar(PageAction.Create, true, 'bottle');
      this.router.navigate(['/bottles/list']);
      this.progressBarService.toggle();
    }, (reason) => {
      this.helpersService.showActionSnackbar(PageAction.Create, false, 'bottle', {style: 'failed-snackbar'});
      this.progressBarService.toggle();
      console.log('error ', reason);
    });
  }

  onSubmit() {
    this.progressBarService.toggle();
    this.uploadFiles(this.form.value.file);
  }


}
