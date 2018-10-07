import { FormBuilder, FormControl, FormGroup } from "@angular/forms";

import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { UsersService } from "../users.service";
import { DataSource } from "@angular/cdk/collections";
import { Observable } from "rxjs/Observable";

import {
  MatPaginator,
  MatSort,
  MatDialogRef,
  MatDialog
} from "@angular/material";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import "rxjs/add/operator/startWith";
import "rxjs/add/observable/merge";
import "rxjs/add/operator/map";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/observable/fromEvent";
import { fuseAnimations } from "../../../../../core/animations";
import { FuseUtils } from "../../../../../core/fuseUtils";
import { AppConfig } from "../../../../shared/app.config";
import { FuseConfirmDialogComponent } from "../../../../../core/components/confirm-dialog/confirm-dialog.component";
import { ProgressBarService } from "../../../../../core/services/progress-bar.service";

import { countries } from "typed-countries";
import { map, startWith } from "rxjs/operators";
import { PageAction } from "../../../../shared/enums/page-action";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const EXCEL_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const EXCEL_EXTENSION = ".xlsx";

@Component({
  selector: "app-users-list",
  templateUrl: "./users-list.component.html",
  styleUrls: ["./users-list.component.scss"],
  animations: fuseAnimations
})
export class UsersListComponent implements OnInit {
  filtersForm: FormGroup;
  filteredOptions: Observable<string[]>;

  defaultAvatar: string;
  searchInput: FormControl;
  dialogRef: any;

  dataSource: FilesDataSource | null;
  displayedColumns = [
    "image",
    "name",
    "createdAt",
    "typeLogIn",
    "gender",
    "country",
    "totalBottlesThrown",
    "extraBottlesCount",
    "bottlesCount",
    "repliesBottlesCount",
    "foundBottlesCount",
    "status",
    "email",
    "btns"
  ];
  itemsCount = 0;

  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild("filter")
  filter: ElementRef;
  @ViewChild(MatSort)
  sort: MatSort;

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(
    private usersService: UsersService,
    public dialog: MatDialog,
    private progressBarService: ProgressBarService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.defaultAvatar = AppConfig.defaultAvatar;
    this.dataSource = new FilesDataSource(
      this.usersService,
      this.paginator,
      this.sort
    );
    // Observable.fromEvent(this.filter.nativeElement, "keyup")
    //   .debounceTime(150)
    //   .distinctUntilChanged()
    //   .subscribe(() => {
    //     if (!this.dataSource) {
    //       return;
    //     }
    //     this.dataSource.filter = this.filter.nativeElement.value;
    //   });
    this.itemsCount = this.usersService.itemsCount;

    this.filtersForm = this.formBuilder.group({
      gender: new FormControl(""),
      country: new FormControl(""),
      createdFrom: new FormControl(""),
      createdTo: new FormControl(""),
      status: new FormControl("")
    });

    this.filteredOptions = this.filtersForm.controls.country.valueChanges.pipe(
      startWith(""),
      map(val => this.filterC(val))
    );
  }

  filterC(val: string): any[] {
    return countries.filter(option => option.iso.toLowerCase().includes(val));
  }

  clearFilter() {
    this.filtersForm.reset();
    this.usersService.getItemsPaging(0, 10);
  }

  applyFilter() {
    this.progressBarService.toggle();
    // console.log("filtersForm", this.filtersForm.value);
    this.usersService.filterBy(this.filtersForm.value).then(
      val => {
        // this.helpersService.showActionSnackbar(PageAction.Create, true, 'user');
        this.progressBarService.toggle();
      },
      reason => {
        // this.helpersService.showActionSnackbar(PageAction.Create, false, 'user', {style: 'failed-snackbar'});
        this.progressBarService.toggle();
        console.log("error ", reason);
      }
    );
  }

  applySearch() {
    this.progressBarService.toggle();
    //console.log("key ", this.filter.nativeElement.value);
    this.usersService.searchFor(this.filter.nativeElement.value).then(
      val => {
        // this.helpersService.showActionSnackbar(PageAction.Create, true, 'user');
        this.progressBarService.toggle();
      },
      reason => {
        // this.helpersService.showActionSnackbar(PageAction.Create, false, 'user', {style: 'failed-snackbar'});
        this.progressBarService.toggle();
        console.log("error ", reason);
      }
    );
  }

  getItemsPaging() {
    this.usersService
      .getItemsPaging(this.paginator.pageIndex, this.paginator.pageSize)
      .then(items => {
        return items;
      });
  }

  exportAsExcelFile(excelFileName: string): void {
    const workBook = XLSX.utils.book_new(); // create a new blank book
    const workSheet = XLSX.utils.json_to_sheet(this.usersService.items);

    XLSX.utils.book_append_sheet(workBook, workSheet, "data"); // add the worksheet to the book
    const name = excelFileName + ".xlsx";
    XLSX.writeFile(workBook, name); // initiate a file download in browser
  }

  deleteProduct(contact) {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage =
      "Are you sure you want to delete?";
    this.progressBarService.toggle();
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.usersService.deleteUser(contact);
      }
      this.confirmDialogRef = null;
    });
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
    private usersService: UsersService,
    private _paginator: MatPaginator,
    private _sort: MatSort
  ) {
    super();
    this.filteredData = this.usersService.items;
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    const displayDataChanges = [
      this.usersService.onUsersChanged,
      this._paginator.page,
      this._filterChange,
      this._sort.sortChange
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      let data = this.usersService.items.slice();

      data = this.filterData(data);

      this.filteredData = [...data];

      data = this.sortData(data);

      // Grab the page's slice of data.
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      return data.splice(startIndex, this._paginator.pageSize);
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
        case "name":
          [propertyA, propertyB] = [a.username, b.username];
          break;
        case "gender":
          [propertyA, propertyB] = [a.gender, b.gender];
          break;
        case "email":
          [propertyA, propertyB] = [a.email, b.email];
          break;
        case "country":
          [propertyA, propertyB] = [a.country.code, b.country.code];
          break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (
        (valueA < valueB ? -1 : 1) * (this._sort.direction === "asc" ? 1 : -1)
      );
    });
  }

  disconnect() {}
}
