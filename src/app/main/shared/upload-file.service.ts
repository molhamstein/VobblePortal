import { Injectable } from '@angular/core';
import {AppConfig} from "./app.config";
import {AuthService} from "../content/pages/authentication/auth.service";
import {HttpClient} from "@angular/common/http";
import {HelpersService} from "./helpers.service";

@Injectable()
export class UploadFileService {

  constructor(private http: HttpClient,
              private authService: AuthService,
              private helpersService: HelpersService) { }

  uploadFile(items, type?): Promise<any> {
    return new Promise((resolve, reject) => {
      if(type && type == 'video'){
        this.http.post(AppConfig.apiUrl + 'uploadFiles/videos/upload?access_token=' + this.authService.getToken(), items)
          .subscribe(
            data => {
            //  console.log('data ', data);
              resolve(data);
            },
            error => {
              console.log('error ', error);
              this.helpersService.showActionSnackbar(null, false, '', {style: 'failed-snackbar'}, AppConfig.technicalException);
              reject();
            }
          );
      }else{
        this.http.post(AppConfig.apiUrl + 'uploadFiles/images/upload?access_token=' + this.authService.getToken(), items)
          .subscribe(
            data => {
             // console.log('data ', data);
              resolve(data);
            },
            error => {
              console.log('error ', error);
              this.helpersService.showActionSnackbar(null, false, '', {style: 'failed-snackbar'}, AppConfig.technicalException);
              reject();
            }
          );
      }
    });
  }
}
