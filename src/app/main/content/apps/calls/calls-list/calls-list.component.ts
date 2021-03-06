import { DataSource } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatPaginator, MatSort } from '@angular/material';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { fuseAnimations } from '../../../../../core/animations';
import { FuseConfirmDialogComponent } from '../../../../../core/components/confirm-dialog/confirm-dialog.component';
import { FuseUtils } from '../../../../../core/fuseUtils';
import { FilterComponent } from '../../../../dialog/filter/filter.component';
import { CallsService } from '../calls.service';

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



      return data;
    });
  }

  filterData(data) {
    if (!this.filter) {
      return data;
    }
    return FuseUtils.filterArrayByString(data, this.filter);
  }
  
  disconnect() { }
}
