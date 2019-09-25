import { FormBuilder } from "@angular/forms";
import { FormControl } from "@angular/forms";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { AuthService } from "./../../pages/authentication/auth.service";
import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from "@angular/router";
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";
import { AppConfig } from "../../../shared/app.config";

import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";

@Injectable()
export class DashboardService {
  users: any[];
  bottles: any[];
  onBottlesChanged: BehaviorSubject<any> = new BehaviorSubject({});
  items: any[];
  allItems: {};
  onItemsChanged: BehaviorSubject<any> = new BehaviorSubject({});
  onAllItemsChanged: BehaviorSubject<any> = new BehaviorSubject({});

  orginalItems: any[];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) { }

  /**
   * Resolve
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      const today = new Date();
      let month, day, year;
      year = today.getFullYear();
      month = today.getMonth();
      day = today.getDate();
      if (month - 1 <= 0) {
        year = today.getFullYear() - 1;
      }
      const backdate = new Date(year, month - 1, day);

      const filtersForm = this.formBuilder.group({
        from: new FormControl(backdate),
        to: new FormControl(today)
      });

      const purchasesFiltersForm = this.formBuilder.group({
        from: new FormControl(backdate),
        to: new FormControl(today)
      });

      const genderFiltersForm = this.formBuilder.group({
        from: new FormControl(backdate),
        to: new FormControl(today)
      });

      Promise.all([
        this.getBottles(filtersForm.value),

        // this.getItems(null),
        this.getItems(purchasesFiltersForm.value),
        this.getAllItems(purchasesFiltersForm.value),
        // this.getUsers(null)
        this.getUsers(genderFiltersForm.value)
      ]).then(() => {
        resolve();
      }, reject);
    });
  }

  getBottles(filter): Promise<any> {
    this.bottles = [];

    return new Promise((resolve, reject) => {
      let url =
        AppConfig.apiUrl +
        "bottles/timeStateReport/?access_token=" +
        this.authService.getToken();

      console.log("filter ", filter);
      if (filter) {
        url += "&from=" + filter.from + "&to=" + filter.to;
      }

      console.log("url ", url);
      this.http.get(url).subscribe((response: any) => {
        const getDateArray = (start, end) => {
          const arr = new Array();

          const dt = new Date(start);
          while (dt <= end) {
            arr.push(new Date(dt));
            dt.setDate(dt.getDate() + 1);
          }

          return arr;
        };

        this.bottles = response.map((i, index) => {
          let tempArray = [];

          if (i[0]) {
            const fromDatesArray = getDateArray(
              filter.from,
              new Date(i[0].date.year, i[0].date.month - 1, i[0].date.day)
            );

            //   tempArray = fromDatesArray.map(val => {
            //     //  console.log(val);
            //     return {
            //       value: 0,
            //       name: val
            //     };
            //   });
          }

          i.map(inner => {
            tempArray.push({
              value: inner.count,
              name: new Date(
                inner.date.year,
                inner.date.month - 1,
                inner.date.day
              )
            });
          });
          // if (i[i.length - 1]) {
          //   const from = new Date(
          //     i[i.length - 1].date.year,
          //     i[i.length - 1].date.month - 1,
          //     i[i.length - 1].date.day
          //   );

          //   const filter2 = new Date(filter.to);
          //   const filter3 = filter2.setDate(filter2.getDate() - 1);
          //   const toDatesArray = getDateArray(from, filter3);

          //   toDatesArray.map(val => {
          //     tempArray.push({
          //       value: 0,
          //       name: val
          //     });
          //   });
          // }

          let name = "";
          switch (index) {
            case 0: {
              name = "New Users";
              break;
            }
            case 1: {
              name = "New Bottles";
              break;
            }
            case 2: {
              name = "Active Users";
              break;
            }
          }
          return {
            name: name,
            series: tempArray
          };
        });

        this.onBottlesChanged.next(this.bottles);
        resolve(this.bottles);
      }, reject);
    });
  }

  getItems(filter): Promise<any> {
    let url =
      AppConfig.apiUrl +
      "items/itemStateReport/?access_token=" +
      this.authService.getToken();

    if (filter) {
      url += "&from=" + filter.from + "&to=" + filter.to;
    }

    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe((response: any) => {
        console.log("items ", response);
        this.orginalItems = response.map(x => Object.assign({}, x));

        this.items = response.map(item => {
          return {
            name: item.country,
            value: item.count
          };
        });

        this.onItemsChanged.next(this.items);
        resolve(this.items);
      }, reject);
    });
  }

  getAllItems(filter): Promise<any> {
    let url =
      AppConfig.apiUrl +
      "items/getReportOfAllItems/?access_token=" +
      this.authService.getToken();

    if (filter) {
      if (filter.to) {
        filter.to.setHours(23)
        filter.to.setMinutes(59)
      }
      if (filter.from) {
        filter.to.setMinutes(0)
        filter.from.setHours(0)
      }


      url += "&filter=" + JSON.stringify({ "from": filter.from, "to": filter.to, "ownerId": filter.ownerId, "productsId": filter.productsId });
    }

    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe((response: any) => {
        console.log("items ", response);
        // this.orginalItems = response.map(x => Object.assign({}, x));
        this.allItems = response;

        this.onAllItemsChanged.next(this.allItems);
        resolve(this.allItems);
      }, reject);
    });
  }

  purchasesChartTypeChanged(type) {
    //  console.log("purchasesChartTypeChanged ", type);
    this.items = this.orginalItems.map(item => {
      return {
        name: item.country,
        value: item[type]
      };
    });
    //  console.log("this.items ", this.items);
    this.onItemsChanged.next(this.items);
  }

  getUsers(filter): Promise<any> {
    let url =
      AppConfig.apiUrl +
      "users/genderStateReport/?access_token=" +
      this.authService.getToken();

    if (filter) {
      url += "&from=" + filter.from + "&to=" + filter.to;
    }

    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe((response: any) => {
        console.log("users ", response);
        this.users = [
          {
            name: "Male",
            value: response.male
          },
          {
            name: "Female",
            value: response.female
          }
        ];
        resolve(this.users);
      }, reject);
    });
  }

  exportTimeStates(filter): Promise<any> {
    let url =
      AppConfig.apiUrl +
      "bottles/timeStateExport/?access_token=" +
      this.authService.getToken();

    if (filter) {
      url += "&from=" + filter.from + "&to=" + filter.to;
    }

    return new Promise((resolve, reject) => {
      // send get request
      this.http.get(url).subscribe(
        items => {
          console.log(items);
          resolve(items["path"]);
        },
        error => {
          console.log("error ", error);

          reject();
        }
      );
    });
  }

  purchasesExport(filter): Promise<any> {
    let url =
      AppConfig.apiUrl +
      "bottles/timeStateExport/?access_token=" +
      this.authService.getToken();

    if (filter) {
      url += "&from=" + filter.from + "&to=" + filter.to;
    }

    return new Promise((resolve, reject) => {
      // this.http.get(url).subscribe(
      //   items => {
      //     console.log(items);
      //     resolve(items["path"]);
      //   },
      //   error => {
      //     console.log("error ", error);
      //     reject();
      //   }
      // );
    });
  }

  exportAsExcelFile(): void {
    const json = this.orginalItems;
    console.log("json ", json);
    const excelFileName = "Item_State_Report_";

    const workbook = XLSX.utils.book_new(); // create a new blank book
    const workSheet = XLSX.utils.json_to_sheet(json);

    XLSX.utils.book_append_sheet(workbook, workSheet, "data");

    XLSX.writeFile(workbook, excelFileName + new Date() + ".xlsx");
  }
}
