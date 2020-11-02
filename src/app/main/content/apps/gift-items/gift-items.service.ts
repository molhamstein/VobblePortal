import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import * as XLSX from "xlsx";
import { AppConfig } from "../../../shared/app.config";
import { AuthService } from "./../../pages/authentication/auth.service";


@Injectable()
export class GiftItemsService {
  users: any[];
  bottles: any[];
  onBottlesChanged: BehaviorSubject<any> = new BehaviorSubject({});
  items: any[];
  itemsChatCount: number;
  itemsChat: any[];
  itemsRelated: any[];
  itemsCount: number;
  itemsRelatedCount: number;
  onItemsChanged: BehaviorSubject<any> = new BehaviorSubject({});

  onItemsCountChanged: BehaviorSubject<any> = new BehaviorSubject({});


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
        // this.getBottles(filtersForm.value),

        this.getItems(null),
        this.getItemsCount(null),
        this.getItemsRelated(null),
        this.getItemsRelatedCount(null),

        // this.getItems(purchasesFiltersForm.value),
        // this.getUsers(null)
        // this.getUsers(genderFiltersForm.value)
      ]).then(() => {
        resolve();
      }, reject);
    });
  }

  getItemsRelatedCount(filter): Promise<any> {
    const api =
      AppConfig.apiUrl +
      "chatItems/chatExtendReportRelatedCount?filter=" +
      filter +
      "&access_token=" +
      this.authService.getToken();


    return new Promise((resolve, reject) => {
      this.http.get(api).subscribe(
        (response: any) => {

          this.itemsRelatedCount = response.count;
          // this.onItemsCountChanged.next(this.itemsCount);
          resolve(this.itemsRelatedCount);
        },
        error => {

          // if (error.error.error.code == AppConfig.authErrorCode)
          //   this.router.navigate(["/error-404"]);
          // else
          //   this.helpersService.showActionSnackbar(
          //     null,
          //     false,
          //     "",
          //     { style: "failed-snackbar" },
          //     AppConfig.technicalException
          //   );
          reject();
        }
      );
    });
  }


  getItemsCount(filter): Promise<any> {
    const api =
      AppConfig.apiUrl +
      "chatItems/chatExtendReportOwnerCount?" +
      filter +
      "access_token=" +
      this.authService.getToken();


    return new Promise((resolve, reject) => {
      this.http.get(api).subscribe(
        (response: any) => {

          this.itemsCount = response.count;
          // this.onItemsCountChanged.next(this.itemsCount);
          resolve(this.itemsCount);
        },
        error => {

          // if (error.error.error.code == AppConfig.authErrorCode)
          //   this.router.navigate(["/error-404"]);
          // else
          //   this.helpersService.showActionSnackbar(
          //     null,
          //     false,
          //     "",
          //     { style: "failed-snackbar" },
          //     AppConfig.technicalException
          //   );
          reject();
        }
      );
    });
  }

  getUserByString(string) {
    let url =
      AppConfig.apiUrl +
      "users?access_token=" +
      this.authService.getToken();
    var filter = { where: { username: { "like": string, options: "i" } } }
    url += "&filter=" + JSON.stringify(filter);
    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe((response: any) => {
        resolve(response);

      }, reject);
    });
  }

  getUserRelated(userId, isOwner) {
    let url =
      AppConfig.apiUrl +
      "chatItems/" + userId + "/getUserRelated/?access_token=" +
      this.authService.getToken();
    url += "&isOwner=" + isOwner;
    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe((response: any) => {
        resolve(response);

      }, reject);
    });

  }
  getChatExtendReportRelatedUser(filter) {
    let url =
      AppConfig.apiUrl +
      "chatItems/chatExtendReportRelated/?filter=" + JSON.stringify(filter) + "&access_token=" +
      this.authService.getToken();
    this.getItemsRelatedCount(filter);


    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe((response: any) => {

        this.orginalItems = response.map(x => Object.assign({}, x));

        this.itemsRelated = response.map(item => {
          return {
            relatedUser: item.relatedUser,
            chatProducts: item.chatProducts,
            totalCost: item.totalCost,
            totalCount: item.totalCount,
          };
        });

        this.onItemsChanged.next(this.itemsRelated);
        resolve(this.itemsRelated);
      }, reject);
    });
  }

  getLengthItem() {
    if (this.items)
      return this.itemsCount
    else
      return 0
  }
  getLengthItemRelated() {
    if (this.itemsRelated)
      return this.itemsRelatedCount
    else
      return 0
  }
  getChatExtendReportOwner(filter) {

    var mainFilter = {};
    let url =
      AppConfig.apiUrl +
      "chatItems/chatExtendReportOwner/?access_token=" +
      this.authService.getToken();

    if (filter.from != "") {
      mainFilter['from'] = filter.from;
    }

    if (filter.to != "") {
      mainFilter['to'] = filter.to;
    }

    if (filter.userId != "") {
      mainFilter['userId'] = filter.userId;

    }
    url += "&filter=" + JSON.stringify(mainFilter);

    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe((response: any) => {

        this.orginalItems = response.map(x => Object.assign({}, x));

        this.items = response.map(item => {
          return {
            owner: item.owner,
            chatProducts: item.chatProducts,
            totalCost: item.totalCost,
            totalCount: item.totalCount,
          };
        });

        this.onItemsChanged.next(this.items);
        resolve(this.items);
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


      if (filter) {
        url += "&from=" + filter.from + "&to=" + filter.to;
      }


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

            tempArray = fromDatesArray.map(val => {
              //  
              return {
                value: 0,
                name: val
              };
            });
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
          if (i[i.length - 1]) {
            const from = new Date(
              i[i.length - 1].date.year,
              i[i.length - 1].date.month - 1,
              i[i.length - 1].date.day
            );

            const filter2 = new Date(filter.to);
            const filter3 = filter2.setDate(filter2.getDate() - 1);
            const toDatesArray = getDateArray(from, filter3);

            toDatesArray.map(val => {
              tempArray.push({
                value: 0,
                name: val
              });
            });
          }

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
      "chatItems/chatExtendReportOwner/?access_token=" +
      this.authService.getToken();

    if (filter && filter.from != "") {
      url += "&from=" + filter.from;
    }

    if (filter && filter.to != "") {
      url += "&to=" + filter.to;
    }

    if (filter && filter.userId != "") {
      url += "&userId=" + filter.userId;
    }

    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe((response: any) => {

        this.orginalItems = response.map(x => Object.assign({}, x));

        this.items = response.map(item => {
          return {
            owner: item.owner,
            chatProducts: item.chatProducts,
            totalCost: item.totalCost,
            totalCount: item.totalCount,
          };
        });

        this.onItemsChanged.next(this.items);
        resolve(this.items);
      }, reject);
    });
  }

  getItemsRelated(filter): Promise<any> {
    let url =
      AppConfig.apiUrl +
      "chatItems/chatExtendReportRelated/?access_token=" +
      this.authService.getToken();

    if (filter && filter.from != "") {
      url += "&from=" + filter.from;
    }

    if (filter && filter.to != "") {
      url += "&to=" + filter.to;
    }

    if (filter && filter.userId != "") {
      url += "&userId=" + filter.userId;
    }

    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe((response: any) => {

        this.orginalItems = response.map(x => Object.assign({}, x));

        this.itemsRelated = response.map(item => {
          return {
            relatedUser: item.relatedUser,
            chatProducts: item.chatProducts,
            totalCost: item.totalCost,
            totalCount: item.totalCount,
          };
        });

        this.onItemsChanged.next(this.items);
        resolve(this.itemsRelated);
      }, reject);
    });
  }

  purchasesChartTypeChanged(type) {
    //  
    this.items = this.orginalItems.map(item => {
      return {
        name: item.country,
        value: item[type]
      };
    });
    //  
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

  export(filter): any {
    let url =
      AppConfig.apiUrl +
      "chatItems/export/?access_token=" +
      this.authService.getToken();
    if (filter) {
      url += "&filter=" + JSON.stringify(filter)
    }

    return new Promise((resolve, reject) => {
      // send get request
      this.http.get(url).subscribe(
        items => {

          resolve(items["path"]);
        },
        error => {


          reject();
        }
      );
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

          resolve(items["path"]);
        },
        error => {


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
      //     
      //     resolve(items["path"]);
      //   },
      //   error => {
      //     
      //     reject();
      //   }
      // );
    });
  }

  exportAsExcelFile(): void {
    const json = this.orginalItems;

    const excelFileName = "Item_State_Report_";

    const workbook = XLSX.utils.book_new(); // create a new blank book
    const workSheet = XLSX.utils.json_to_sheet(json);

    XLSX.utils.book_append_sheet(workbook, workSheet, "data");

    XLSX.writeFile(workbook, excelFileName + new Date() + ".xlsx");
  }

  getItemsPaging(page, itemsPerPage, filterBy, searchBy) {
    let _customApi = "?";

    // PAGING //
    const offset = page * itemsPerPage;
    const _paging =
      'filter={"limit":' +
      itemsPerPage +
      ',"skip":' +
      offset +
      ',"order":"startAt DESC"' +

      ',"include":"owner"'


    // SEARCHING //
    let _searching = "";
    if (searchBy && searchBy !== "") {
      if (searchBy) {
        // 'filter={"where":{"and":[{"owner.username":"' + keyword + '"}]}}';
        _searching = '{"owner.username": "' + searchBy + '"}';
      }
    }
    let _filtering = "";
    if (filterBy && filterBy !== "") {
      if (filterBy.type) {
        _filtering += ',{"product.typeGoodsId":"' + filterBy.type + '"}';
      }
      if (filterBy.typeItem) {
        _filtering += ',{"type":"' + filterBy.typeItem + '"}';
      }
      if (filterBy.country) {
        _filtering += ',{"owner.ISOCode":"' + filterBy.country + '"}';
      }

      if (filterBy.from) {
        _filtering += ',{"createdAt":{"gt":"' + filterBy.from + '"}}';
      }
      if (filterBy.relatedUserId) {
        _filtering += ',{"relatedUserId":"' + filterBy.relatedUserId + '"}';
      }
      if (filterBy.userId) {
        _filtering += ',{"ownerId":"' + filterBy.userId + '"}';
      }

      if (filterBy.to) {
        _filtering += ',{"createdAt":{"lt":"' + filterBy.to + '"}}';
      }

      if (!_searching && _filtering.charAt(0) === ",") {
        _filtering = _filtering.substr(1);
      }

      if (_filtering.charAt(_filtering.length - 1) === ",") {
        _filtering = _filtering.slice(0, -1);
      }

      if (_filtering !== "") {
        _searching += _filtering;
      }
    }

    if (_searching !== "" || _filtering !== "" || offset == 0) {
      this.getChildItemsCount('filter={"where":{"and":[' + _searching + "]}}&");
      _searching = ',"where":{"and":[' + _searching + "]}";
      _customApi = "/filterItem?";
    }

    const api =
      AppConfig.apiUrl +
      "chatItems" +
      _customApi +
      _paging +
      _searching +
      "}&access_token=" +
      this.authService.getToken();



    return new Promise((resolve, reject) => {
      this.http.get(api).subscribe(
        (response: any) => {

          this.itemsChat = response;
          this.onItemsChanged.next(this.items);
          resolve(this.items);
        },
        error => {

          // if (error.error.error.code == AppConfig.authErrorCode)
          //   this.router.navigate(["/error-404"]);
          // else
          //   this.helpersService.showActionSnackbar(
          //     null,
          //     false,
          //     "",
          //     { style: "failed-snackbar" },
          //     AppConfig.technicalException
          //   );
          reject();
        }
      );
    });
  }

  getChildItemsCount(filter): Promise<any> {
    const api =
      AppConfig.apiUrl +
      "chatItems/countItem?" +
      filter +
      "access_token=" +
      this.authService.getToken();


    return new Promise((resolve, reject) => {
      this.http.get(api).subscribe(
        (response: any) => {

          this.itemsChatCount = response.count;
          this.onItemsCountChanged.next(this.itemsChatCount);
          resolve(this.itemsChatCount);
        },
        error => {

          // if (error.error.error.code == AppConfig.authErrorCode)
          //   this.router.navigate(["/error-404"]);
          // else
          //   this.helpersService.showActionSnackbar(
          //     null,
          //     false,
          //     "",
          //     { style: "failed-snackbar" },
          //     AppConfig.technicalException
          //   );
          reject();
        }
      );
    });
  }

}
