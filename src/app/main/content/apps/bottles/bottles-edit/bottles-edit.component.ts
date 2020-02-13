import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { fuseAnimations } from "../../../../../core/animations";
import { ProgressBarService } from "../../../../../core/services/progress-bar.service";
import { PageAction } from "../../../../shared/enums/page-action";
import { HelpersService } from "../../../../shared/helpers.service";
import { UploadFileService } from "../../../../shared/upload-file.service";
import { Shore } from "../../shores/shore.model";
import { ShoresService } from "../../shores/shores.service";
import { User } from "../../users/user.model";
import { UsersService } from "../../users/users.service";
import { Bottle } from "../bottle.model";
import { BottlesService } from "../bottles.service";

@Component({
  selector: "app-bottles-edit",
  templateUrl: "./bottles-edit.component.html",
  styleUrls: ["./bottles-edit.component.scss"],
  animations: fuseAnimations
})
export class BottlesEditComponent implements OnInit, OnDestroy {
  item: Bottle;
  onItemChanged: Subscription;

  form: FormGroup;
  formErrors: any;
  video: string = "";
  bottleType: string;
  blobFileToUpload;
  shores: Shore[] = [];
  users: User[] = [];

  disableSave = false;

  filteredUsers: Observable<User[]>;
  @ViewChild("file")
  fileSelector: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private helpersService: HelpersService,
    private progressBarService: ProgressBarService,
    private uploadFileService: UploadFileService,
    private shoresService: ShoresService,
    private usersService: UsersService,
    private bottlesService: BottlesService
  ) {
    this.formErrors = {
      file: { required: true },
      status: { required: true },
      createdAt: { required: true }
    };
  }

  ngOnInit() {
    this.onItemChanged = this.bottlesService.onItemChanged.subscribe(item => {
      this.item = new Bottle(item);
    });

    this.getShores();
    this.video = this.item.file;
    this.bottleType = this.item.bottleType;

    this.form = this.formBuilder.group({
      id: [this.item.id],
      file: [this.item.file],
      thumbnail: [this.item.thumbnail],
      status: [this.item.status, Validators.required],
      createdAt: [this.item.createdAt, Validators.required],
      shoreId: [this.item.shoreId],
      repliesUserCount: [this.item.repliesUserCount],
      ownerId: new FormControl(this.item.owner),
      totalWeight: new FormControl(this.item.totalWeight),
      weight: new FormControl(this.item.weight),
      addedScores: new FormControl(this.item.addedScores),
    });

    this.filteredUsers = this.form["controls"].ownerId.valueChanges.pipe(
      startWith(""),
      map(val => this.filter(val))
    );

    this.form["controls"].addedScores.valueChanges.subscribe(val => {
        this.form.patchValue({
             totalWeight: val + this.item.weight
        }); 
    })

    this.form.valueChanges.subscribe(() => {
      this.onFormValuesChanged();
    });
  }

  filter(val): User[] {
    if (val && typeof val == "string") {
      return this.users.filter(option =>
        option.username.toLowerCase().includes(val.toLowerCase())
      );
    }
  }

  onSearch(keyword) {
    this.usersService.getUsersAutocpmlete(keyword).then(items => {
      this.users = items;
    });
  }

  displayFn(user: User): string {
    return user.username;
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

  getShores() {
    this.shoresService.getItems().then(
      items => {
        this.shores = items;
      },
      error => { }
    );
  }

  readFileVideo(inputValue: any): void {
    if (inputValue.files && inputValue.files[0]) {
      this.video = "";
      this.blobFileToUpload = inputValue.files[0];

      this.uploadFiles(this.blobFileToUpload);

      const reader: FileReader = new FileReader();
      reader.readAsDataURL(inputValue.files[0]);
      reader.onload = event => {
        this.video = event.target["result"];
      };
    }
  }

  browseVideos() {
    this.fileSelector.nativeElement.click();
    return false;
  }

  onFileChange(event) {
    this.readFileVideo(event.target);
  }

  uploadFiles(file) {
    if (file && file !== "") {
      const formData: FormData = new FormData();
      if (typeof file !== "string") {
        formData.append("file", file);
        this.disableSave = true;
        if (this.bottleType == 'video') {
          this.uploadFileService.uploadFile(formData, "video").then(
            val => {
              this.form.value.thumbnail = val[0].thumbnail;
              this.form.value.file = val[0].file;
              this.disableSave = false;
            },
            reason => {
              this.disableSave = false;
            }
          );
        }
        else if (this.bottleType == 'audio') {
          this.uploadFileService.uploadFile(formData, "audio").then(
            val => {
              this.form.value.thumbnail = this.item.thumbnail;
              this.form.value.file = val[0].file;
              this.disableSave = false;
            },
            reason => {
              this.disableSave = false;
            }
          );
        }
      }
      else {
        this.form.value.thumbnail = this.item.thumbnail;
        this.form.value.file = file;
      }
    }
  }

  submit() {
    this.form.value.ownerId = this.form.value.ownerId.id || this.item.ownerId;

    this.bottlesService.editItem(this.form.value).then(
      val => {
        this.helpersService.showActionSnackbar(
          PageAction.Update,
          true,
          "bottle"
        );
        this.router.navigate(["/bottles/list"]);
        this.progressBarService.toggle();
      },
      reason => {
        this.helpersService.showActionSnackbar(
          PageAction.Update,
          false,
          "bottle",
          { style: "failed-snackbar" }
        );
        this.progressBarService.toggle();
      }
    );
  }

  activeViewStatus() {
    let data = [];
    data.push(this.item.id);
    this.bottlesService.updateViewStatus(data).then(
      val => {
        this.helpersService.showActionSnackbar(
          PageAction.Update, true, "bottle"
        );
      },
      reason => {
        this.helpersService.showActionSnackbar(
          PageAction.Update, false, "bottle",
          { style: "failed-snackbar" }
        );
      }
    );
  }

  onSubmit() {
    this.progressBarService.toggle();
    this.submit();
  }


}
