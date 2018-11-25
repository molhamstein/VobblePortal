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
    "lastLogin",
    "gender",
    "country",
    "totalBottlesThrown",
    "extraBottlesCount",
    "bottlesCount",
    "repliesBottlesCount",
    "foundBottlesCount",
    "repliesReceivedCount",
    "status",
    "btns"
  ];
  itemsCount = 0;

  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild("filter")
  filter: ElementRef;
  @ViewChild(MatSort)
  sort: MatSort;

  exportLink;

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
    this.getItemsPaging();
    this.usersService.getItemsCount().then(count => (this.itemsCount = count));
  }

  applyFilter() {
    const count_api =
      AppConfig.apiUrl +
      "users/count?" +
      this.usersService.getFilterString(this.filtersForm.value, true);
    console.log("count_api ", count_api);

    this.usersService
      .getItemsCount(count_api)
      .then(count => (this.itemsCount = count));

    const api = this.usersService.getFilterString(this.filtersForm.value);
    console.log(api);
    this.usersService.getItemsPaging(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      api
    );
    // this.progressBarService.toggle();
    // // console.log("filtersForm", this.filtersForm.value);
    // this.usersService.filterBy(this.filtersForm.value).then(
    //   val => {
    //     // this.helpersService.showActionSnackbar(PageAction.Create, true, 'user');
    //     this.progressBarService.toggle();
    //   },
    //   reason => {
    //     // this.helpersService.showActionSnackbar(PageAction.Create, false, 'user', {style: 'failed-snackbar'});
    //     this.progressBarService.toggle();
    //     console.log("error ", reason);
    //   }
    // );
  }

  applySearch() {
    // this.getItemsPaging();
    this.progressBarService.toggle();
    this.usersService.searchFor(this.filter.nativeElement.value).then(
      val => {
        this.progressBarService.toggle();
      },
      reason => {
        this.progressBarService.toggle();
        console.log("error ", reason);
      }
    );
  }

  getItemsPaging() {
    this.usersService
      .getItemsPaging(
        this.paginator.pageIndex,
        this.paginator.pageSize,
        this.usersService.getFilterString(this.filtersForm.value)
      )
      .then(items => {
        return items;
      });
  }

  exportAsExcelFile(): void {
    this.usersService.export(this.filtersForm.value).then(res => {
      if (res) {
        console.log(res);
        window.location.href = res;
      }
    });
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
