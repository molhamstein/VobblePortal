import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {fuseAnimations} from "../../../../../core/animations";
import {FormControl} from "@angular/forms";
import {MatPaginator, MatSort, MatDialogRef, MatDialog, PageEvent} from "@angular/material";
import {FuseConfirmDialogComponent} from "../../../../../core/components/confirm-dialog/confirm-dialog.component";
import {AppConfig} from "../../../../shared/app.config";
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import {FuseUtils} from "../../../../../core/fuseUtils";

import {BottlesService} from "../bottles.service";
import {ProgressBarService} from "../../../../../core/services/progress-bar.service";
import {Bottle} from "../bottle.model";

@Component({
  selector: 'app-bottles-list',
  templateUrl: './bottles-list.component.html',
  styleUrls: ['./bottles-list.component.scss'],
  animations   : fuseAnimations
})
export class BottlesListComponent implements OnInit {

  searchInput: FormControl;
  dialogRef: any;

  dataSource: FilesDataSource | null;
  displayedColumns = ['thumbnail', 'createdAt','status','owner','shore', 'btns'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MatSort) sort: MatSort;

  defaultIcon: string = '';
  itemsCount: number = 0;

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(private bottlesService: BottlesService,
              private progressBarService: ProgressBarService,
              public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.defaultIcon = AppConfig.defaultShoreIcon;

    this.dataSource = new FilesDataSource(this.bottlesService, this.paginator, this.sort);
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      });

    this.itemsCount =  this.bottlesService.itemsCount;
  }

  getItemsPaging(){
    this.bottlesService.getItemsPaging(this.paginator.pageIndex, this.paginator.pageSize).then(
      items =>{
        return items
      }
    );
  }


  deleteItem(contact)  {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
    this.progressBarService.toggle();
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if ( result )
      {
        this.bottlesService.deleteItem(contact);
        this.itemsCount--;
      }
      this.confirmDialogRef = null;
    });

  }

}



export class FilesDataSource extends DataSource<any>{
  _filterChange = new BehaviorSubject('');
  _filteredDataChange = new BehaviorSubject('');

  get filteredData(): any
  {
    return this._filteredDataChange.value;
  }

  set filteredData(value: any)
  {
    this._filteredDataChange.next(value);
  }

  get filter(): string
  {
    return this._filterChange.value;
  }

  set filter(filter: string)
  {
    this._filterChange.next(filter);
  }

  constructor(
    private bottlesService: BottlesService,
    private _paginator: MatPaginator,
    private _sort: MatSort
  )
  {
    super();
    this.filteredData = this.bottlesService.items;

  }


  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect() : Observable<any[]>
  {
    const displayDataChanges = [
      this.bottlesService.onItemsChanged,
      this._paginator.page,
      this._filterChange,
      this._sort.sortChange
    ];


    return Observable.merge(...displayDataChanges).map(() => {
      let data = this.bottlesService.items.slice();

      data = this.filterData(data);

      this.filteredData = [...data];

      data = this.sortData(data);

      // Grab the page's slice of data.
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      //return data.splice(startIndex, this._paginator.pageSize);

      return data;
    });
  }


  filterData(data)
  {
    if ( !this.filter )
    {
      return data;
    }
    return FuseUtils.filterArrayByString(data, this.filter);
  }

  sortData(data): any[]
  {
    if ( !this._sort.active || this._sort.direction === '' )
    {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch ( this._sort.active )
      {
        case 'createdAt':
          [propertyA, propertyB] = [a.createdAt, b.createdAt];
          break;
        case 'weight':
          [propertyA, propertyB] = [a.weight, b.weight];
          break;
        case 'status':
          [propertyA, propertyB] = [a.status, b.status];
          break;
        case 'shore':
          [propertyA, propertyB] = [a.shore.name_en, b.shore.name_en];
          break;
        case 'owner':
          [propertyA, propertyB] = [a.userneme, b.userneme];
          break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }

  disconnect()
  {
  }
}
