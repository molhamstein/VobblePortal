import { DataSource } from "@angular/cdk/collections";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { MatDialog, MatDialogRef, MatPaginator, MatSort } from "@angular/material";
import "rxjs/add/observable/fromEvent";
import "rxjs/add/observable/merge";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/map";
import "rxjs/add/operator/startWith";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { fuseAnimations } from "../../../../../core/animations";
import { FuseConfirmDialogComponent } from "../../../../../core/components/confirm-dialog/confirm-dialog.component";
import { FuseUtils } from "../../../../../core/fuseUtils";
import { ProgressBarService } from "../../../../../core/services/progress-bar.service";
import { TypeGoodsService } from "../../type-goods/type-goods.service";
import { ItemsService } from "../items.service";
import { FilterComponent } from './../../../../dialog/filter/filter.component';
import { AppConfig } from './../../../../shared/app.config';
import { Item } from "./../item.model";



@Component({
  selector: "app-items-list",
  templateUrl: "./items-list.component.html",
  styleUrls: ["./items-list.component.scss"],
  animations: fuseAnimations
})
export class ItemsListComponent implements OnInit {
  items: Item[];
  searchInput: FormControl;
  dialogRef: any;

  chipsFilter = [];
  filtersObject = { "country": "", "createdFrom": "", "createdTo": "", "type": "" }
  filterKey = { "country": true, "createdFrom": true, "createdTo": true, "type": true }


  dataSource: FilesDataSource | null;
  displayedColumns = [
    "owner",
    "country",
    "product",
    "type",
    "price",
    "startAt",
    "endAt",
    "btns"
  ];
  itemsCount: number = 0;
  type_goods: any[];

  filteredOptions: Observable<string[]>;

  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild("filter")
  filter: ElementRef;
  @ViewChild(MatSort)
  sort: MatSort;

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(
    private itemsService: ItemsService,
    private progressBarService: ProgressBarService,
    private formBuilder: FormBuilder,
    private typeGoodsService: TypeGoodsService,
    public dialog: MatDialog
  ) {
    this.itemsService.onItemsCountChanged.subscribe(count => {
      this.itemsCount = count;
    });
  }

  ngOnInit() {

    this.dataSource = new FilesDataSource(
      this.itemsService,
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

  openFilter() {
    let dialogRef = this.dialog.open(FilterComponent, {
      width: '600px',
      data: { "filter": this.filtersObject, "filterKey": this.filterKey }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.filtersObject = result;
        this.getItemsPaging();
        this.chipsFilter = [];
        for (let key in this.filtersObject) {
          if (this.filtersObject[key] != "")
            this.chipsFilter.push({ key: key, value: this.filtersObject[key] });
        }
      }
    });

  }


  clearFilter() {
    this.chipsFilter = [];
    this.filtersObject = { "country": "", "createdFrom": "", "createdTo": "", "type": "" }
    this.filter.nativeElement.value = "";
    this.itemsService.getItemsCount("");
    this.getItemsPaging();
  }

  getItemsPaging() {
    this.itemsService
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
    this.itemsService.export(this.filtersObject).then(res => {
      if (res) {
        window.location.href = res;
      }
    });
  }

  openNewTab(contact) {
    window.open(AppConfig.siteUrl + "items/view/" + contact.id)
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
        this.itemsService.deleteItem(contact);
        this.itemsCount--;
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
