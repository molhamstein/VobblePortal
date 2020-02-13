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
import { Product } from "./product.model";

@Injectable()
export class ProductsService implements Resolve<any> {
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
          this.getItemsPaging(page, itemsPerPage),
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
            "products?access_token=" +
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

  getAllItems(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get(
          AppConfig.apiUrl +
            "products/getAllProducts?access_token=" +
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

  getItemsPaging(page, itemsPerPage): Promise<any> {
    return new Promise((resolve, reject) => {
      var offset = page * itemsPerPage;
      // 
      this.http
        .get<Product[]>(
          AppConfig.apiUrl +
            "products?filter[limit]=" +
            itemsPerPage +
            "&filter[skip]=" +
            offset +
            "&access_token=" +
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

  getItemsCount(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get<Product[]>(
          AppConfig.apiUrl +
            "products/count?access_token=" +
            this.authService.getToken()
        )
        .subscribe(
          (response: any) => {
            //
            this.itemsCount = response.count;
            this.onItemsCountChanged.next(this.itemsCount);
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

  deleteItem(item): Promise<any> {
    return new Promise((resolve, reject) => {
      const index = this.items.indexOf(item);
      this.http
        .delete<Product>(
          AppConfig.apiUrl +
            "products/" +
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
            this.router.navigate(["/products/list"]);
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
        .get<Product>(
          AppConfig.apiUrl +
            "products/" +
            itemId +
            "?access_token=" +
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

  editItem(item: Product): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .patch<Product>(
          AppConfig.apiUrl +
            "products/" +
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

  newItem(item: Product): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post<Product>(AppConfig.apiUrl + "products", item).subscribe(
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
