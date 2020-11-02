import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { ProgressBarService } from "../../../../core/services/progress-bar.service";
import { AppConfig } from "../../../shared/app.config";
import { HelpersService } from "../../../shared/helpers.service";
import { AuthService } from "../../pages/authentication/auth.service";
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
  ) { }

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
          "reports?filter[order]=createdAt%20DESC&filter[include]=report_Type&filter[include]=owner&access_token=" +
          this.authService.getToken()
        )
        .subscribe(
          (response: any) => {
            // 
            this.items = response;
            this.onItemsChanged.next(this.items);
            resolve(response);
          },
          error => {
            
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
        ',"include":"report_Type","include":"bottle","include":"owner","order":"createdAt DESC"';

      let api = AppConfig.apiUrl + "reports?" + _filter;

      if (filterBy && filterBy !== null) {
        let values = filterBy;
        let filter = "";
        if (values.createdFrom)
          filter += ',{"createdAt":{"gt":"' + values.createdFrom + '"}}';
        if (values.createdTo)
          filter += ',{"createdAt":{"lt":"' + values.createdTo + '"}}';

        if (filter.charAt(0) === ",") {
          filter = filter.substr(1);
        }
        if (filter.charAt(filter.length - 1) === ",")
          filter = filter.slice(0, -1);

        if (filter !== "") filter = ',"where":{"and":[' + filter + "]}";

        api += filter;
      }

      api += "}&access_token=" + this.authService.getToken();

      

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
            
            this.items = response;
            this.onItemsChanged.next(this.items);
            resolve(response);
          },
          error => {
            
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

      if (values.createdFrom)
        filter += ',{"createdAt":{"gt":"' + values.createdFrom + '"}}';
      if (values.createdTo)
        filter += ',{"createdAt":{"lt":"' + values.createdTo + '"}}';

      if (filter.charAt(0) === ",") {
        filter = filter.substr(1);
      }
      if (filter.charAt(filter.length - 1) === ",")
        filter = filter.slice(0, -1);

      if (filter !== "") filter = 'where={"and":[' + filter + "]}";

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

    
    return new Promise((resolve, reject) => {
      this.http.get<Report[]>(api).subscribe(
        (response: any) => {
          // 
          this.itemsCount = response.count;
          this.onItemsCountChanged.next(this.itemsCount);
          resolve(this.itemsCount);
        },
        error => {
          
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
            // 
            this.items.splice(index, 1);
            this.onItemsChanged.next(this.items);
            this.itemsCount--;
            this.onItemsCountChanged.next(this.itemsCount);
            this.progressBarService.toggle();
            this.router.navigate(["/reports/list"]);
            resolve(true);
          },
          error => {
            
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
            // 
            this.item = item;
            this.onItemChanged.next(this.item);
            resolve(item);
          },
          error => {
            
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
            // 
            resolve(true);
          },
          error => {
            
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
          // 
          resolve(true);
        },
        error => {
          
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
            
            this.items = data;
            this.onItemsChanged.next(this.items);
            resolve(true);
          },
          error => {
            
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
            
            resolve(items["path"]);
          },
          error => {
            
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
