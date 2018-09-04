import {Component, OnInit, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import {User} from "../user.model";
import {Subscription} from "rxjs";
import {fuseAnimations} from "../../../../../core/animations";
import {UsersService} from "../users.service";
import {FormGroup, FormBuilder, Validators, FormControl} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../../pages/authentication/auth.service";
import {HelpersService} from "../../../../shared/helpers.service";
import {AppConfig} from "../../../../shared/app.config";
import {PageAction} from "../../../../shared/enums/page-action";
import {UploadFileService} from "../../../../shared/upload-file.service";
import { countries } from "typed-countries";
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {ProgressBarService} from "../../../../../core/services/progress-bar.service";

@Component({
  selector: 'app-users-edit',
  templateUrl: './users-edit.component.html',
  styleUrls: ['./users-edit.component.scss'],
  animations: fuseAnimations
})
export class UsersEditComponent implements OnInit, OnDestroy
{
  item: User;
  onItemChanged: Subscription;

  form: FormGroup;
  formErrors: any;
  image: string;
  defaultAvatar: string;

  filteredOptions: Observable<string[]>;

  @ViewChild('file') fileSelector: ElementRef;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private authService: AuthService,
              private helpersService: HelpersService,
              private progressBarService: ProgressBarService,
              private uploadFileService: UploadFileService,
              private usersService: UsersService){

    this.formErrors = {
      gender: {required: true},
      createdAt: {required: true},
      email: {required: true, email: true},
      username: {required: true, unique: true},
      password: {required: true, minLength: true}
    };

  }

  ngOnInit(){

    this.onItemChanged =
      this.usersService.onItemChanged
        .subscribe(item => {
          this.item = new User(item);
        });

    const originalUsername = this.item.username;
    this.defaultAvatar = AppConfig.defaultAvatar;
    this.image = this.item.image;

    this.form = this.formBuilder.group({
      id: [this.item.id],
      gender: [this.item.gender, Validators.required      ],
      status: [this.item.status, Validators.required      ],
      email: [this.item.email, [Validators.required, Validators.email]],
      username: [this.item.username, [Validators.required, Validators.maxLength(40),(username: FormControl)=>
      {
        if(username.value != originalUsername) {
          if (username.value != '') {
            this.authService.checkUsername(username.value).then(
              (data) => {
                // console.log("data ", data);
                username.setErrors(null);
                this.formErrors.username.unique = true;
              }, (reason) => {
                 console.log('error ', reason);
                this.formErrors.username.unique = false;
                username.setErrors({unique: false});
              }
            );
          }
        }else this.formErrors.username.unique = true;
        return null;
      }]],
     // password: ['', [Validators.required, Validators.minLength(6)]],
      totalBottlesThrown: [this.item.totalBottlesThrown],
      extraBottlesCount: [this.item.extraBottlesCount],
      bottlesCount: [this.item.bottlesCount],
      createdAt: [this.item.createdAt, Validators.required      ],
      image: [this.item.image],
      //isActive: [this.item.isActive],
      // nextRefill: [this.item.nextRefill],
      ISOCode: new FormControl(this.item.ISOCode),
    });

    this.form.valueChanges.subscribe(() => {
      this.onFormValuesChanged();
    });


    this.filteredOptions = this.form.controls.ISOCode.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filter(val))
      );
  }

  filter(val: string): any[] {
    return countries.filter(option =>
      option.iso.toLowerCase().includes(val.toLowerCase()));
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


  readFile(inputValue: any): void {
    this.form.value.image = inputValue.files[0];
    let reader: FileReader = new FileReader();

    reader.onloadend = (e) => {
      this.image = reader.result;
    };
    reader.readAsDataURL(this.form.value.image);
  }

  browseProfilePicture() {
    this.fileSelector.nativeElement.click();
    return false;
  }

  removeFile() {
    this.image = '';
    this.form.value.image = '';
  }

  onFileChange(event) {
    //console.log(event);
    this.readFile(event.target);
  }

  uploadImage(image) {
    //console.log('image ', image);
    //console.log('this.form.value.image ', this.form.value.image);
    if (image && image !== '') {
      const formData: FormData = new FormData();
      //console.log('typeof images[i] ', typeof image);
      if (typeof image !== 'string') {
        formData.append('file', image);
        //console.log('formData ', formData);
        this.uploadFileService.uploadFile(formData).then((val) => {
          //console.log('val ', val);
          this.form.value.image = val[0].file;
          this.submit();
        }, (reason) => {
          console.log('error ', reason);
        });
      } else {
        this.form.value.image = image;
        this.submit();
      }
    } else {
      this.submit();
    }
  }

  submit(){
    //console.log('form add', this.form.value);
    this.usersService.editItem(this.form.value).then((val) => {
      this.helpersService.showActionSnackbar(PageAction.Update, true, 'user');
      this.router.navigate(['/users/list']);
      this.progressBarService.toggle();
    }, (reason) => {
      this.helpersService.showActionSnackbar(PageAction.Update, false, 'user', {style: 'failed-snackbar'});
      this.progressBarService.toggle();
      console.log('error ', reason);
    });
  }

  onSubmit() {
    this.progressBarService.toggle();
    var image = '';
    if(this.image !== '') image = this.form.value.image; else {this.form.value.image = ''; this.image = ''}
    this.uploadImage(image);
  }

}
