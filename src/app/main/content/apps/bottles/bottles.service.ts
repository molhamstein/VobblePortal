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
  ) { }

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
          this.getItemsPaging(page, itemsPerPage, "", ""),
          this.getItemsCount("")
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

  getItemsPaging(page, itemsPerPage, filterBy, searchBy): Promise<any> {
    let _customApi = "?";

    // PAGING //
    const offset = page * itemsPerPage;
    const _paging =
      'filter={"limit":' +
      itemsPerPage +
      ', "skip":' +
      offset +
      ',"order":"createdAt DESC"';

    // SEARCHING //
    let _searching = "";
    if (searchBy && searchBy !== "") {
      if (searchBy) {
        // 'filter={"where":{"and":[{"owner.username":"' + keyword + '"}]}}';
        _searching = '{"owner.username": "' + searchBy + '"}';
      }
    }

    // FILERIGN //
    let _filtering = "";
    if (filterBy && filterBy !== "") {
      if (filterBy.gender) {
        _filtering += ',{"owner.gender":"' + filterBy.gender + '"}';
      }

      if (filterBy.shoreId) {
        _filtering += ',{"shoreId":"' + filterBy.shoreId + '"}';
      }

      if (filterBy.country) {
        _filtering += ',{"owner.ISOCode":"' + filterBy.country + '"}';
      }

      if (filterBy.createdFrom) {
        _filtering += ',{"createdAt":{"gt":"' + filterBy.createdFrom + '"}}';
      }

      if (filterBy.createdTo) {
        _filtering += ',{"createdAt":{"lt":"' + filterBy.createdTo + '"}}';
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

    if (_searching !== "" || _filtering !== "") {
      this.getItemsCount('filter={"where":{"and":[' + _searching + "]}}&");
      _searching = ',"where":{"and":[' + _searching + "]}";
      _customApi = "/filterBottle?";
    }

    const api =
      AppConfig.apiUrl +
      "bottles" +
      _customApi +
      _paging +
      _searching +
      "}&access_token=" +
      this.authService.getToken();

    return new Promise((resolve, reject) => {
      console.log(api);

      this.http.get<Bottle[]>(api).subscribe(
        (response: any) => {
          console.log("response bottles", response);
          this.items = response;
          this.onItemsChanged.next(this.items);
          resolve(this.items);
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

  getItemsCount(filter): Promise<any> {
    let _customApi = "/count?";
    if (filter !== "") {
      _customApi = "/countBottle?";
    }
    const api =
      AppConfig.apiUrl +
      "bottles" +
      _customApi +
      filter +
      "access_token=" +
      this.authService.getToken();

    //   api =
    //     AppConfig.apiUrl +
    //     "bottles/countBottle?" +
    //     filter +
    //     "&access_token=" +
    //     this.authService.getToken();
    // } else {
    //   api =
    //     AppConfig.apiUrl +
    //     "bottles/count?access_token=" +
    //     this.authService.getToken();
    // }

    console.log("api count ", api);

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
          "/deactiveBottle?access_token=" +
          this.authService.getToken()
        )
        .subscribe(
          data => {
            //console.log(data);
            this.items.splice(index, 1);
            this.onItemsChanged.next(this.items);
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
          this.authService.getToken() +
          "&filter=" + JSON.stringify({ "include": "userComplete" })
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
}
