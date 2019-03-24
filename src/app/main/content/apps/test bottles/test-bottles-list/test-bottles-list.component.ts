import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { fuseAnimations } from "../../../../../core/animations";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import {
  MatPaginator,
  MatSort,
  MatDialogRef,
  MatDialog,
  PageEvent
} from "@angular/material";
import { FuseConfirmDialogComponent } from "../../../../../core/components/confirm-dialog/confirm-dialog.component";
import { AppConfig } from "../../../../shared/app.config";
import { DataSource } from "@angular/cdk/collections";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import "rxjs/add/operator/startWith";
import "rxjs/add/observable/merge";
import "rxjs/add/operator/map";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/observable/fromEvent";
import { FuseUtils } from "../../../../../core/fuseUtils";

import { ProgressBarService } from "../../../../../core/services/progress-bar.service";
import { countries } from "typed-countries";
import { map, startWith } from "rxjs/operators";
import { Shore } from "../../shores/shore.model";
import { ShoresService } from "../../shores/shores.service";
import { TestBottlesService } from "../test-bottles.service";

@Component({
  selector: "app-test-bottles-list",
  templateUrl: "./test-bottles-list.component.html",
  styleUrls: ["./test-bottles-list.component.scss"],
  animations: fuseAnimations
})
export class TestBottlesListComponent implements OnInit {
  defaultProductIcon: string;

  searchInput: FormControl;
  dialogRef: any;

  displayedColumns = [
    "text_en",
    "text_ar",
    "status",
    "bottleCount",
    "btns"
  ];
  itemsCount: number = 0;

  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild("filter")
  filter: ElementRef;
  @ViewChild(MatSort)
  sort: MatSort;

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  data = []

  constructor(
    private testBottleServices: TestBottlesService,
    private progressBarService: ProgressBarService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.testBottleServices
      .getItems()
      .then(items => {
        this.data = items;
      });

  }
  getItemsPaging() {
  }

}



