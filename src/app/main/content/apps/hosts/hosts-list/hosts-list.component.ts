import { DataSource } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatSort } from '@angular/material';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { fuseAnimations } from '../../../../../core/animations';
import { FuseConfirmDialogComponent } from '../../../../../core/components/confirm-dialog/confirm-dialog.component';
import { FuseUtils } from '../../../../../core/fuseUtils';
import { FilterComponent } from '../../../../dialog/filter/filter.component';
import { HostsService } from '../hosts.service';

@Component({
  selector: 'app-hosts-list',
  templateUrl: './hosts-list.component.html',
  styleUrls: ['./hosts-list.component.scss'],
  animations: fuseAnimations
})
export class HostsListComponent implements OnInit {


  today = new Date();
  priorDate = new Date().setDate(this.today.getDate() - 30);
  lastMonth = new Date(this.priorDate);

  chipsFilter = [{key: "startFrom", value: this.lastMonth}, {key: "startTo", value: this.today}, {key: "isHost", value: true}];
  filtersObject = { "startFrom": this.lastMonth, "startTo": this.today, "owner": "", "isHost": "true", "agency": "" };
  filterKey = { "startFrom": true, "startTo": true, "owner": true, "isHost": true, "agency": true };


  dataSource: FilesDataSource | null;
  displayedColumns = [
    "name",
    "agency",
    "callTotalCost",
    "callCount",
    "callTotalDuration",
    "giftTotalCost",
    "itemTotalCost",
    "total"
  ];


  model: string;
  modelChanged: Subject<string> = new Subject<string>();

  dialogRef: any;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private hostServ: HostsService,
    public dialog: MatDialog
  ) {


    this.modelChanged.pipe(debounceTime(300), distinctUntilChanged()).subscribe(
      model => this.model = model
    );
  }

  ngOnInit() {

    this.dataSource = new FilesDataSource(
      this.hostServ,
      this.sort
    );

  }

  openFilter() {
    let dialogRef = this.dialog.open(FilterComponent, {
      width: '600px',
      data: { "filter": this.filtersObject, "filterKey": this.filterKey }
    });

    dialogRef.afterClosed().pipe(
      map(result => {
        if (result && result.owner) result.ownerId = result.owner.id;
        return result;
      })
    ).subscribe(result => {

      if (result) {
        this.filtersObject = result;
        this.getItemsPaging(true);
        this.chipsFilter = [];
        for (let key in this.filtersObject) {
          if (this.filtersObject[key] != "" && key != "ownerId")
            this.chipsFilter.push({ key: key, value: this.filtersObject[key] });
        }
      }
    });

  }

  clearFilter() {
    this.chipsFilter = [{key: "startFrom", value: this.lastMonth}, {key: "startTo", value: this.today}, {key: "isHost", value: true}];
    this.filtersObject = { "startFrom": this.lastMonth, "startTo": this.today, "owner": "", "isHost": "true", "agency": "" };;
    this.getItemsPaging();
  }

  getItemsPaging(isFilter = false) {

    this.hostServ
      .getItemsPaging(
        this.filtersObject
      )
      .then(items => {
        this.dataSource.connect();
      });
  }

  exportAsExcelFile(): void {
    this.hostServ.export(this.filtersObject).then(res => {
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
    private hostService: HostsService,
    private _sort: MatSort
  ) {
    super();
    this.filteredData = this.hostService.items;
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    const displayDataChanges = [
      this.hostService.onItemsChanged,
      this._filterChange,
      this._sort.sortChange
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      let data = this.hostService.items;

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
          [propertyA, propertyB] = [a.name, b.name];
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
