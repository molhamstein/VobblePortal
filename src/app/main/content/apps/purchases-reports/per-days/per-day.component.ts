import { DataSource } from "@angular/cdk/collections";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material";
import "rxjs/add/observable/fromEvent";
import "rxjs/add/observable/merge";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/map";
import "rxjs/add/operator/startWith";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { fuseAnimations } from "../../../../../core/animations";
import { FuseViewItemsComponent } from '../../../../../core/components/view-items/view-items.component';
import { PurchasesReportsService } from './../purchases-reports.service';

@Component({
  selector: "app-per-day",
  templateUrl: "./per-day.component.html",
  styleUrls: ["./per-day.component.scss"],
  animations: fuseAnimations
})
export class PerDayComponent implements OnInit {
  filtersForm: FormGroup;
  perUserChanger;
  dataSource: FilesDataSource | null;
  totalDataSource: TotalDataSource | null;
  dialogRef: any;


  ngOnInit() {
    var today = new Date();
    var lastMonth = new Date(new Date().setDate(today.getDate() - 30));
    this.filtersForm = this.formBuilder.group({
      from: new FormControl(lastMonth),
      to: new FormControl(today),
    });
  }

  applyFilter() {
    this.purchaseSer.getItemsPerDay(this.filtersForm.value)
  }
  constructor(
    private formBuilder: FormBuilder, private purchaseSer: PurchasesReportsService, public dialog: MatDialog,
  ) {
    this.dataSource = new FilesDataSource(
      this.purchaseSer,
    );
    this.totalDataSource = new TotalDataSource(
      this.purchaseSer,
    );
  }

  exportAsExcelFile() {
    this.purchaseSer.exportAsExcelFile(this.filtersForm.value)
  }

  clearFilter() {
    this.ngOnInit()
    this.purchaseSer.getItemsPerDay(this.filtersForm.value)

  }

  viewItems(data) {
    this.dialogRef = this.dialog.open(FuseViewItemsComponent, {
      width: '500px',
      data: { data: data },
      disableClose: false
    });

  }


  displayedColumns = [
    "date",
    "totalSpentCoins",
    "coins",
    "bottle",
    "gender",
    "country",
    "extendChat",
    "unlockchat",
    "filterByType",
    "reply",
    "gift",
    "call"
  ];

  disconnect() { }
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
    private purchaseSer: PurchasesReportsService,
  ) {
    super();
    this.filteredData = this.purchaseSer.perDay;
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    const displayDataChanges = [
      this.purchaseSer.onePerDaysChanged,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      let data = this.purchaseSer.perDay.slice();

      return data;
    });
  }





  disconnect() { }
}

export class TotalDataSource extends DataSource<any> {
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
    private purchaseSer: PurchasesReportsService,
  ) {
    super();
    this.filteredData = this.purchaseSer.totalPerDay;
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    const displayDataChanges = [
      this.purchaseSer.totalPerDaysChanged,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      let data = this.purchaseSer.totalPerDay.slice();

      return data;
    });
  }





  disconnect() { }
}

