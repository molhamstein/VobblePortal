import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import {AuthService} from "../../pages/authentication/auth.service";
import {AppConfig} from "../../../shared/app.config";

import {HelpersService} from "../../../shared/helpers.service";
import {ProgressBarService} from "../../../../core/services/progress-bar.service";

@Injectable()
export class TypeGoodsService {

  onItemsChanged: BehaviorSubject<any> = new BehaviorSubject({});
  onItemChanged: BehaviorSubject<any> = new BehaviorSubject({});
  item: any;
  items: any[];

  constructor(private http: HttpClient,
              private authService: AuthService,
              private router: Router,
              private progressBarService: ProgressBarService,
              private helpersService: HelpersService) { }



  getItems(): Promise<any> {
    return new Promise((resolve, reject) => {
        this.http.get(AppConfig.apiUrl + 'typeGoods?access_token=' + this.authService.getToken())
          .subscribe((response: any) => {
           // console.log('response typeGoods', response);
            this.items = response;
            this.onItemsChanged.next(this.items);
            resolve(response);
          }, error => {
            console.log('error ', error);
            this.helpersService.showActionSnackbar(null, false, '', {style: 'failed-snackbar'}, AppConfig.technicalException);
            reject();
          })
      }
    );
  }

}
