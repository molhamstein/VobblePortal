import { FilterComponent } from './../../../../dialog/filter/filter.component';
import { Subject } from 'rxjs/Subject';
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
import { map, startWith, debounceTime, distinctUntilChanged } from "rxjs/operators";

@Component({
  selector: "app-users-list",
  templateUrl: "./users-list.component.html",
  styleUrls: ["./users-list.component.scss"],
  animations: fuseAnimations
})
export class UsersListComponent implements OnInit {
  chipsFilter = [];
  filtersObject = { "gender": "", "status": "", "country": "", "agency": "", "isHost": "", "isVip": "", "lastLoginFrom": "", "createdFrom": "", "createdTo": "" }
  filterKey = { "gender": true, "status": true, "country": true, "agency": true, "isHost": true, "lastLoginFrom": true, "createdFrom": true, "isVip": true, "createdTo": true }

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
    "bottles",
    "replies",
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


  model: string;
  modelChanged: Subject<string> = new Subject<string>();


  constructor(
    private usersService: UsersService,
    public dialog: MatDialog,
    private progressBarService: ProgressBarService,
    private formBuilder: FormBuilder
  ) {
    this.usersService.onItemsCountChanged.subscribe(
      count => (this.itemsCount = count)
    );

    this.modelChanged.pipe(
      debounceTime(300),
      distinctUntilChanged())
      .subscribe(model => this.model = model);
  }

  openFilter() {
    let dialogRef = this.dialog.open(FilterComponent, {
      width: '600px',
      data: { "filter": this.filtersObject, "filterKey": this.filterKey }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.filtersObject = result;
        this.getItemsPaging(true);
        this.chipsFilter = [];
        for (let key in this.filtersObject) {
          if (this.filtersObject[key] != "")
            this.chipsFilter.push({ key: key, value: this.filtersObject[key] });
        }
      }
    });

  }


  ngOnInit() {

    this.defaultAvatar = AppConfig.defaultAvatar;
    this.dataSource = new FilesDataSource(
      this.usersService,
      this.paginator,
      this.sort
    );

    Observable.fromEvent(this.filter.nativeElement, "keyup")
      .debounceTime(700)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
        this.getItemsPaging();
      });
  }

  filterC(val: string): any[] {
    return countries.filter(option => option.iso.toLowerCase().includes(val));
  }

  clearFilter() {
    this.paginator.pageIndex = 0
    this.chipsFilter = []
    this.filtersObject = { "gender": "", "status": "", "isVip": "", "isHost": "", "agency": "", "country": "", "lastLoginFrom": "", "createdFrom": "", "createdTo": "" }
    this.filter.nativeElement.value = "";
    this.usersService.getItemsCount("");
    this.getItemsPaging();
  }

  getItemsPaging(isFilter = false) {
    if (isFilter) {
      this.paginator.pageIndex = 0
    }
    this.usersService
      .getItemsPaging(
        this.paginator.pageIndex,
        this.paginator.pageSize,
        this.filtersObject,
        this.filter.nativeElement.value
      )
      .then(items => {
        this.dataSource.connect();
      });
  }

  exportAsExcelFile(): void {
    this.usersService.export(this.filtersObject).then(res => {
      if (res) {
        window.location.href = res;
      }
    });
  }

  openNewTab(contact) {
    window.open(AppConfig.siteUrl + "users/view/" + contact.id)
  }

  isNewUser(date) {
    var diff = Math.abs(new Date().getTime() - new Date(date).getTime()) / 3600000;

    if (diff > 24 * 7)
      return "notActiveUser"
    else if (diff > 24)
      return "fewActiveUser"
    else if (diff > 6)
      return "meniActiveUser"
    else
      return "activeUser"
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
      let data = this.usersService.items;

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

  disconnect() { }
}
