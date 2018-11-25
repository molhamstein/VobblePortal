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
import { Bottle } from "./bottle.model";
import { HelpersService } from "../../../shared/helpers.service";
import { ProgressBarService } from "../../../../core/services/progress-bar.service";

@Injectable()
export class BottlesService implements Resolve<any> {
  onItemsChanged: BehaviorSubject<any> = new BehaviorSubject({});
  onItemChanged: BehaviorSubject<any> = new BehaviorSubject({});
  onItemsCountChanged: BehaviorSubject<any> = new BehaviorSubject({});
  itemsCount: number;
  item: any;
  items: any[];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private helpersService: HelpersService,
    private progressBarService: ProgressBarService,
    private router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      let resolverType = route.data["resolverType"];
      let page = route.data["page"];
      let itemsPerPage = route.data["itemsPerPage"];
      if (resolverType === "list") {
        Promise.all([
          this.getItemsPaging(page, itemsPerPage, null),
          this.getItemsCount()
        ]).then(() => {
          resolve();
        }, reject);
      } else if (resolverType === "view") {
        Promise.all([this.viewItem(route.params["id"])]).then(() => {
          resolve();
        }, reject);
      }
    });
  }

  getItems(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get<Bottle[]>(
          AppConfig.apiUrl +
            "bottles?access_token=" +
            this.authService.getToken()
        )
        .subscribe(
          (response: any) => {
            //console.log("response bottles", response);
            //this.items = response;
            this.onItemsChanged.next(this.items);
            resolve(response);
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

  getItemsPaging(page, itemsPerPage, filterBy): Promise<any> {
    return new Promise((resolve, reject) => {
      const offset = page * itemsPerPage;

      const _filter =
        'filter={"limit":' +
        itemsPerPage +
        ', "skip":' +
        offset +
        ',"order":"createdAt DESC"';

      let api = AppConfig.apiUrl + "bottles?" + _filter;

      console.log(filterBy);
      if (filterBy && filterBy !== null) {
        let values = filterBy;
        let filter = "";
        if (values.gender)
          filter += ',{"owner.gender":"' + values.gender + '"}';

        if (values.shoreId) filter += ',{"shoreId":"' + values.shoreId + '"}';

        if (values.country)
          filter += ',{"owner.ISOCode":"' + values.country + '"}';

        if (values.createdFrom)
          filter += ',{"createdAt":{"gt":"' + values.createdFrom + '"}}';

        if (values.createdTo)
          filter += ',{"createdAt":{"lt":"' + values.createdTo + '"}}';

        if (filter.charAt(0) === ",") {
          filter = filter.substr(1);
        }
        if (filter.charAt(filter.length - 1) === ",")
          filter = filter.slice(0, -1);

        //  if (filter !== "") filter = 'filter={"where":{"and":[' + filter + "]}}";

        if (filter !== "")
          filter = _filter + ',"where":{"and":[' + filter + "]}";

        // api += filter;

        api = AppConfig.apiUrl + "bottles/filterBottle?" + filter;
      }

      api += "}&access_token=" + this.authService.getToken();

      console.log(api);

      this.http
        .get<Bottle[]>(
          api
          // AppConfig.apiUrl +
          //   "bottles?filter[limit]=" +
          //   itemsPerPage +
          //   "&filter[skip]=" +
          //   offset +
          //   "&filter[order]=createdAt DESC&access_token=" +
          //   this.authService.getToken()
        )
        .subscribe(
          (response: any) => {
            //console.log("response bottles", response);
            this.items = response;
            this.onItemsChanged.next(this.items);
            resolve(response);
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

  getItemsCount(values?): Promise<any> {
    let api = "";

    if (values && values !== null) {
      let filter = "";
      if (values.gender) filter += ',{"owner.gender":"' + values.gender + '"}';

      if (values.shoreId) filter += ',{"shoreId":"' + values.shoreId + '"}';

      if (values.country)
        filter += ',{"owner.ISOCode":"' + values.country + '"}';

      if (values.createdFrom)
        filter += ',{"createdAt":{"gt":"' + values.createdFrom + '"}}';

      if (values.createdTo)
        filter += ',{"createdAt":{"lt":"' + values.createdTo + '"}}';

      if (filter.charAt(0) === ",") {
        filter = filter.substr(1);
      }
      if (filter.charAt(filter.length - 1) === ",")
        filter = filter.slice(0, -1);

      if (filter !== "") filter = 'filter={"where":{"and":[' + filter + "]}}";

      api =
        AppConfig.apiUrl +
        "bottles/countBottle?" +
        filter +
        "&access_token=" +
        this.authService.getToken();
    } else {
      api =
        AppConfig.apiUrl +
        "bottles/count?access_token=" +
        this.authService.getToken();
    }

    console.log(api);

    return new Promise((resolve, reject) => {
      this.http.get<Bottle[]>(api).subscribe(
        (response: any) => {
          console.log("Bottles count ", response);
          this.itemsCount = response.count;
          this.onItemsCountChanged.next(this.itemsCount);
          console.log(this.itemsCount);
          resolve(this.itemsCount);
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

  deleteItem(item): Promise<any> {
    return new Promise((resolve, reject) => {
      const index = this.items.indexOf(item);
      this.http
        .delete<Bottle>(
          AppConfig.apiUrl +
            "bottles/" +
            item.id +
            "?access_token=" +
            this.authService.getToken()
        )
        .subscribe(
          data => {
            //console.log(data);
            this.items.splice(index, 1);
            this.onItemsChanged.next(this.items);
            this.itemsCount--;
            this.onItemsCountChanged.next(this.itemsCount);
            this.progressBarService.toggle();
            this.router.navigate(["/bottles/list"]);
            resolve(true);
          },
          error => {
            console.log("error ", error);
            this.progressBarService.toggle();
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

  viewItem(itemId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      // send get request
      this.http
        .get<Bottle>(
          AppConfig.apiUrl +
            "bottles/" +
            itemId +
            "?access_token=" +
            this.authService.getToken()
        )
        .subscribe(
          item => {
            // console.log("item ", item);
            this.item = item;
            this.onItemChanged.next(this.item);
            resolve(item);
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

  editItem(item: Bottle): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .patch<Bottle>(
          AppConfig.apiUrl +
            "bottles/" +
            item.id +
            "?access_token=" +
            this.authService.getToken(),
          item
        )
        .subscribe(
          data => {
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

  newItem(item: Bottle): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post<Bottle>(
          AppConfig.apiUrl +
            "bottles/?access_token=" +
            this.authService.getToken(),
          item
        )
        .subscribe(
          data => {
            // console.log(data);
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

  filterBy(values): Promise<any> {
    return new Promise((resolve, reject) => {
      let filter = "";
      if (values.gender) filter += ',{"owner.gender":"' + values.gender + '"}';

      if (values.shoreId) filter += ',{"shoreId":"' + values.shoreId + '"}';

      if (values.country)
        filter += ',{"owner.ISOCode":"' + values.country + '"}';

      if (values.createdFrom)
        filter += ',{"createdAt":{"gt":"' + values.createdFrom + '"}}';

      if (values.createdTo)
        filter += ',{"createdAt":{"lt":"' + values.createdTo + '"}}';

      if (filter.charAt(0) === ",") {
        filter = filter.substr(1);
      }
      if (filter.charAt(filter.length - 1) === ",")
        filter = filter.slice(0, -1);

      if (filter !== "") filter = 'filter={"where":{"and":[' + filter + "]}}";

      this.http
        .get<any[]>(
          AppConfig.apiUrl +
            "bottles/filterBottle?" +
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
      if (values.gender) filter += ',{"owner.gender":"' + values.gender + '"}';

      if (values.shoreId) filter += ',{"shoreId":"' + values.shoreId + '"}';

      if (values.country)
        filter += ',{"owner.ISOCode":"' + values.country + '"}';

      if (values.createdFrom)
        filter += ',{"createdAt":{"gt":"' + values.createdFrom + '"}}';

      if (values.createdTo)
        filter += ',{"createdAt":{"lt":"' + values.createdTo + '"}}';

      if (filter.charAt(0) === ",") {
        filter = filter.substr(1);
      }
      if (filter.charAt(filter.length - 1) === ",")
        filter = filter.slice(0, -1);

      if (filter !== "") filter = 'filter={"where":{"and":[' + filter + "]}}&";
    }

    console.log(
      AppConfig.apiUrl +
        "bottles/export?" +
        filter +
        "access_token=" +
        this.authService.getToken()
    );
    return new Promise((resolve, reject) => {
      this.http
        .get(
          AppConfig.apiUrl +
            "bottles/export?" +
            filter +
            "access_token=" +
            this.authService.getToken()
        )
        .subscribe(
          items => {
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

  searchFor(keyword): Promise<any> {
    return new Promise((resolve, reject) => {
      let filter = "";
      if (keyword) {
        filter =
          'filter={"where":{"and":[{"owner.username":"' + keyword + '"}]}}';
        console.log(
          AppConfig.apiUrl +
            "bottles/filterBottle?" +
            filter +
            "&access_token=" +
            this.authService.getToken()
        );

        this.http
          .get<any[]>(
            AppConfig.apiUrl +
              "bottles/filterBottle?" +
              filter +
              "&access_token=" +
              this.authService.getToken()
          )
          .subscribe(
            data => {
              console.log("filtered ", data);
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
      } else this.getItemsPaging(0, 10, null);
    });
  }
}
