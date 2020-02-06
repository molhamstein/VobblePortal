import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { AppConfig } from '../../../shared/app.config';
import { AuthService } from '../../pages/authentication/auth.service';
import { HelpersService } from '../../../shared/helpers.service';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Agency } from './agency.model';

@Injectable()
export class AgenciesService {

  onItemsChanged: BehaviorSubject<any> = new BehaviorSubject({});
  onItemChanged: BehaviorSubject<any> = new BehaviorSubject({});
  onItemsCountChanged: BehaviorSubject<any> = new BehaviorSubject({});
  itemsCount: number;
  item: any;
  items: any[];

  constructor(private http: HttpClient, private authService: AuthService,
    private router: Router, private helpersService: HelpersService) { }

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
          this.getItemsPaging(page, itemsPerPage, ""),
          this.getItemsCount("")
        ]).then(() => {
          resolve();
        }, reject);
      }
      else if (resolverType == "view") {
        Promise.all([this.viewItem(route.params["id"])]).then(() => {
          resolve();
        }, reject);
      }
    });
  }

  getAgencies(): Observable<any> {
    return this.http.get(AppConfig.apiUrl + "/agencies");
  }

  getItemsPaging(page, itemsPerPage, filterBy): Promise<any> {

    // PAGING //
    const offset = page * itemsPerPage;
    const _paging = 'filter={"limit":' + itemsPerPage + ', "offset":' + offset + ',"order":"createdAt DESC"';


    // FILERIGN //
    let _filtering = "";
    if (filterBy && filterBy !== "") {
      if (filterBy.status) {
        _filtering += '{"status":"' + filterBy.status + '"},';
      }

      if (filterBy.name) {
        _filtering += '{"name": {"like": "^' + filterBy.name + '"}},'
      }

      if (_filtering.charAt(0) === ",") {
        _filtering = _filtering.substr(1);
      }

      if (_filtering.charAt(_filtering.length - 1) === ",") {
        _filtering = _filtering.slice(0, -1);
      }
    }

    this.getItemsCount('where={' + _filtering + '}&');
    if (_filtering != "") _filtering = ',"where":{"and":[' + _filtering + "]}";

    const api = AppConfig.apiUrl + "agencies?" + _paging + _filtering +
      "}&access_token=" + this.authService.getToken();

    return new Promise((resolve, reject) => {

      this.http.get<Agency[]>(api).subscribe(
        (response: any) => {

          this.items = response;
          this.onItemsChanged.next(this.items);
          resolve(this.items);
        },
        error => {
          if (error.error.error.code === AppConfig.authErrorCode)
            this.router.navigate(["/error-404"]);
          else {
            this.helpersService.showActionSnackbar(null, false, "",
              { style: "failed-snackbar" },
              AppConfig.technicalException
            );
          }
          reject();
        }
      );
    });
  }

  getItemsCount(filter): Promise<any> {

    const api = AppConfig.apiUrl + "agencies/count?" + filter +
      "access_token=" + this.authService.getToken();

    return new Promise((resolve, reject) => {
      this.http.get<Agency[]>(api).subscribe(
        (response: any) => {

          this.itemsCount = response.count;
          this.onItemsCountChanged.next(this.itemsCount);

          resolve(this.itemsCount);
        },
        error => {

          if (error.error.error.code === AppConfig.authErrorCode)
            this.router.navigate(["/error-404"]);
          else {
            this.helpersService.showActionSnackbar(null, false, "",
              { style: "failed-snackbar" },
              AppConfig.technicalException
            );
          }
          reject();
        }
      );
    });
  }

  viewItem(itemId: string): Promise<any> {
    return new Promise((resolve, reject) => {

      this.http.get<Agency>(AppConfig.apiUrl + "agencies/" + itemId +
        "?access_token=" + this.authService.getToken())
        .subscribe(
          item => {
            this.item = item;
            this.onItemChanged.next(this.item);
            resolve(item);
          },
          error => {
            if (error.error.error.code === AppConfig.authErrorCode)
              this.router.navigate(["/error-404"]);
            else {
              this.helpersService.showActionSnackbar(null, false, "",
                { style: "failed-snackbar" },
                AppConfig.technicalException
              );
            }
            reject();
          });
    });
  }

  editItem(item, id): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.patch<Agency>(AppConfig.apiUrl + "agencies/" + id +
        "?access_token=" + this.authService.getToken(), item)
        .subscribe(
          data => {
            resolve(true);
          },
          error => {
            if (error.error.error.code === AppConfig.authErrorCode)
              this.router.navigate(["/error-404"]);
            else {
              this.helpersService.showActionSnackbar(null, false, "",
                { style: "failed-snackbar" },
                AppConfig.technicalException
              );
            }
            reject();
          });
    });
  }

  newItem(item: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post<Agency>(AppConfig.apiUrl + "agencies/?access_token=" +
        this.authService.getToken(), item)
        .subscribe(
          data => {
            resolve(true);
          },
          error => {

            if (error.error.error.code === AppConfig.authErrorCode)
              this.router.navigate(["/error-404"]);
            else {
              this.helpersService.showActionSnackbar(null, false, "",
                { style: "failed-snackbar" },
                AppConfig.technicalException
              );
            }
            reject();
          });
    });
  }

  deleteItem(item: Agency): Promise<any> {

    const index = this.items.indexOf(item);
    
    return new Promise((resolve, reject) => {

      this.http.delete<Agency>(AppConfig.apiUrl + "agencies/" + item.id +
        "?access_token=" + this.authService.getToken())
        .subscribe(
          data => {

            this.items.splice(index, 1);
            this.itemsCount-- ;

            this.onItemsChanged.next(this.items);
            this.onItemsCountChanged.next(this.itemsCount);

            this.router.navigate(["/agency/list"]);
            resolve(true);
          },
          error => {

            if (error.error.error.code === AppConfig.authErrorCode)
              this.router.navigate(["/error-404"]);
            else {
              this.helpersService.showActionSnackbar(null, false, "",
                { style: "failed-snackbar" },
                AppConfig.technicalException
              );
            }
            reject();
          }
        );
    });
  }

}
