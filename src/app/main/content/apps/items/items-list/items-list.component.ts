import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {fuseAnimations} from "../../../../../core/animations";
import {FormControl} from "@angular/forms";
import {MatPaginator, MatSort, MatDialogRef, MatDialog} from "@angular/material";
import {FuseConfirmDialogComponent} from "../../../../../core/components/confirm-dialog/confirm-dialog.component";
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import {FuseUtils} from "../../../../../core/fuseUtils";
import {ItemsService} from "../items.service";
import {ProgressBarService} from "../../../../../core/services/progress-bar.service";

@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.scss'],
  animations: fuseAnimations
})
export class ItemsListComponent implements OnInit {

  searchInput: FormControl;
  dialogRef: any;

  dataSource: FilesDataSource | null;
  displayedColumns = ['storeType', 'startAt', 'endAt', 'isConsumed', 'valid', 'btns'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MatSort) sort: MatSort;

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(private itemsService: ItemsService,
              private progressBarService: ProgressBarService,
              public dialog: MatDialog,) {
  }

  ngOnInit() {
    this.dataSource = new FilesDataSource(this.itemsService, this.paginator, this.sort);
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      });

  }

  deleteItem(contact) {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
    this.progressBarService.toggle();
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.itemsService.deleteItem(contact);
      }
      this.confirmDialogRef = null;
    });

  }
}

export class FilesDataSource extends DataSource<any> {
  _filterChange = new BehaviorSubject('');
  _filteredDataChange = new BehaviorSubject('');

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

  constructor(private itemsService: ItemsService,
              private _paginator: MatPaginator,
              private _sort: MatSort) {
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
      let data = this.itemsService.items.slice();

      data = this.filterData(data);

      this.filteredData = [...data];

      data = this.sortData(data);

      // Grab the page's slice of data.
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      return data.splice(startIndex, this._paginator.pageSize);
    });
  }

  filterData(data) {
    if (!this.filter) {
      return data;
    }
    return FuseUtils.filterArrayByString(data, this.filter);
  }

  sortData(data): any[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'storeType':
          [propertyA, propertyB] = [a.storeType, b.storeType];
          break;
        case 'isConsumed':
          [propertyA, propertyB] = [a.isConsumed, b.isConsumed];
          break;
        case 'valid':
          [propertyA, propertyB] = [a.valid, b.valid];
          break;
        case 'startAt':
          [propertyA, propertyB] = [a.startAt, b.startAt];
          break;
        case 'endAt':
          [propertyA, propertyB] = [a.endAt, b.endAt];
          break;
        case 'owner':
          [propertyA, propertyB] = [a.owner.username, b.owner.username];
          break;


      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }

  disconnect() {
  }
}
