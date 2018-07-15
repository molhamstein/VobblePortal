import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import {User} from "./user.model";
import {AuthService} from "../../pages/authentication/auth.service";
import {AppConfig} from "../../../shared/app.config";
import {HelpersService} from "../../../shared/helpers.service";

import {ProgressBarService} from "../../../../core/services/progress-bar.service";

@Injectable()
export class UsersService implements Resolve<any>{

  onUsersChanged: BehaviorSubject<any> = new BehaviorSubject({});
  onItemChanged: BehaviorSubject<any> = new BehaviorSubject({});
  onItemsCountChanged: BehaviorSubject<any> = new BehaviorSubject({});
  itemsCount: number;
  item: any;
  items: any[];

  constructor(private http: HttpClient,
              private authService: AuthService,
              private router: Router,
              private progressBarService: ProgressBarService,
              private helpersService: HelpersService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any  {
    return new Promise((resolve, reject) => {
      let resolverType = route.data['resolverType'];
      let page = route.data['page'];
      let itemsPerPage = route.data['itemsPerPage'];
      if(resolverType == 'list'){
        Promise.all([
          this.getItemsPaging(page, itemsPerPage),
          this.getItemsCount()
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

  getUsers(): Promise<any>  {
    return new Promise((resolve, reject) => {
        this.http.get<User[]>(AppConfig.apiUrl+ 'users?filter[order]=createdAt DESC&access_token=' + this.authService.getToken())
          .subscribe((response: any) => {
            console.log('response users', response);
            this.items = response;
            this.onUsersChanged.next(this.items);
            resolve(response);
          }, err =>{
            console.log('err', err);
            if(err.error.error.code == AppConfig.authErrorCode)
              this.router.navigate(['/error-404']);
            else this.helpersService.showActionSnackbar(null, false, '', {style: 'failed-snackbar'}, AppConfig.technicalException);
            reject();
          });
      }
    );
  }

  getItemsPaging(page, itemsPerPage): Promise<any> {
    return new Promise((resolve, reject) => {
        var offset = (page * itemsPerPage) +1 ;
        console.log(' offset ', offset);
        this.http.get<User[]>(AppConfig.apiUrl + 'users?filter[limit]='+itemsPerPage+'&filter[skip]='+offset+'&filter[order]=createdAt DESC&access_token=' + this.authService.getToken())
          .subscribe((response: any) => {
              console.log('response users', response);
              this.items = response;
              this.onUsersChanged.next(this.items);
              resolve(response);
            },
            error => {
              console.log('error ', error);
              if(error.error.error.code == AppConfig.authErrorCode)
                this.router.navigate(['/error-404']);
              else this.helpersService.showActionSnackbar(null, false, '', {style: 'failed-snackbar'}, AppConfig.technicalException);
              reject();
            }
          )
      }
    );
  }

  getItemsCount(): Promise<any> {
    return new Promise((resolve, reject) => {
        this.http.get<User[]>(AppConfig.apiUrl + 'users/count?access_token=' + this.authService.getToken())
          .subscribe((response: any) => {
              console.log('count users', response);
              this.itemsCount = response.count;
              this.onItemsCountChanged.next(this.itemsCount);
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


  getUsersAutocpmlete(keyword): Promise<any>  {
    return new Promise((resolve, reject) => {
        this.http.get<User[]>(AppConfig.apiUrl+ 'users?filter[limit]=10&filter[where][username][regexp]=^'+keyword+'&access_token=' + this.authService.getToken())
          .subscribe((response: any) => {
            console.log('response users', response);
            //this.items = response;
            //this.onUsersChanged.next(this.items);
            resolve(response);
          }, err =>{
            console.log('err', err);
            if(err.error.error.code == AppConfig.authErrorCode)
              this.router.navigate(['/error-404']);
            else this.helpersService.showActionSnackbar(null, false, '', {style: 'failed-snackbar'}, AppConfig.technicalException);
            reject();
          });
      }
    );
  }

  deleteUser(item): Promise<any>{
    return new Promise((resolve, reject) => {
      const index = this.items.indexOf(item);
      this.http.delete<User>(AppConfig.apiUrl+'users/' + item.id + '?access_token=' + this.authService.getToken())
        .subscribe(
          data => {
            console.log(data);
            this.items.splice(index, 1);
            this.onUsersChanged.next(this.items);
            this.itemsCount--;
            this.onItemsCountChanged.next(this.itemsCount);
            this.progressBarService.toggle();
            this.router.navigate(['/users/list']);
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
      this.http.get<User>(AppConfig.apiUrl+'users/' + itemId+ '?access_token=' + this.authService.getToken())
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

  editItem(item: User): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.patch<User>(AppConfig.apiUrl+'users/' + item.id + '?access_token=' + this.authService.getToken(), item)
        .subscribe(
          data => {
            console.log('data ', data);
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

  newItem(item: User): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post<User>(AppConfig.apiUrl + 'users', item)
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
