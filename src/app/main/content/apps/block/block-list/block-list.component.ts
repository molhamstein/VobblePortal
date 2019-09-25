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
import { BlockService } from "../block.service";
import { ExtendMessageService } from "../../extend-message/extend-message.service";

@Component({
  selector: "app-block-list",
  templateUrl: "./block-list.component.html",
  styleUrls: ["./block-list.component.scss"],
  animations: fuseAnimations
})
export class BlockListComponent implements OnInit {
  searchInput: FormControl;
  dialogRef: any;

  filtersForm: FormGroup;

  dataSource: FilesDataSource | null;
  displayedColumns = [
    "blocker",
    "blocker-gender",
    "user",
    "user-gender",
    "createdAt"
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
    private blockService: BlockService,
    private extendMessageService: ExtendMessageService,
    private progressBarService: ProgressBarService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.dataSource = new FilesDataSource(
      this.blockService,
      this.paginator,
      this.sort
    );
    // Observable.fromEvent(this.filter.nativeElement, "keyup")
    // .debounceTime(150)
    // .distinctUntilChanged()
    // .subscribe(() => {
    //   if (!this.dataSource) {
    //     return;
    //   }
    //   this.dataSource.filter = this.filter.nativeElement.value;
    // });
    this.itemsCount = this.blockService.itemsCount;

    this.filtersForm = this.formBuilder.group({
      from: new FormControl(""),
      to: new FormControl(""),
      owner: new FormControl(""),
      user: new FormControl(""),

    });
  }

  owners = []
  users = []
  filterC(val: string): any[] {
    return this.owners.filter(option => option.iso.toLowerCase().includes(val));
  }

  getUserByString() {
    this.extendMessageService
      .getUserByString(this.filtersForm.value.user)
      .then((data: any) => {
        this.users = data;
      });
  }

  getOwnersByString() {
    this.extendMessageService
      .getUserByString(this.filtersForm.value.owner)
      .then((data: any) => {
        this.owners = data;
      });
  }

  keyUpUser() {
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




  keyUpOwner() {
    var lastSearch = ""
    var mainThis = this
    lastSearch = mainThis.filtersForm.value.owner
    setTimeout(function () {
      if (lastSearch == mainThis.filtersForm.value.owner) {
        // mainThis.getItemsPaging()
        if (lastSearch != "")
          mainThis.getOwnersByString()
      }
    }, 1500);

  }



  getItemsPaging(isFilter = false) {
    if (isFilter) {
      this.paginator.pageIndex = 0
    }

    var filter = Object.assign({}, this.filtersForm.value)
    if (filter.user != "")
      filter['userId'] = this.users.filter(function (el) {
        return el.username <= filter.user
      })[0].id;

      if (filter.owner != "")
      filter['ownerId'] = this.owners.filter(function (el) {
        return el.username <= filter.owner
      })[0].id;

    
    this.blockService
      .getItemsPaging(
        this.paginator.pageIndex,
        this.paginator.pageSize,
        filter
      )
      .then(items => {
        return items;
      });
  }
  exportAsExcelFile(): void {
    this.blockService.export(this.filtersForm.value).then(res => {
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
        this.blockService.deleteItem(contact);
        this.itemsCount--;
      }
      this.confirmDialogRef = null;
    });
  }

  clearFilter() {
    this.paginator.pageIndex = 0
    this.filtersForm.reset();
    this.getItemsPaging();
    this.blockService
      .getItemsCount()
      .then(count => (this.itemsCount = count));
  }

  applyFilter() {
    var filter = Object.assign({}, this.filtersForm.value)
    if (filter.user != "")
      filter['userId'] = this.users.filter(function (el) {
        return el.username <= filter.user
      })[0].id;

      if (filter.owner != "")
      filter['ownerId'] = this.owners.filter(function (el) {
        return el.username <= filter.owner
      })[0].id;


    this.getItemsPaging(true);
    this.blockService
      .getItemsCount(filter)
      .then(count => (this.itemsCount = count));
    // this.progressBarService.toggle();

    // this.blockService.filterBy(this.filtersForm.value).then(
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
    private blockService: BlockService,
    private _paginator: MatPaginator,
    private _sort: MatSort
  ) {
    super();
    this.filteredData = this.blockService.items;
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    const displayDataChanges = [
      this.blockService.onItemsChanged,
      this._paginator.page,
      this._filterChange,
      this._sort.sortChange
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      let data = this.blockService.items.slice();

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
