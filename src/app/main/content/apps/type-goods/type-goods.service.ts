import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AppConfig } from "../../../shared/app.config";
import { HelpersService } from "../../../shared/helpers.service";
import { AuthService } from "../../pages/authentication/auth.service";

@Injectable()
export class TypeGoodsService {

  onItemsChanged: BehaviorSubject<any> = new BehaviorSubject({});
  onItemChanged: BehaviorSubject<any> = new BehaviorSubject({});
  item: any;
  items: any[];

  constructor(private http: HttpClient,
    private authService: AuthService,
    private helpersService: HelpersService) { }



  getItems(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(AppConfig.apiUrl + 'typeGoods?access_token=' + this.authService.getToken())
        .subscribe((response: any) => {
          this.items = response;
          this.onItemsChanged.next(this.items);
          resolve(response);
        }, error => {
          
          this.helpersService.showActionSnackbar(null, false, '', { style: 'failed-snackbar' }, AppConfig.technicalException);
          reject();
        })
    }
    );
  }

}
