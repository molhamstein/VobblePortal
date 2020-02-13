import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialog, MatDialogRef, MatPaginator, MatSort } from "@angular/material";
import "rxjs/add/observable/fromEvent";
import "rxjs/add/observable/merge";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/map";
import "rxjs/add/operator/startWith";
import { fuseAnimations } from "../../../../../core/animations";
import { FuseConfirmDialogComponent } from "../../../../../core/components/confirm-dialog/confirm-dialog.component";
import { ProgressBarService } from "../../../../../core/services/progress-bar.service";
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



