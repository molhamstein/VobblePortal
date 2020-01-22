import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { fuseAnimations } from '../../../../../core/animations';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { CallsService } from '../calls.service';
import { MatPaginator, MatSort, MatDialogRef, MatDialog } from '@angular/material';
import { FuseUtils } from '../../../../../core/fuseUtils';
import { FuseConfirmDialogComponent } from '../../../../../core/components/confirm-dialog/confirm-dialog.component';
import { ProgressBarService } from '../../../../../core/services/progress-bar.service';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { FilterComponent } from '../../../../dialog/filter/filter.component';

@Component({
  selector: 'app-calls-list',
  templateUrl: './calls-list.component.html',
  styleUrls: ['./calls-list.component.scss'],
  animations: fuseAnimations
})
export class CallsListComponent implements OnInit {

  chipsFilter = [];
  filtersObject = { "startFrom": "", "startTo": "", "callStatus": "", "owner": "", "relatedUser": "", "isHost": "", "relatedUserIsHost": "", "agency": "", "relatedUserAgencyId": "" };
  filterKey = { "startFrom": true, "startTo": true, "callStatus": true, "owner": true, "relatedUser": true, "isHost": true, "relatedUserIsHost": true, "agency": true, "relatedUserAgencyId": true };


  dataSource: FilesDataSource | null;
  displayedColumns = [
    "caller",
    "reciver",
    "dateCreated",
    "dateStarted",
    "dateEnded",
    "duration",
    "coinsDeducted",
    "callStatus",
  ];

  itemsCount = 0;

  model: string;
  modelChanged: Subject<string> = new Subject<string>();

  dialogRef: any;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private callServ: CallsService,
    public dialog: MatDialog
  ) {

    this.callServ.onItemsCountChanged.subscribe(
      count => (this.itemsCount = count)
    );

    this.modelChanged.pipe(debounceTime(300), distinctUntilChanged()).subscribe(
      model => this.model = model
    );
  }

  ngOnInit() {

    this.dataSource = new FilesDataSource(
      this.callServ,
      this.paginator,
      this.sort
    );

  }

  openFilter() {
    let dialogRef = this.dialog.open(FilterComponent, {
      width: '600px',
      data: { "filter": this.filtersObject, "filterKey": this.filterKey }
    });

    dialogRef.afterClosed().pipe(
      map((result) => {
        if (result) {
          if (result.agency) result.ownerAgencyId = result.agency;
          if (result.isHost) result.ownerIsHost = result.isHost;
          if (result.owner) result.ownerId = result.owner.id;
          if (result.relatedUser) result.relatedUserId = result.relatedUser.id;
        }
        return result;
      }),
    ).subscribe(result => {


      if (result) {
        this.filtersObject = result;
        this.getItemsPaging(true);
        this.chipsFilter = [];
        for (let key in this.filtersObject) {
          if (this.filtersObject[key] != "" && key != "isHost" && key != "agency" && key != "ownerId" && key != "relatedUserId")
            this.chipsFilter.push({ key: key, value: this.filtersObject[key] });
        }
      }
    });

  }

  clearFilter() {
    this.paginator.pageIndex = 0;
    this.chipsFilter = [];
    this.filtersObject = { "startFrom": "", "startTo": "", "callStatus": "", "owner": "", "relatedUser": "", "isHost": "", "relatedUserIsHost": "", "agency": "", "relatedUserAgencyId": "" };
    this.callServ.getItemsCount("");
    this.getItemsPaging();
  }

  getItemsPaging(isFilter = false) {
    if (isFilter) {
      this.paginator.pageIndex = 0
    }
    this.callServ
      .getItemsPaging(
        this.paginator.pageIndex,
        this.paginator.pageSize,
        this.filtersObject
      )
      .then(items => {
        this.dataSource.connect();
      });
  }

  exportAsExcelFile(): void {
    this.callServ.export(this.filtersObject).then(res => {
      if (res) {
        window.location.href = res;
      }
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
    private callService: CallsService,
    private _paginator: MatPaginator,
    private _sort: MatSort
  ) {
    super();
    this.filteredData = this.callService.items;
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    const displayDataChanges = [
      this.callService.onItemsChanged,
      this._paginator.page,
      this._filterChange,
      this._sort.sortChange
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      let data = this.callService.items;

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
        case "duration":
          [propertyA, propertyB] = [a.duration, b.duration];
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
