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

  getItemsPaging(page, itemsPerPage, filterBy, searchBy): Promise<any> {
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

      if (filterBy.createdFrom) {
        _filtering += ',{"startAt":{"gt":"' + filterBy.createdFrom + '"}}';
      }

      if (filterBy.from) {
        _filtering += ',{"startAt":{"gt":"' + filterBy.from + '"}}';
      }
      if (filterBy.relatedUserId) {
        _filtering += ',{"relatedUserId":"' + filterBy.relatedUserId + '"}';
      }

      if (filterBy.createdTo) {
        _filtering += ',{"endAt":{"lt":"' + filterBy.createdTo + '"}}';
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

   

    return new Promise((resolve, reject) => {
      this.http.get<Item[]>(api).subscribe(
        (response: any) => {
          
          this.items = response;
          this.onItemsChanged.next(this.items);
          resolve(this.items);
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

    

    return new Promise((resolve, reject) => {
      this.http.get<Item[]>(api).subscribe(
        (response: any) => {
          
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
        .delete<Item>(
          AppConfig.apiUrl +
          "items/" +
          item.id +
          "?access_token=" +
          this.authService.getToken()
        )
        .subscribe(
          data => {
            
            this.items.splice(index, 1);
            this.onItemsChanged.next(this.items);
            this.itemsCount--;
            this.onItemsCountChanged.next(this.itemsCount);
            this.progressBarService.toggle();
            this.router.navigate(["/items/list"]);
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
        .get<Item>(
          AppConfig.apiUrl +
          "items/" +
          itemId +
          "?filter[include]=owner&filter[include]=product&access_token=" +
          this.authService.getToken()
        )
        .subscribe(
          item => {
            
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

  export(values): Promise<any> {
    let filter = "";
    if (values && values !== null) {
      if (values.type)
        filter += ',{"product.typeGoodsId":"' + values.type + '"}';

      if (values.country)
        filter += ',{"owner.ISOCode":"' + values.country + '"}';

      if (values.createdFrom) filter += ',{"startAt":{"gt":"' + values.createdFrom + '"}}';

      if (values.createdTo) filter += ',{"endAt":{"lt":"' + values.createdTo + '"}}';

      if (filter.charAt(0) === ",") {
        filter = filter.substr(1);
      }
      if (filter.charAt(filter.length - 1) === ",")
        filter = filter.slice(0, -1);

      if (filter !== "") filter = 'filter={"where":{"and":[' + filter + "]}}&";
    }

    return new Promise((resolve, reject) => {
      // send get request


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
