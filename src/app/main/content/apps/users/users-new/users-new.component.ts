import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { fuseAnimations } from "../../../../../core/animations";
import { AppConfig } from "../../../../shared/app.config";
import { UsersService } from "../users.service";
import { PageAction } from "../../../../shared/enums/page-action";
import { Router } from "@angular/router";
import { HelpersService } from "../../../../shared/helpers.service";
import { AuthService } from "../../../pages/authentication/auth.service";
import { UploadFileService } from "../../../../shared/upload-file.service";
import { countries } from "typed-countries";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { ProgressBarService } from "../../../../../core/services/progress-bar.service";

@Component({
  selector: "app-users-new",
  templateUrl: "./users-new.component.html",
  styleUrls: ["./users-new.component.scss"],
  animations: fuseAnimations
})
export class UsersNewComponent implements OnInit {
  form: FormGroup;
  formErrors: any;
  image: string = "";
  blobFileToUpload;
  defaultAvatar: string;

  filteredOptions: Observable<string[]>;

  @ViewChild("file")
  fileSelector: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private helpersService: HelpersService,
    private progressBarService: ProgressBarService,
    private usersService: UsersService,
    private uploadFileService: UploadFileService
  ) {
    this.formErrors = {
      gender: { required: true },
      createdAt: { required: true },
      email: { required: true, email: true },
      username: { required: true, unique: true },
      password: { required: true, minLength: true }
    };
  }

  ngOnInit() {
    this.defaultAvatar = AppConfig.defaultAvatar;

    this.form = this.formBuilder.group({
      gender: ["male", Validators.required],
      status: ["active", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      username: [
        "",
        [
          Validators.required,
          Validators.maxLength(40),
          (username: FormControl) => {
            if (username.value != "") {
              // console.log('username', username.value);
              this.authService.checkUsername(username.value).then(
                data => {
                  // console.log("data ", data);
                  username.setErrors(null);
                  this.formErrors.username.unique = true;
                },
                reason => {
                  console.log("error ", reason);
                  this.formErrors.username.unique = false;
                  username.setErrors({ unique: false });
                }
              );
            }
            return null;
          }
        ]
      ],
      password: ["", [Validators.required, Validators.minLength(6)]],
      totalBottlesThrown: [""],
      extraBottlesCount: [""],
      bottlesCount: [""],
      createdAt: [new Date(), Validators.required],
      image: [""],
      //  isActive: [true],
      // nextRefill: [''],
      ISOCode: new FormControl("")
    });

    this.form.valueChanges.subscribe(() => {
      this.onFormValuesChanged();
    });

    this.filteredOptions = this.form.controls.ISOCode.valueChanges.pipe(
      startWith(""),
      map(val => this.filter(val))
    );
  }

  filter(val: string): any[] {
    return countries.filter(option =>
      option.iso.toLowerCase().includes(val.toLowerCase())
    );
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
    if (inputValue.files && inputValue.files[0]) {
      // this.form.value.file = inputValue.files[0];
      this.blobFileToUpload = inputValue.files[0];
      console.log("this.blobFileToUpload ", this.blobFileToUpload);
      const reader: FileReader = new FileReader();
      reader.readAsDataURL(inputValue.files[0]);
      reader.onload = event => {
        this.image = event.target["result"];
      };
    }
  }

  browseProfilePicture() {
    this.fileSelector.nativeElement.click();
    return false;
  }

  removeFile() {
    this.image = "";
    this.form.value.image = "";
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
            this.form.value.image = val[0].file;
            this.submit();
          },
          reason => {
            console.log("error ", reason);
          }
        );
      } else {
        this.form.value.image = image;
        this.submit();
      }
    } else {
      this.submit();
    }
  }

  submit() {
    delete this.form.value.id;
    console.log("form add", this.form.value);
    // this.usersService.newItem(this.form.value).then(
    //   val => {
    //     this.helpersService.showActionSnackbar(PageAction.Create, true, "user");
    //     this.router.navigate(["/users/list"]);
    //     this.progressBarService.toggle();
    //   },
    //   reason => {
    //     this.helpersService.showActionSnackbar(
    //       PageAction.Create,
    //       false,
    //       "user",
    //       { style: "failed-snackbar" }
    //     );
    //     this.progressBarService.toggle();

    //     console.log("error ", reason);
    //   }
    // );
  }

  onSubmit() {
    this.progressBarService.toggle();

    var image = "";
    if (this.image !== "") image = this.blobFileToUpload;
    else {
      this.form.value.image = "";
      this.blobFileToUpload = "";
      this.image = "";
    }
    this.uploadImage(image);
  }
}
