import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { fuseAnimations } from '../../../../../core/animations';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, MatSort } from '@angular/material';
import { AgenciesService } from '../agencies.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { DataSource } from '@angular/cdk/table';
import { FuseUtils } from '../../../../../core/fuseUtils';
import { AppConfig } from '../../../../shared/app.config';

@Component({
  selector: 'app-list-agency',
  templateUrl: './list-agency.component.html',
  styleUrls: ['./list-agency.component.scss'],
  animations: fuseAnimations
})
export class ListAgencyComponent implements OnInit {


  searchInput: FormControl;

  dataSource: FilesDataSource | null;

  displayedColumns = [
    "name",
    "createdAt",
    "status",
  ];

  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  @ViewChild("filter")
  filter: ElementRef;

  @ViewChild(MatSort)
  sort: MatSort;

  itemsCount: number = 0;

  constructor(private agencyService: AgenciesService, private formBuilder: FormBuilder) {
    this.agencyService.onItemsCountChanged.subscribe(
      count => (this.itemsCount = count)
    );
  }

  ngOnInit() {

    this.dataSource = new FilesDataSource(
      this.agencyService,
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

  getItemsPaging(isFilter = false) {
    if (isFilter) {
      this.paginator.pageIndex = 0
    }

    this.agencyService.getItemsPaging(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      "",
    ).then(items => {
      this.dataSource.connect();
    });
  }

  exportAsExcelFile(): void {

  }

  openNewTab(contact) {
    window.open(AppConfig.siteUrl + "agencies/view/" + contact.id)
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
    private agencyService: AgenciesService,
    private _paginator: MatPaginator,
    private _sort: MatSort
  ) {
    super();
    this.filteredData = this.agencyService.items;
  }

  connect(): Observable<any[]> {
    const displayDataChanges = [
      this.agencyService.onItemsChanged,
      this._paginator.page,
      this._filterChange,
      this._sort.sortChange
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      let data = this.agencyService.items;

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
        case "createdAt":
          [propertyA, propertyB] = [a.createdAt, b.createdAt];
          break;
        case "status":
          [propertyA, propertyB] = [a.status, b.status];
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
