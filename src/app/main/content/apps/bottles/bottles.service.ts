import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { ProgressBarService } from "../../../../core/services/progress-bar.service";
import { AppConfig } from "../../../shared/app.config";
import { HelpersService } from "../../../shared/helpers.service";
import { AuthService } from "../../pages/authentication/auth.service";
import { Bottle } from "./bottle.model";



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

            this.onItemsChanged.next(this.items);
            resolve(response);
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

  getItemsPaging(page, itemsPerPage, filterBy, searchBy): Promise<any> {
    let _customApi = "";

    // PAGING //
    const offset = page * itemsPerPage;
    const _paging =
      'filter={"limit":' +
      itemsPerPage +
      ', "offset":' +
      offset +
      ',"order":"createdAt DESC"';

    // SEARCHING //
    let _searching = "";
    if (searchBy && searchBy !== "") {
      if (searchBy) {
        _searching = '{"owner.username": "' + searchBy + '"}';
      }
    }

    // FILERIGN //
    let _filtering = "";
    if (filterBy && filterBy !== "") {
      if (filterBy.gender) {
        _filtering += ',{"owner.gender":"' + filterBy.gender + '"}';
      }

      if (filterBy.bottleType) {
        _filtering += ',{"bottleType":"' + filterBy.bottleType + '"}';
      }

      if(filterBy.status) { 
        _filtering += ',{"status":"' + filterBy.status + '"}' ;
      }

      if(filterBy.viewStatus) { 
        _filtering += ',{"viewStatus":"' + filterBy.viewStatus + '"}' ;
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

    this.getItemsCount('filter={"where":{"and":[' + _searching + "]}}&");
    _searching = ',"where":{"and":[' + _searching + "]}";
    _customApi = "/filterBottle?";



    const api =
      AppConfig.apiUrl +
      "bottles" +
      _customApi +
      _paging +
      _searching +
      "}&access_token=" +
      this.authService.getToken();

    return new Promise((resolve, reject) => {


      this.http.get<Bottle[]>(api).subscribe(
        (response: any) => {

          this.items = response;
          this.onItemsChanged.next(this.items);
          resolve(this.items);
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


    return new Promise((resolve, reject) => {
      this.http.get<Bottle[]>(api).subscribe(
        (response: any) => {

          this.itemsCount = response.count;
          this.onItemsCountChanged.next(this.itemsCount);

          resolve(this.itemsCount);
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

  deleteItem(item, deleteFile): Promise<any> {
    return new Promise((resolve, reject) => {
      const index = this.items.indexOf(item);
      this.http.delete<Bottle>(
        AppConfig.apiUrl + "bottles/" + item.id +
        "/deactiveBottle?access_token=" + this.authService.getToken() + "&deleteFile=" + deleteFile
      )
        .subscribe(
          data => {

            this.items.splice(index, 1);
            this.onItemsChanged.next(this.items);
            this.onItemsCountChanged.next(this.itemsCount);
            this.progressBarService.toggle();
            this.router.navigate(["/bottles/list"]);
            resolve(true);
          },
          error => {

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
          "&filter=" + JSON.stringify({ "include": ["userComplete", "userSeen", "userReplaies"] })
        )
        .subscribe(
          item => {

            this.item = item;
            this.onItemChanged.next(this.item);
            resolve(item);
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

  updateViewStatus(values: any): Promise<any> {
    let data = { bottles: values };
    return new Promise((resolve, reject) => {
      
      this.http.put(AppConfig.apiUrl + "bottles/makeBottleViewStatus?access_token=" +
        this.authService.getToken(), data).subscribe(
          data => {
            resolve(true);
          },
          error => {
            if (error.error.error.code === AppConfig.authErrorCode)
              this.router.navigate(["/error-404"]);
            else {
              this.helpersService.showActionSnackbar(null, false, "", { style: "failed-snackbar" }
                , AppConfig.technicalException);
            }
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


      if (values.bottleType) filter += ',{"bottleType":"' + values.bottleType + '"}';

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
