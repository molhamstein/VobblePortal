import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { ProgressBarService } from "../../../../core/services/progress-bar.service";
import { AppConfig } from "../../../shared/app.config";
import { HelpersService } from "../../../shared/helpers.service";
import { AuthService } from "../../pages/authentication/auth.service";
import { Bottle } from "./../bottles/bottle.model";
import { User } from "./user.model";




@Injectable()
export class UsersService implements Resolve<any> {
  onUsersChanged: BehaviorSubject<any> = new BehaviorSubject({});
  onItemChanged: BehaviorSubject<any> = new BehaviorSubject({});
  onItemsCountChanged: BehaviorSubject<any> = new BehaviorSubject({});
  itemsCount: number;
  item: any;
  items: any[];
  bottles: any[];

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
      const resolverType = route.data["resolverType"];
      const page = route.data["page"];
      const itemsPerPage = route.data["itemsPerPage"];
      if (resolverType == "list") {
        Promise.all([
          this.getItemsPaging(page, itemsPerPage, "", ""),
          this.getItemsCount("")
        ]).then(() => {
          resolve();
        }, reject);
      } else if (resolverType === "edit") {
        Promise.all([this.viewItem(route.params["id"])]).then(() => {
          resolve();
        }, reject);
      } else if (resolverType === "view") {
        Promise.all([
          this.viewItem(route.params["id"]),
          this.getUserBottles(route.params["id"])
        ]).then(() => {
          resolve();
        }, reject);
      }
    });
  }

  getUserBottles(itemId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      // send get request
      this.http
        .get<Bottle[]>(
          AppConfig.apiUrl +
          "bottles?filter[where][ownerId]=" +
          itemId +
          "&access_token=" +
          this.authService.getToken()
        )
        .subscribe(
          bottles => {
            this.bottles = bottles;
            resolve(bottles);
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

  getUsers(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get<User[]>(
          AppConfig.apiUrl +
          "users?filter[order]=createdAt DESC&access_token=" +
          this.authService.getToken()
        )
        .subscribe(
          (response: any) => {
            // 
            this.items = response;
            this.onUsersChanged.next(this.items);
            resolve(response);
          },
          err => {
            
            if (err.error.error.code == AppConfig.authErrorCode)
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
    // PAGING //
    const offset = page * itemsPerPage;
    const _paging =
      'filter={"limit":' +
      itemsPerPage +
      ', "skip":' +
      offset +
      ',"order":"createdAt DESC"';

    // SEARCHING //
    let _searching = "",
      _searching_count = "";
    if (searchBy && searchBy !== "") {
      if (searchBy) {
        _searching = '{"username": {"like": "^' + searchBy + '"}}';
        _searching_count = '{"username": {"like": "^' + searchBy + '"}}';
      }
    }

    // FILERIGN //
    let _filtering = "";
    if (filterBy && filterBy !== "") {
      if (filterBy.gender) {
        _filtering += ',{"gender":"' + filterBy.gender + '"}';
        _searching_count += ',{"gender":"' + filterBy.gender + '"}';
      }

      if (filterBy.country) {
        _filtering += ',{"ISOCode":"' + filterBy.country + '"}';
        _searching_count += ',{"ISOCode":"' + filterBy.country + '"}';
      }

      if (filterBy.isVip != "") {
        if (filterBy.isVip == 'true') {
          _searching_count += ',{"totalPaid":{"gt":' + 0 + '}}';
          _filtering += ',{"totalPaid":{"gt":' + 0 + '}}';
        }
        else if (filterBy.isVip == 'false') {
          _searching_count += ',{"totalPaid":' + 0 + '}';
          _filtering += ',{"totalPaid":' + 0 + '}';
        }
      }

      if (filterBy.isHost != "") {
        _filtering += ',{"isHost":"' + filterBy.isHost + '"}';
        _searching_count += ',{"isHost":"' + filterBy.isHost + '"}';
      }

      if(filterBy.agency != ""){
        _filtering += ',{"agencyId":"' + filterBy.agency + '"}';
        _searching_count += ',{"agencyId":"' + filterBy.agency + '"}';
      }

      if (filterBy.lastLoginFrom) {
        _filtering += ',{"lastLogin":{"gt":"' + filterBy.lastLoginFrom + '"}}';
        _searching_count +=
          ',{"lastLogin":{"gt":"' + filterBy.lastLoginFrom + '"}}';
      }


      if (filterBy.createdFrom) {
        _filtering += ',{"createdAt":{"gt":"' + filterBy.createdFrom + '"}}';
        _searching_count +=
          ',{"createdAt":{"gt":"' + filterBy.createdFrom + '"}}';
      }

      if (filterBy.createdTo) {
        _filtering += ',{"createdAt":{"lt":"' + filterBy.createdTo + '"}}';
        _searching_count += ',{"createdAt":{"lt":"' + filterBy.createdTo + '"}}';
      }

      if (filterBy.status) {
        _filtering += ',{"status":"' + filterBy.status + '"}';
        _searching_count += ',{"status":"' + filterBy.status + '"}';
      }

      if (!_searching && _filtering.charAt(0) === ",") {
        _filtering = _filtering.substr(1);
        _searching_count = _searching_count.substr(1);
      }

      if (_filtering.charAt(_filtering.length - 1) === ",") {
        _filtering = _filtering.slice(0, -1);
        _searching_count = _searching_count.slice(0, -1);
      }

      if (_filtering !== "") {
        _searching += _filtering;
      }
    }

    if (_searching !== "" || _filtering !== "") {
      _searching = ',"where":{"and":[' + _searching + "]}";
      this.getItemsCount("where={\"and\":[" + _searching_count + "]}&");
    }

    const api =
      AppConfig.apiUrl +
      "users?" +
      _paging +
      _searching +
      "}&access_token=" +
      this.authService.getToken();

    return new Promise((resolve, reject) => {
      this.http.get<User[]>(api).subscribe(
        (response: any) => {
          // 
          this.items = response;
          this.onUsersChanged.next(this.items);
          resolve(true);
        },
        error => {
          
          if (error.error.error.code === AppConfig.authErrorCode) {
            this.router.navigate(["/error-404"]);
          } else {
            this.helpersService.showActionSnackbar(
              null,
              false,
              "",
              { style: "failed-snackbar" },
              AppConfig.technicalException
            );
            this.router.navigate(["/auth/login"]);
          }
          reject();
        }
      );
    });
  }

  getItemsCount(filter): Promise<any> {
    const api =
      AppConfig.apiUrl +
      "users/count?" +
      filter +
      "access_token=" +
      this.authService.getToken();

    
    return new Promise((resolve, reject) => {
      this.http.get(api).subscribe(
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

  getUsersAutocpmlete(keyword): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get<User[]>(
          AppConfig.apiUrl +
          "users?filter[limit]=10&filter[where][username][regexp]=^" +
          keyword +
          "&access_token=" +
          this.authService.getToken()
        )
        .subscribe(
          (response: any) => {
            resolve(response);
          },
          err => {
            
            if (err.error.error.code == AppConfig.authErrorCode)
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
  deactivateDevice(deviceId, value) {
    return new Promise((resolve, reject) => {
      this.http
        .patch(
          AppConfig.apiUrl +
          "devices/" +
          deviceId +
          "?access_token=" +
          this.authService.getToken(),
          { status: value }
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

  deleteUser(item): Promise<any> {
    return new Promise((resolve, reject) => {
      const index = this.items.indexOf(item);
      this.http
        .delete<User>(
          AppConfig.apiUrl +
          "users/" +
          item.id +
          "?access_token=" +
          this.authService.getToken()
        )
        .subscribe(
          data => {
            this.items.splice(index, 1);
            this.onUsersChanged.next(this.items);
            this.itemsCount--;
            this.onItemsCountChanged.next(this.itemsCount);
            this.progressBarService.toggle();
            this.router.navigate(["/users/list"]);
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

  export(values): Promise<any> {
    let filter = "";
    
    if (values && values !== null) {
      if (values.gender) filter += ',{"gender":"' + values.gender + '"}';

      if (values.lastLoginFrom) {
        filter += ',{"lastLogin":{"gt":"' + values.lastLoginFrom + '"}}';
      }
      if (values.country) filter += ',{"ISOCode":"' + values.country + '"}';

      if (values.createdFrom)
        filter += ',{"createdAt":{"gt":"' + values.createdFrom + '"}}';

      if (values.createdTo)
        filter += ',{"createdAt":{"lt":"' + values.createdTo + '"}}';

      if (values.status) filter += ',{"status":"' + values.status + '"}';

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
          "users/export?" +
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

  viewItem(itemId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      // send get request
      this.http
        .get<User>(
          AppConfig.apiUrl +
          "users/" +
          itemId +
          "?access_token=" +
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


  getTransctionUser(userId) {
    return new Promise((resolve, reject) => {
      this.http
        .get(
          AppConfig.apiUrl +
          "users/" +
          userId +
          "/getTransaction?access_token=" +
          this.authService.getToken()
        )
        .subscribe(
          data => {
            resolve(data);
          })
    })
  }

  editItem(item: User): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .patch<User>(
          AppConfig.apiUrl +
          "users/" +
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

  newItem(item: User): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post<User>(AppConfig.apiUrl + "users", item).subscribe(
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
}
