import { ItemsService } from './../items/items.service';
import { ExtendMessageService } from './extend-message.service';
import { FuseUtils } from './../../../../core/fuseUtils';
import { fuseAnimations } from './../../../../core/animations';
import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";

import {
  MatPaginator,
  MatSort,
  MatDialogRef,
  MatDialog
} from "@angular/material";
import { DataSource } from "@angular/cdk/collections";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import "rxjs/add/operator/startWith";
import "rxjs/add/observable/merge";
import "rxjs/add/operator/map";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/observable/fromEvent";
import { ProgressBarService } from '../../../../core/services/progress-bar.service';
import { map, startWith, debounceTime, distinctUntilChanged } from "rxjs/operators";
import { ReportsService } from '../reports/reports.service';
import { FuseViewUserComponent } from '../../../../core/components/view-user/view-user.component';


@Component({
  selector: "app-extend-message",
  templateUrl: "./extend-message.component.html",
  styleUrls: ["./extend-message.component.scss"],
  animations: fuseAnimations
})
export class ExtendMessageComponent implements OnInit {
  searchInput: FormControl;
  dialogRef: any;

  filtersForm: FormGroup;
  filteredOptions: Observable<string[]>;
  dataSource: FilesDataSource | null;
  dataSourceRelatedUser: FilesDataSourceRelated | null;
  displayedColumns = [
    "owner",
    "gender",
    "country",
    "count",
    "product"
  ];


  dataSourceItem: FilesDataSourceItem | null;
  displayedColumnsItem = [
    "owner",
    "related",
    "country",
    "product",
    "storeType",
    "startAt",
    "endAt",
    "isConsumed",
    "valid",
    "btns"
  ];


  itemsCount: number = 0;
  itemsCountRelated:number=0;
  mainItemsCount: number = 0
  curentTab = 0;

  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  // @ViewChild("filter")
  // filter: ElementRef;
  @ViewChild(MatSort)
  sort: MatSort;

  viewUserRef: MatDialogRef<FuseViewUserComponent>;

  constructor(
    private extendMessageService: ExtendMessageService,
    private progressBarService: ProgressBarService,
    private itemsService: ItemsService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {
    this.itemsCount = this.extendMessageService.getLengthItem();
    this.itemsService.onItemsCountChanged.subscribe(count => {
      this.mainItemsCount = count;
    });
  }

  ngOnInit() {
    this.dataSource = new FilesDataSource(
      this.extendMessageService,
      this.paginator,
      this.sort
    );

    this.dataSourceRelatedUser = new FilesDataSourceRelated(
      this.extendMessageService,
      this.paginator,
      this.sort
    );



    this.filtersForm = this.formBuilder.group({
      from: new FormControl(""),
      to: new FormControl(""),
      user: new FormControl(""),
      relatedUser: new FormControl(""),
    });
  }

  viewUsers(userId, isOwner) {

    this.extendMessageService
      .getUserRelated(userId, isOwner)
      .then((data: any) => {
        console.log(data);
        this.viewUserRef = this.dialog.open(FuseViewUserComponent, {
          width: '7 00px',
          data: { "data": data, "isOwner": isOwner },
          disableClose: false
        });
      });

  }
  countries = []
  relatedUser = []
  filterC(val: string): any[] {
    return this.countries.filter(option => option.iso.toLowerCase().includes(val));
  }
  getItemsPaging(isFilter = false) {
    if (isFilter) {
      this.paginator.pageIndex = 0
    }

  }

  getUserByString() {
    this.extendMessageService
      .getUserByString(this.filtersForm.value.user)
      .then((data: any) => {
        this.countries = data;
      });
  }

  getRelatedUserByString() {
    this.extendMessageService
      .getUserByString(this.filtersForm.value.relatedUser)
      .then((data: any) => {
        this.relatedUser = data;
      });
  }



  keyUp() {
    var lastSearch = ""
    var mainThis = this
    lastSearch = mainThis.filtersForm.value.user
    setTimeout(function () {
      if (lastSearch == mainThis.filtersForm.value.user) {
        // mainThis.getItemsPaging()
        if (lastSearch != "")
          mainThis.getUserByString()
      }
    }, 1500);

  }


  
  
  relatedUserkeyUp() {
    var lastSearch = ""
    var mainThis = this
    lastSearch = mainThis.filtersForm.value.user
    setTimeout(function () {
      if (lastSearch == mainThis.filtersForm.value.user) {
        // mainThis.getItemsPaging()
        if (lastSearch != "")
          mainThis.getRelatedUserByString()
      }
    }, 1500);

  }




  changeTab($event) {
    this.paginator.pageIndex = 0
    console.log($event.index)
    var filter = Object.assign({}, this.filtersForm.value)
    if (filter.user != "")
      filter['userId'] = this.countries.filter(function (el) {
        return el.username <= filter.user
      })[0].id;

    this.curentTab = $event.index
    this.getItemsPaging(true);
    if ($event.index == 0)
      this.extendMessageService
        .getChatExtendReportOwner(filter)
        .then((data: any) => {
          this.dataSource.connect();

          this.itemsCount = this.extendMessageService.getLengthItem();
        });
    else if ($event.index == 1)
      this.extendMessageService
        .getChatExtendReportRelatedUser(filter)
        .then((data: any) => {
          // this.dataSourceRelatedUser.connect();

          this.itemsCountRelated = this.extendMessageService.getLengthItemRelated();
        });
    else {
      if (filter.relatedUser != "")
        filter['relatedUserId'] = this.relatedUser.filter(function (el) {
          return el.username <= filter.relatedUser
        })[0].id;
      filter.typeItem = "Chat Extend"
      this.getMainItemsPaging(filter);

    }

  }

  getMainItemsPaging(filter) {
    this.itemsService
      .getItemsPaging(
        this.paginator.pageIndex,
        this.paginator.pageSize,
        filter, ""
      )
      .then(items => {
        this.dataSourceItem = new FilesDataSourceItem(
          this.itemsService,
          this.paginator,
          this.sort
        );
        this.dataSourceItem.connect();
      });
  }

  // exportAsExcelFile(): void {
  //   this.reportsService.export(this.filtersForm.value).then(res => {
  //     if (res) {
  //       console.log(res);
  //       window.location.href = res;
  //     }
  //   });
  // }


  clearFilter() {
    this.filtersForm = this.formBuilder.group({
      from: new FormControl(""),
      to: new FormControl(""),
      relatedUser: new FormControl(""),
      user: new FormControl(""),
    });
    this.applyFilter();
  }

  applyFilter() {
    var filter = Object.assign({}, this.filtersForm.value)
    if (filter.user != "")
      filter['userId'] = this.countries.filter(function (el) {
        return el.username <= filter.user
      })[0].id;
    if (this.curentTab == 0)
      this.extendMessageService
        .getChatExtendReportOwner(filter)
        .then((data: any) => {
          this.itemsCount = this.extendMessageService.getLengthItem();
        });
    else if (this.curentTab == 1)

      this.extendMessageService
        .getChatExtendReportRelatedUser(filter)
        .then((data: any) => {
          this.itemsCountRelated = this.extendMessageService.getLengthItem();
        });
    else {
      if (filter.relatedUser != "")
        filter['relatedUserId'] = this.relatedUser.filter(function (el) {
          return el.username <= filter.relatedUser
        })[0].id;
      filter.typeItem = "Chat Extend"
      this.getMainItemsPaging(filter);

    }
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
    private extendMessageService: ExtendMessageService,
    private _paginator: MatPaginator,
    private _sort: MatSort
  ) {
    super();
    this.filteredData = this.extendMessageService.items;
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    const displayDataChanges = [
      this.extendMessageService.onItemsChanged,
      this._paginator.page,
      this._filterChange,
      this._sort.sortChange
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      let data = this.extendMessageService.items.slice();

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


export class FilesDataSourceRelated extends DataSource<any> {
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
    private extendMessageService: ExtendMessageService,
    private _paginator: MatPaginator,
    private _sort: MatSort
  ) {
    super();
    this.filteredData = this.extendMessageService.itemsRelated;
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    const displayDataChanges = [
      this.extendMessageService.onItemsChanged,
      this._paginator.page,
      this._filterChange,
      this._sort.sortChange
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      let data = this.extendMessageService.itemsRelated.slice();

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

export class FilesDataSourceItem extends DataSource<any> {
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
    private itemsService: ItemsService,
    private _paginator: MatPaginator,
    private _sort: MatSort
  ) {
    super();
    this.filteredData = this.itemsService.items;
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    const displayDataChanges = [
      this.itemsService.onItemsChanged,
      this._paginator.page,
      this._filterChange,
      this._sort.sortChange
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      console.log("this.itemsService.items ", this.itemsService.items);
      let data = this.itemsService.items;

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
        case "storeType":
          [propertyA, propertyB] = [a.storeType, b.storeType];
          break;
        case "isConsumed":
          [propertyA, propertyB] = [a.isConsumed, b.isConsumed];
          break;
        case "valid":
          [propertyA, propertyB] = [a.valid, b.valid];
          break;
        case "startAt":
          [propertyA, propertyB] = [a.startAt, b.startAt];
          break;
        case "endAt":
          [propertyA, propertyB] = [a.endAt, b.endAt];
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
