import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { fuseAnimations } from "../../../../../core/animations";
import { ProgressBarService } from "../../../../../core/services/progress-bar.service";
import { PageAction } from "../../../../shared/enums/page-action";
import { HelpersService } from "../../../../shared/helpers.service";
import { UploadFileService } from "../../../../shared/upload-file.service";
import { AuthService } from "../../../pages/authentication/auth.service";
import { Shore } from "../../shores/shore.model";
import { ShoresService } from "../../shores/shores.service";
import { Topic } from "../../topics/topic.model";
import { TopicsService } from "../../topics/topics.service";
import { User } from "../../users/user.model";
import { UsersService } from "../../users/users.service";
import { TestBottlesService } from './../test-bottles.service';

@Component({
  selector: "app-test-bottles-new",
  templateUrl: "./test-bottles-new.component.html",
  styleUrls: ["./test-bottles-new.component.scss"],
  animations: fuseAnimations
})
export class TestBottlesNewComponent implements OnInit {
  form: FormGroup;
  formErrors: any;
  blobFileToUpload;
  video: string = "";
  shores: Shore[] = [];
  genders = [{ "view": "Male", "value": "male" }, { "view": "Female", "value": "female" }, { "view": "None", "value": "" }];
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
    private testBottlesService: TestBottlesService
  ) {
    this.currentUser = authService.getCurrentUser();
  }

  ngOnInit() {
    this.getShores();
    this.form = this.formBuilder.group({
      shoreId: [""],
      gender: [""],
      userId: [""],
      ownerId: new FormControl(this.currentUser)
    });

    this.filteredUsers = this.form["controls"].ownerId.valueChanges.pipe(
      startWith(""),
      map(val => this.filter(val))
    );

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



  videos = {}
  oneVideo = {}
  data = [];
  submit() {
    this.data = [];
    this.oneVideo = {}
    this.videos = {}

    // delete this.form.value.id;
    this.form.value.userId = this.form.value.ownerId.id;
    this.testBottlesService.getBottle(this.form.value).then(
      val => {

        this.videos = val
        this.oneVideo = this.videos[0];

        for (const key in this.videos) {
          if (this.videos.hasOwnProperty(key)) {
            const element = this.videos[key];
            
            this.data.push(element);
          }
        }
        // this.router.navigate(["/bottles/list"]);
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
    
    this.submit();
    // this.uploadFiles(this.blobFileToUpload);
  }
}
