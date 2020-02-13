import { DataSource } from "@angular/cdk/collections";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialog, MatDialogRef, MatPaginator, MatSort } from "@angular/material";
import "rxjs/add/observable/fromEvent";
import "rxjs/add/observable/merge";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/map";
import "rxjs/add/operator/startWith";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { countries } from "typed-countries";
import { fuseAnimations } from "../../../../../core/animations";
import { FuseConfirmDialogComponent } from "../../../../../core/components/confirm-dialog/confirm-dialog.component";
import { FuseUtils } from "../../../../../core/fuseUtils";
import { ProgressBarService } from "../../../../../core/services/progress-bar.service";
import { AppConfig } from "../../../../shared/app.config";
import { Shore } from "../../shores/shore.model";
import { BottlesService } from "../bottles.service";
import { FilterComponent } from './../../../../dialog/filter/filter.component';
import { BottlesViewModalComponent } from "../bottles-view-modal/bottles-view-modal.component";
import { Bottle } from "../bottle.model";
import { Router } from "@angular/router";



@Component({
  selector: "app-bottles-list",
  templateUrl: "./bottles-list.component.html",
  styleUrls: ["./bottles-list.component.scss"],
  animations: fuseAnimations
})
export class BottlesListComponent implements OnInit {

  chipsFilter = [];
  filtersObject = { "gender": "", "country": "", "shoreId": "", "createdFrom": "", "createdTo": "", "bottleType": "" }
  filterKey = { "gender": true, "country": true, "shoreId": true, "createdFrom": true, "createdTo": true, "bottleType": true, }

  filteredOptions: Observable<string[]>;
  shores: Shore[] = [];
  searchInput: FormControl;
  dialogRef: any;

  dataSource: FilesDataSource | null;
  displayedColumns = [
    "thumbnail",
    "createdAt",
    "status",
    "owner",
    "gender",
    "country",
    "shore",
    "repliesUserCount",
    "bottleCompleteCount",
    "btns"
  ];

  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild("filter")
  filter: ElementRef;
  @ViewChild(MatSort)
  sort: MatSort;

  defaultIcon: string = "";
  defaultAudioIcon: string = "";
  itemsCount: number = 0;

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(
    private bottlesService: BottlesService,
    private progressBarService: ProgressBarService,
    private router: Router,
    public dialog: MatDialog,
  ) {
    this.bottlesService.onItemsCountChanged.subscribe(
      count => (this.itemsCount = count)
    );
  }



  ngOnInit() {

    this.defaultIcon = AppConfig.defaultShoreIcon;
    this.defaultAudioIcon = AppConfig.defaultAudioIcon;

    this.dataSource = new FilesDataSource(
      this.bottlesService,
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
    this.filtersObject = { "gender": "", "country": "", "shoreId": "", "createdFrom": "", "createdTo": "", "bottleType": "" }
    this.filter.nativeElement.value = "";
    this.bottlesService.getItemsCount("");
    this.getItemsPaging();
  }

  openView(bottle: Bottle) {
    this.dialog.open(BottlesViewModalComponent, {
      width: '600px',
      data: { "bottle": bottle }
    });
  }

  openNewTab(contact) {
    this.router.navigate(["/bottles/view/" + contact.id]);
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
          if (this.filtersObject[key] != "") {
            var viewKey = key;
            if (key == "shoreId")
              viewKey = "shore";
            this.chipsFilter.push({ key: viewKey, value: this.filtersObject[key] });
          }
        }
      }
    });

  }


  getItemsPaging(isFilter = false) {
    if (isFilter) {
      this.paginator.pageIndex = 0
    }
    this.bottlesService
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
    this.bottlesService.export(this.filtersObject).then(res => {
      if (res) {

        window.location.href = res;
      }
    });
  }



  isNewBottle(date) {
    var diff = Math.abs(new Date().getTime() - new Date(date).getTime()) / 3600000;
    if (diff > 24 * 7)
      return "oldBottle"
    else if (diff > 24)
      return "fewActiveBottle"
    else if (diff > 6)
      return "meniActiveBottle"
    else
      return "newBottle"
  }

  deleteItem(contact) {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage =
      "do you want to delete the file?";
    this.progressBarService.toggle();
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result)
        this.bottlesService.deleteItem(contact, true);
      else
        this.bottlesService.deleteItem(contact, false);
      this.getItemsPaging();
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
    private bottlesService: BottlesService,
    private _paginator: MatPaginator,
    private _sort: MatSort
  ) {
    super();
    this.filteredData = this.bottlesService.items;
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    const displayDataChanges = [
      this.bottlesService.onItemsChanged,
      this._paginator.page,
      this._filterChange,
      this._sort.sortChange
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      let data = this.bottlesService.items;

      data = this.filterData(data);

      this.filteredData = [...data];

      data = this.sortData(data);

      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;

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
        case "createdAt":
          [propertyA, propertyB] = [a.createdAt, b.createdAt];
          break;
        case "weight":
          [propertyA, propertyB] = [a.weight, b.weight];
          break;
        case "status":
          [propertyA, propertyB] = [a.status, b.status];
          break;
        case "shore":
          [propertyA, propertyB] = [a.shore.name_en, b.shore.name_en];
          break;
        case "owner":
          [propertyA, propertyB] = [a.userneme, b.userneme];
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
