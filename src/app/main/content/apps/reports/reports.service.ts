import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

import { AuthService } from "../../pages/authentication/auth.service";
import { AppConfig } from "../../../shared/app.config";

import { HelpersService } from "../../../shared/helpers.service";
import { ProgressBarService } from "../../../../core/services/progress-bar.service";
import { Report } from "./report.model";

@Injectable()
export class ReportsService implements Resolve<any> {
  onItemsChanged: BehaviorSubject<any> = new BehaviorSubject({});
  onItemChanged: BehaviorSubject<any> = new BehaviorSubject({});
  onItemsCountChanged: BehaviorSubject<any> = new BehaviorSubject({});
  itemsCount: number;
  item: any;
  items: any[];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private progressBarService: ProgressBarService,
    private helpersService: HelpersService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      let resolverType = route.data["resolverType"];
      let page = route.data["page"];
      let itemsPerPage = route.data["itemsPerPage"];
      if (resolverType == "list") {
        Promise.all([
          this.getItemsPaging(page, itemsPerPage, null),
          this.getItemsCount()
        ]).then(() => {
          resolve();
        }, reject);
      } else if (resolverType == "view") {
        Promise.all([this.viewItem(route.params["id"])]).then(() => {
          resolve();
        }, reject);
      }
    });
  }

  getItems(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get(
          AppConfig.apiUrl +
            "reports?filter[include]=report_Type&filter[include]=owner&access_token=" +
            this.authService.getToken()
        )
        .subscribe(
          (response: any) => {
            // console.log('response reports', response);
            this.items = response;
            this.onItemsChanged.next(this.items);
            resolve(response);
          },
          error => {
            console.log("error ", error);
            this.helpersService.showActionSnackbar(
              null,
              false,
              "",
              { style: "failed-snackbar" },
              AppConfig.technicalException
            );
            reject();
          }
        );
    });
  }

  getItemsPaging(page, itemsPerPage, filterBy): Promise<any> {
    return new Promise((resolve, reject) => {
      var offset = page * itemsPerPage;

      const _filter =
        'filter={"limit":' +
        itemsPerPage +
        ', "skip":' +
        offset +
        ',"include":"report_Type","include":"bottle","include":"owner"';

      let api = AppConfig.apiUrl + "reports?" + _filter;

      if (filterBy && filterBy !== null) {
        let values = filterBy;
        let filter = "";
        if (values.createdAt)
          filter += ',{"createdAt":{"gt":"' + values.createdAt + '"}}';

        if (filter.charAt(0) === ",") {
          filter = filter.substr(1);
        }
        if (filter.charAt(filter.length - 1) === ",")
          filter = filter.slice(0, -1);

        if (filter !== "") filter = ',"where":{"and":[' + filter + "]}";

        api += filter;
      }

      api += "}&access_token=" + this.authService.getToken();

      console.log(api);

      this.http
        .get<Report[]>(
          api
          // AppConfig.apiUrl +
          //   "reports?filter[limit]=" +
          //   itemsPerPage +
          //   "&filter[skip]=" +
          //   offset +
          //   "&filter[include]=report_Type&filter[include]=bottle&filter[include]=owner&access_token=" +
          //   this.authService.getToken()
        )
        .subscribe(
          (response: any) => {
            console.log("response reports", response);
            this.items = response;
            this.onItemsChanged.next(this.items);
            resolve(response);
          },
          error => {
            console.log("error ", error);
            if (error.error.error.code == AppConfig.authErrorCode)
              this.router.navigate(["/error-404"]);
            else
              this.helpersService.showActionSnackbar(
                null,
                false,
                "",
                { style: "failed-snackbar" },
                AppConfig.technicalException
              );
            reject();
          }
        );
    });
  }

  getItemsCount(values?): Promise<any> {
    let api = "";
    if (values && values !== null) {
      let filter = "";

      if (values.createdAt)
        filter += ',{"createdAt":{"gt":"' + values.createdAt + '"}}';

      if (filter.charAt(0) === ",") {
        filter = filter.substr(1);
      }
      if (filter.charAt(filter.length - 1) === ",")
        filter = filter.slice(0, -1);

      if (filter !== "") filter = 'filter={"where":{"and":[' + filter + "]}}";

      api =
        AppConfig.apiUrl +
        "reports/count?" +
        filter +
        "&access_token=" +
        this.authService.getToken();
    } else {
      api =
        AppConfig.apiUrl +
        "reports/count?access_token=" +
        this.authService.getToken();
    }

    console.log(api);
    return new Promise((resolve, reject) => {
      this.http.get<Report[]>(api).subscribe(
        (response: any) => {
          // console.log('count reports', response);
          this.itemsCount = response.count;
          this.onItemsCountChanged.next(this.itemsCount);
          resolve(this.itemsCount);
        },
        error => {
          console.log("error ", error);
          if (error.error.error.code == AppConfig.authErrorCode)
            this.router.navigate(["/error-404"]);
          else
            this.helpersService.showActionSnackbar(
              null,
              false,
              "",
              { style: "failed-snackbar" },
              AppConfig.technicalException
            );
          reject();
        }
      );
    });
  }

  deleteItem(item): Promise<any> {
    return new Promise((resolve, reject) => {
      const index = this.items.indexOf(item);
      this.http
        .delete<Report>(
          AppConfig.apiUrl +
            "reports/" +
            item.id +
            "?access_token=" +
            this.authService.getToken()
        )
        .subscribe(
          data => {
            // console.log(data);
            this.items.splice(index, 1);
            this.onItemsChanged.next(this.items);
            this.itemsCount--;
            this.onItemsCountChanged.next(this.itemsCount);
            this.progressBarService.toggle();
            this.router.navigate(["/reports/list"]);
            resolve(true);
          },
          error => {
            console.log("error ", error);
            this.progressBarService.toggle();
            if (error.error.error.code == AppConfig.authErrorCode)
              this.router.navigate(["/error-404"]);
            else
              this.helpersService.showActionSnackbar(
                null,
                false,
                "",
                { style: "failed-snackbar" },
                AppConfig.technicalException
              );
            reject();
          }
        );
    });
  }

  viewItem(itemId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      // send get request
      this.http
        .get<Report>(
          AppConfig.apiUrl +
            "reports/" +
            itemId +
            "?filter[include]=owner&access_token=" +
            this.authService.getToken()
        )
        .subscribe(
          item => {
            // console.log('item ', item);
            this.item = item;
            this.onItemChanged.next(this.item);
            resolve(item);
          },
          error => {
            console.log("error ", error);
            if (error.error.error.code == AppConfig.authErrorCode)
              this.router.navigate(["/error-404"]);
            else
              this.helpersService.showActionSnackbar(
                null,
                false,
                "",
                { style: "failed-snackbar" },
                AppConfig.technicalException
              );
            reject();
          }
        );
    });
  }

  editItem(item: Report): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .patch<Report>(
          AppConfig.apiUrl +
            "reports/" +
            item.id +
            "?access_token=" +
            this.authService.getToken(),
          item
        )
        .subscribe(
          data => {
            // console.log('data ', data);
            resolve(true);
          },
          error => {
            console.log("error ", error);
            if (error.error.error.code == AppConfig.authErrorCode)
              this.router.navigate(["/error-404"]);
            else
              this.helpersService.showActionSnackbar(
                null,
                false,
                "",
                { style: "failed-snackbar" },
                AppConfig.technicalException
              );
            reject();
          }
        );
    });
  }

  newItem(item: Report): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post<Report>(AppConfig.apiUrl + "reports", item).subscribe(
        data => {
          // console.log(data);
          resolve(true);
        },
        error => {
          console.log("error ", error);
          if (error.error.error.code == AppConfig.authErrorCode)
            this.router.navigate(["/error-404"]);
          else
            this.helpersService.showActionSnackbar(
              null,
              false,
              "",
              { style: "failed-snackbar" },
              AppConfig.technicalException
            );
          reject();
        }
      );
    });
  }

  filterBy(values): Promise<any> {
    return new Promise((resolve, reject) => {
      let filter = "";

      if (values.createdAt)
        filter += ',{"createdAt":{"gt":"' + values.createdAt + '"}}';

      if (filter.charAt(0) === ",") {
        filter = filter.substr(1);
      }
      if (filter.charAt(filter.length - 1) === ",")
        filter = filter.slice(0, -1);

      if (filter !== "") filter = 'filter={"where":{"and":[' + filter + "]}}";

      this.http
        .get<any[]>(
          AppConfig.apiUrl +
            "reports?" +
            filter +
            "&access_token=" +
            this.authService.getToken()
        )
        .subscribe(
          data => {
            console.log(data);
            this.items = data;
            this.onItemsChanged.next(this.items);
            resolve(true);
          },
          error => {
            console.log("error ", error);
            if (error.error.error.code === AppConfig.authErrorCode)
              this.router.navigate(["/error-404"]);
            else
              this.helpersService.showActionSnackbar(
                null,
                false,
                "",
                { style: "failed-snackbar" },
                AppConfig.technicalException
              );
            reject();
          }
        );
    });
  }

  export(values): Promise<any> {
    let filter = "";
    if (values && values !== null) {
      if (values.createdAt)
        filter += ',{"createdAt":{"gt":"' + values.createdAt + '"}}';

      if (filter.charAt(0) === ",") {
        filter = filter.substr(1);
      }
      if (filter.charAt(filter.length - 1) === ",")
        filter = filter.slice(0, -1);

      if (filter !== "") filter = 'filter={"where":{"and":[' + filter + "]}}&";
    }
    return new Promise((resolve, reject) => {
      this.http
        .get(
          AppConfig.apiUrl +
            "reports/export?" +
            filter +
            "access_token=" +
            this.authService.getToken()
        )
        .subscribe(
          items => {
            console.log(items);
            resolve(items["path"]);
          },
          error => {
            console.log("error ", error);
            if (error.error.code == AppConfig.authErrorCode)
              this.router.navigate(["/error-404"]);
            else
              this.helpersService.showActionSnackbar(
                null,
                false,
                "",
                { style: "failed-snackbar" },
                AppConfig.technicalException
              );
            reject();
          }
        );
    });
  }
}
