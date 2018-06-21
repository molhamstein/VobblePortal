import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {AuthService} from "../../pages/authentication/auth.service";
import {AppConfig} from "../../../shared/app.config";
import {Bottle} from "./bottle.model";
import {HelpersService} from "../../../shared/helpers.service";
import {ProgressBarService} from "../../../../core/services/progress-bar.service";


@Injectable()
export class BottlesService implements Resolve<any> {

  onItemsChanged: BehaviorSubject<any> = new BehaviorSubject({});
  onItemChanged: BehaviorSubject<any> = new BehaviorSubject({});
  item: any;
  items: any[];

  constructor(private http: HttpClient,
              private authService: AuthService,
              private helpersService: HelpersService,
              private progressBarService: ProgressBarService,
              private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      let resolverType = route.data['resolverType'];
      let page = route.data['page'];
      let itemsPerPage = route.data['itemsPerPage'];
      if(resolverType == 'list'){
        Promise.all([
          this.getItemsPaging(page, itemsPerPage)
        ]).then(() => {
            resolve();
          }, reject
        );
      }else if(resolverType == 'view'){
        Promise.all([
          this.viewItem(route.params['id'])
        ]).then(() => {
            resolve();
          }, reject
        );
      }
    });
  }

  getItemsPaging(page, itemsPerPage): Promise<any> {
    // filter[limit]='+itemsPerPage+'&filter[skip]='+offset+'&
    return new Promise((resolve, reject) => {
      var offset = (page * itemsPerPage) +1 ;
      console.log(' var offset = (page - 1) * itemsPerPage + 1; ', offset);
        this.http.get<Bottle[]>(AppConfig.apiUrl + 'bottles?filter[order]=createdAt DESC&access_token=' + this.authService.getToken())
          .subscribe((response: any) => {
              console.log('response bottles', response);
              this.items = response;
              //this.onItemsChanged.next(this.items);
              resolve(response);
            },
            error => {
              console.log('error ', error);
              if(error.error.error.code == AppConfig.authErrorCode)
                this.router.navigate(['/error-404']);
              else this.helpersService.showActionSnackbar(null, false, '', {style: 'failed-snackbar'}, AppConfig.technicalException);
              reject();
            }
          );
      }
    );
  }

  getItems(): Promise<any> {
    return new Promise((resolve, reject) => {
        this.http.get<Bottle[]>(AppConfig.apiUrl + 'bottles?access_token=' + this.authService.getToken())
          .subscribe((response: any) => {
            console.log('response bottles', response);
            //this.items = response;
            this.onItemsChanged.next(this.items);
            resolve(response);
          },
            error => {
              console.log('error ', error);
              if(error.error.error.code == AppConfig.authErrorCode)
                this.router.navigate(['/error-404']);
              else this.helpersService.showActionSnackbar(null, false, '', {style: 'failed-snackbar'}, AppConfig.technicalException);
              reject();
            }
          );
      }
    );
  }


  deleteItem(item): Promise<any> {
    return new Promise((resolve, reject) => {
      const index = this.items.indexOf(item);
      this.http.delete<Bottle>(AppConfig.apiUrl + 'bottles/' + item.id + '?access_token=' + this.authService.getToken())
        .subscribe(
          data => {
            console.log(data);
            this.items.splice(index, 1);
            this.onItemsChanged.next(this.items);
            this.progressBarService.toggle();
            this.router.navigate(['/bottles/list']);
            resolve(true);
          },
          error => {
            console.log('error ', error);
            this.progressBarService.toggle();
            if(error.error.error.code == AppConfig.authErrorCode)
              this.router.navigate(['/error-404']);
            else this.helpersService.showActionSnackbar(null, false, '', {style: 'failed-snackbar'}, AppConfig.technicalException);
            reject();
          }
        );
    });
  }

  viewItem(itemId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      // send get request
      this.http.get<Bottle>(AppConfig.apiUrl+'bottles/' + itemId+ '?access_token=' + this.authService.getToken())
        .subscribe(
          item => {
            console.log('item ', item);
            this.item = item;
            this.onItemChanged.next(this.item);
            resolve(item);
          },
          error => {
            console.log('error ', error);
            if(error.error.error.code == AppConfig.authErrorCode)
              this.router.navigate(['/error-404']);
            else this.helpersService.showActionSnackbar(null, false, '', {style: 'failed-snackbar'}, AppConfig.technicalException);
            reject();
          }
        );
    });
  }

  editItem(item: Bottle): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.patch<Bottle>(AppConfig.apiUrl+'bottles/' + item.id + '?access_token=' + this.authService.getToken(), item)
        .subscribe(
          data => {
            resolve(true);
          },
          error => {
            console.log('error ', error);
            if(error.error.error.code == AppConfig.authErrorCode)
              this.router.navigate(['/error-404']);
            else this.helpersService.showActionSnackbar(null, false, '', {style: 'failed-snackbar'}, AppConfig.technicalException);
            reject();
          }
        );
    });
  }

  newItem(item: Bottle): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post<Bottle>(AppConfig.apiUrl + 'bottles/?access_token=' + this.authService.getToken(), item)
        .subscribe(
          data => {
            console.log(data);
            resolve(true);
          },
          error => {
            console.log('error ', error);
            if(error.error.error.code == AppConfig.authErrorCode)
              this.router.navigate(['/error-404']);
            else this.helpersService.showActionSnackbar(null, false, '', {style: 'failed-snackbar'}, AppConfig.technicalException);
            reject();
          }
        );
    });
  }

}
