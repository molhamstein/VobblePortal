import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { fuseAnimations } from "../../../../../core/animations";
import { PageAction } from "../../../../shared/enums/page-action";
import { Router } from "@angular/router";
import { HelpersService } from "../../../../shared/helpers.service";
import { AuthService } from "../../../pages/authentication/auth.service";
import { BottlesService } from "../bottles.service";
import { UploadFileService } from "../../../../shared/upload-file.service";
import { ShoresService } from "../../shores/shores.service";
import { Shore } from "../../shores/shore.model";
import { ProgressBarService } from "../../../../../core/services/progress-bar.service";
import { Observable } from "rxjs";
import { User } from "../../users/user.model";
import { map, startWith } from "rxjs/operators";
import { UsersService } from "../../users/users.service";
import { TopicsService } from "../../topics/topics.service";
import { Topic } from "../../topics/topic.model";

@Component({
  selector: "app-bottles-new",
  templateUrl: "./bottles-new.component.html",
  styleUrls: ["./bottles-new.component.scss"],
  animations: fuseAnimations
})
export class BottlesNewComponent implements OnInit {
  form: FormGroup;
  formErrors: any;
  blobFileToUpload;
  video: string = "";
  bottleType: string = "";
  shores: Shore[] = [];
  topics: Topic[] = [];
  users: User[] = [];
  currentUser: any;

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
    private topicsService: TopicsService,
    private usersService: UsersService,
    private authService: AuthService,
    private bottlesService: BottlesService
  ) {
    this.currentUser = authService.getCurrentUser();

    this.formErrors = {
      file: { required: true },
      status: { required: true },
      createdAt: { required: true }
    };
  }

  ngOnInit() {
    this.getShores();
    this.getTopics()
    this.form = this.formBuilder.group({
      file: [""],
      thumbnail: [""],
      status: ["active", Validators.required],
      createdAt: [new Date(), Validators.required],
      shoreId: [""],
      topicId: [""],
      repliesUserCount: [""],
      bottleType: "",
      ownerId: new FormControl(this.currentUser)
    });

    this.filteredUsers = this.form["controls"].ownerId.valueChanges.pipe(
      startWith(""),
      map(val => this.filter(val))
    );

    this.form["controls"].bottleType.valueChanges.subscribe(res => {
      this.bottleType = res;
    });

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
    // if (this.shores.length == 0)
    this.shoresService.getItems().then(
      items => {
        this.shores = items;
      },
      error => { }
    );
  }

  getTopics() {
    // if (this.shores.length == 0)
    this.topicsService.getItems().then(
      items => {
        this.topics = items;
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
            // 
          }
        );
      }
      else if (this.bottleType == 'audio') {
        this.uploadFileService.uploadFile(formData, "audio").then(
          val => {
            this.form.value.file = val[0].file;
            this.disableSave = false;
          },
          reason => {
            this.disableSave = false;
            // 
          }
        );
      }

    }
  }

  submit() {

    this.form.value.ownerId = this.form.value.ownerId.id;

    // 

    this.bottlesService.newItem(this.form.value).then(
      val => {
        this.helpersService.showActionSnackbar(
          PageAction.Create,
          true,
          "bottle"
        );
        this.router.navigate(["/bottles/list"]);
        this.progressBarService.toggle();
      },
      reason => {
        this.helpersService.showActionSnackbar(
          PageAction.Create,
          false,
          "bottle",
          { style: "failed-snackbar" }
        );
        this.progressBarService.toggle();
        
      }
    );
  }

  onSubmit() {
    this.progressBarService.toggle();
    // 
    this.submit();
  }
}
