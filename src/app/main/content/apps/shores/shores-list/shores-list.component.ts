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
import { fuseAnimations } from "../../../../../core/animations";
import { FuseConfirmDialogComponent } from "../../../../../core/components/confirm-dialog/confirm-dialog.component";
import { FuseUtils } from "../../../../../core/fuseUtils";
import { ProgressBarService } from "../../../../../core/services/progress-bar.service";
import { AppConfig } from "../../../../shared/app.config";
import { ShoresService } from "../shores.service";

@Component({
  selector: "app-shores-list",
  templateUrl: "./shores-list.component.html",
  styleUrls: ["./shores-list.component.scss"],
  animations: fuseAnimations
})
export class ShoresListComponent implements OnInit {
  defaultCover: string;
  defaultIcon: string;
  searchInput: FormControl;
  dialogRef: any;

  dataSource: FilesDataSource | null;
  displayedColumns = [
    "cover",
    "icon",
    "name_en",
    "name_ar",
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

  constructor(
    private shoresService: ShoresService,
    private progressBarService: ProgressBarService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.defaultCover = AppConfig.defaultShoreCover;
    this.defaultIcon = AppConfig.defaultShoreIcon;
    this.dataSource = new FilesDataSource(
      this.shoresService,
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
    this.itemsCount = this.shoresService.itemsCount;
  }
  getItemsPaging() {
    this.shoresService
      .getItemsPaging(this.paginator.pageIndex, this.paginator.pageSize)
      .then(items => {
        return items;
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
        this.shoresService.deleteItem(contact);
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
    private shoresService: ShoresService,
    private _paginator: MatPaginator,
    private _sort: MatSort
  ) {
    super();
    this.filteredData = this.shoresService.items;
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    const displayDataChanges = [
      this.shoresService.onItemsChanged,
      this._paginator.page,
      this._filterChange,
      this._sort.sortChange
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      let data = this.shoresService.items.slice();

      data = this.filterData(data);

      this.filteredData = [...data];

      data = this.sortData(data);

      // Grab the page's slice of data.
      //const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      //return data.splice(startIndex, this._paginator.pageSize);
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
        case "name_ar":
          [propertyA, propertyB] = [a.name_ar, b.name_ar];
          break;
        case "name_en":
          [propertyA, propertyB] = [a.name_en, b.name_en];
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
