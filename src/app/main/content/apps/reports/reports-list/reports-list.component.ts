import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { fuseAnimations } from "../../../../../core/animations";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";

import {
  MatPaginator,
  MatSort,
  MatDialogRef,
  MatDialog
} from "@angular/material";
import { FuseConfirmDialogComponent } from "../../../../../core/components/confirm-dialog/confirm-dialog.component";
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
import { ReportsService } from "../reports.service";

@Component({
  selector: "app-reports-list",
  templateUrl: "./reports-list.component.html",
  styleUrls: ["./reports-list.component.scss"],
  animations: fuseAnimations
})
export class ReportsListComponent implements OnInit {
  searchInput: FormControl;
  dialogRef: any;

  filtersForm: FormGroup;

  dataSource: FilesDataSource | null;
  displayedColumns = [
    "report_Type_en",
    "report_Type_ar",
    "owner",
    "createdAt",
    "bottle_owner",
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

  constructor(
    private reportsService: ReportsService,
    private progressBarService: ProgressBarService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.dataSource = new FilesDataSource(
      this.reportsService,
      this.paginator,
      this.sort
    );
    Observable.fromEvent(this.filter.nativeElement, "keyup")
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
    this.itemsCount = this.reportsService.itemsCount;

    this.filtersForm = this.formBuilder.group({
      from: new FormControl(""),
      to: new FormControl("")
    });
  }
  getItemsPaging(isFilter = false) {
    if (isFilter) {
      this.paginator.pageIndex = 0
    }
    this.reportsService
      .getItemsPaging(
        this.paginator.pageIndex,
        this.paginator.pageSize,
        this.filtersForm.value
      )
      .then(items => {
        return items;
      });
  }
  exportAsExcelFile(): void {
    this.reportsService.export(this.filtersForm.value).then(res => {
      if (res) {
        console.log(res);
        window.location.href = res;
      }
    });
  }

  deleteItem(contact) {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage =
      "Are you sure you want to delete?";
    this.progressBarService.toggle();
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reportsService.deleteItem(contact);
        this.itemsCount--;
      }
      this.confirmDialogRef = null;
    });
  }

  clearFilter() {
    this.paginator.pageIndex = 0
    this.filtersForm.reset();
    this.getItemsPaging();
    this.reportsService
      .getItemsCount()
      .then(count => (this.itemsCount = count));
  }

  applyFilter() {
    this.getItemsPaging(true);
    this.reportsService
      .getItemsCount(this.filtersForm.value)
      .then(count => (this.itemsCount = count));
    // this.progressBarService.toggle();

    // this.reportsService.filterBy(this.filtersForm.value).then(
    //   val => {
    //     this.progressBarService.toggle();
    //   },
    //   reason => {
    //     this.progressBarService.toggle();

    //     console.log("error ", reason);
    //   }
    // );
  }
}

export class FilesDataSource extends DataSource<any> {
  _filterChange = new BehaviorSubject("");
  _filteredDataChange = new BehaviorSubject("");

  get filteredData(): any {
    return this._filteredDataChange.value;
  }

  set filteredData(value: any) {
    this._filteredDataChange.next(value);
  }

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  constructor(
    private reportsService: ReportsService,
    private _paginator: MatPaginator,
    private _sort: MatSort
  ) {
    super();
    this.filteredData = this.reportsService.items;
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    const displayDataChanges = [
      this.reportsService.onItemsChanged,
      this._paginator.page,
      this._filterChange,
      this._sort.sortChange
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      let data = this.reportsService.items.slice();

      data = this.filterData(data);

      this.filteredData = [...data];

      data = this.sortData(data);

      return data;
    });
  }

  filterData(data) {
    if (!this.filter) {
      return data;
    }
    return FuseUtils.filterArrayByString(data, this.filter);
  }

  sortData(data): any[] {
    if (!this._sort.active || this._sort.direction === "") {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = "";
      let propertyB: number | string = "";

      switch (this._sort.active) {
        case "reportType":
          [propertyA, propertyB] = [a.reportType, b.reportType];
          break;
        case "createdAt":
          [propertyA, propertyB] = [a.createdAt, b.createdAt];
          break;
        case "owner":
          [propertyA, propertyB] = [a.owner.username, b.owner.username];
          break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (
        (valueA < valueB ? -1 : 1) * (this._sort.direction === "asc" ? 1 : -1)
      );
    });
  }

  disconnect() { }
}
