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
import { Item } from "./item.model";
import { HelpersService } from "../../../shared/helpers.service";
import { ProgressBarService } from "../../../../core/services/progress-bar.service";

@Injectable()
export class ItemsService implements Resolve<any> {
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
      if (resolverType == "list") {
        Promise.all([
          this.getItemsPaging(page, itemsPerPage, "", ""),
          this.getItemsCount("")
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
        .get<Item[]>(
          AppConfig.apiUrl +
            "items&filter[include]=owner?access_token=" +
            this.authService.getToken()
        )
        .subscribe(
          (response: any) => {
            //console.log("response items", response);
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

  getItemsPaging(page, itemsPerPage, filterBy, searchBy): Promise<any> {
    let _customApi = "?";

    // PAGING //
    const offset = page * itemsPerPage;
    const _paging =
      'filter={"limit":' +
      itemsPerPage +
      ',"skip":' +
      offset +
      ',"include":"owner"';

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

      if (filterBy.country) {
        _filtering += ',{"owner.ISOCode":"' + filterBy.country + '"}';
      }

      if (filterBy.from) {
        _filtering += ',{"startAt":{"gt":"' + filterBy.from + '"}}';
      }

      if (filterBy.to) {
        _filtering += ',{"endAt":{"lt":"' + filterBy.to + '"}}';
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
      _customApi = "/filterItem?";
    }

    const api =
      AppConfig.apiUrl +
      "items" +
      _customApi +
      _paging +
      _searching +
      "}&access_token=" +
      this.authService.getToken();

    console.log("api ", api);

    return new Promise((resolve, reject) => {
      this.http.get<Item[]>(api).subscribe(
        (response: any) => {
          console.log("response items", response);
          this.items = response;
          this.onItemsChanged.next(this.items);
          resolve(this.items);
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

  getItemsCount(filter): Promise<any> {
    let _customApi = "/count?";
    if (filter !== "") {
      _customApi = "/countItem?";
    }
    const api =
      AppConfig.apiUrl +
      "items" +
      _customApi +
      filter +
      "access_token=" +
      this.authService.getToken();

    console.log("api count ", api);

    return new Promise((resolve, reject) => {
      this.http.get<Item[]>(api).subscribe(
        (response: any) => {
          console.log("count bottles", response);
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
        .delete<Item>(
          AppConfig.apiUrl +
            "items/" +
            item.id +
            "?access_token=" +
            this.authService.getToken()
        )
        .subscribe(
          data => {
            //  console.log(data);
            this.items.splice(index, 1);
            this.onItemsChanged.next(this.items);
            this.itemsCount--;
            this.onItemsCountChanged.next(this.itemsCount);
            this.progressBarService.toggle();
            this.router.navigate(["/shores/list"]);
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
        .get<Item>(
          AppConfig.apiUrl +
            "items/" +
            itemId +
            "?filter[include]=owner&filter[include]=product&access_token=" +
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

  editItem(item: Item): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .patch<Item>(
          AppConfig.apiUrl +
            "items/" +
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

  newItem(item: Item): Promise<any> {
    // console.log("new item ", item);
    return new Promise((resolve, reject) => {
      this.http
        .post<Item>(
          AppConfig.apiUrl +
            "items/?access_token=" +
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

  export(values): Promise<any> {
    let filter = "";
    if (values && values !== null) {
      if (values.type)
        filter += ',{"product.typeGoodsId":"' + values.type + '"}';

      if (values.country)
        filter += ',{"owner.ISOCode":"' + values.country + '"}';

      if (values.from) filter += ',{"startAt":{"gt":"' + values.from + '"}}';

      if (values.to) filter += ',{"endAt":{"lt":"' + values.to + '"}}';

      if (filter.charAt(0) === ",") {
        filter = filter.substr(1);
      }
      if (filter.charAt(filter.length - 1) === ",")
        filter = filter.slice(0, -1);

      if (filter !== "") filter = 'filter={"where":{"and":[' + filter + "]}}&";
    }

    return new Promise((resolve, reject) => {
      // send get request

      console.log(
        AppConfig.apiUrl +
          "items/export?" +
          filter +
          "access_token=" +
          this.authService.getToken()
      );
      this.http
        .get(
          AppConfig.apiUrl +
            "items/export?" +
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
