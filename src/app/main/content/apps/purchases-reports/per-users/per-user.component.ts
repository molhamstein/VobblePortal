import { PurchasesReportsService } from './../purchases-reports.service';
import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { fuseAnimations } from "../../../../../core/animations";
import { FormControl, FormBuilder, FormGroup } from "@angular/forms";
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
import { AppConfig } from "../../../../shared/app.config";
import { FuseViewUserItemsComponent } from '../../../../../core/components/view-user-items/view-user-items.component';

@Component({
  selector: "app-per-user",
  templateUrl: "./per-user.component.html",
  styleUrls: ["./per-user.component.scss"],
  animations: fuseAnimations
})
export class PerUserComponent implements OnInit {
  filtersForm: FormGroup;
  perUserChanger;
  dataSource: FilesDataSource | null;
  dialogRef: any;


  ngOnInit() {
    var today = new Date();
    var tomorrow = new Date(new Date().setDate(today.getDate() + 1));
    this.filtersForm = this.formBuilder.group({
      from: new FormControl(today),
      to: new FormControl(tomorrow),
    });
  }

  exportAsExcelFile(): void {
    this.purchaseSer.export(this.filtersForm.value).then(res => {
      if (res) {
        window.location.href = res;
      }
    });
  }

  applyFilter() {
    this.purchaseSer.getItemsPerUser(this.filtersForm.value)
  }
  constructor(
    private formBuilder: FormBuilder, private purchaseSer: PurchasesReportsService, public dialog: MatDialog,
  ) {
    this.dataSource = new FilesDataSource(
      this.purchaseSer,
    );
  }


  clearFilter() {
    this.ngOnInit()
    this.purchaseSer.getItemsPerUser(this.filtersForm.value)

  }

  viewUsers(object) {

    this.purchaseSer
      .getItemsByUser(this.filtersForm.value, object.ownerId)
      .then((data: any) => {
        console.log(data);
        this.dialogRef = this.dialog.open(FuseViewUserItemsComponent, {
          width: '7 00px',
          data: { "owner": object.owner, data: data },
          disableClose: false
        });
      });

  }


  displayedColumns = [
    "owner",
    "total",
    "product"
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
    this.filteredData = this.purchaseSer.perUsers;
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    const displayDataChanges = [
      this.purchaseSer.onePerUsersChanged,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      let data = this.purchaseSer.perUsers.slice();

      return data;
    });
  }





  disconnect() { }
}