import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../pages/authentication/auth.service';
import { HelpersService } from '../../../shared/helpers.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { AppConfig } from '../../../shared/app.config';
import { Calls } from './calls.model';
import { map } from 'rxjs/operators';

@Injectable()

export class CallsService implements Resolve<any>{


  onItemsChanged: BehaviorSubject<any> = new BehaviorSubject({});
  onItemChanged: BehaviorSubject<any> = new BehaviorSubject({});
  onItemsCountChanged: BehaviorSubject<any> = new BehaviorSubject({});
  itemsCount: number;
  item: any;
  items: any[];

  constructor(private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private helpersService: HelpersService) { }

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
    });
  }

  makeFilter(filterBy, key) {

    let values = filterBy;
    let filter = "" ; 

    if (values.startFrom)
      filter += '"createdAt":{"gte":"' + values.startFrom + '"},';
    if (values.startTo)
      filter += '"createdAt":{"lte":"' + values.startTo + '"},';
    if (values.ownerId)
      filter += '"ownerId":"' + values.ownerId + '",';
    if (values.relatedUserId)
      filter += '"relatedUserId":"' + values.relatedUserId + '",';
    if (values.callStatus)
      filter += '"status":"' + values.callStatus + '",';

    if (values.ownerIsHost) {
      filter += '"owner.isHost":' + values.ownerIsHost + ',';
    }
    if (values.relatedUserIsHost)
      filter += '"relatedUser.isHost":' + values.relatedUserIsHost + ',';
    if (values.ownerAgencyId)
      filter += '"owner.agencyId":"' + values.ownerAgencyId + '",';
    if (values.relatedUserAgencyId)
      filter += '"relatedUser.agencyId":"' + values.relatedUserAgencyId + '",';


    if (filter.charAt(0) === ",") {
      filter = filter.substr(1);
    }
    if (filter.charAt(filter.length - 1) === ",")
      filter = filter.slice(0, -1);

    if (key === 'filter') {
      if (filter !== "") filter = '"where":{' + filter + '}';
      else filter = '"where":{}';
    }
    else if (key === 'count') {
      if (filter !== "") filter = "{" + filter + "}";
      else filter = "{}";
    }

    return filter;
  }

  getItemsPaging(page, itemsPerPage, filterBy): Promise<any> {
    return new Promise((resolve, reject) => {
      let offset = page * itemsPerPage;


     
      let paging = ',"order": "createdAt DESC","limit":' + itemsPerPage + ',"offset":' + offset ;
      
      

      let api = AppConfig.apiUrl + "callLogs/getFilterCallLog?"
        + "access_token=" + this.authService.getToken() + "&filter={";


      let filter = this.makeFilter(filterBy, "filter");
      api += filter;
      api += paging ; 

      api += "}";

      this.http.get<Calls[]>(api).pipe(
        map(response => {
          let result: Calls[] = [];
          for (let res of response)
            result.push(new Calls(res));
          return result;
        }),
      ).subscribe((response: any) => {
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

  getItemsCount(values?): Promise<any> {
    let api = "";

    let filter = this.makeFilter(values, "count");
    api =
      AppConfig.apiUrl + "callLogs/countFilterCallLog?"
      + "access_token=" + this.authService.getToken() + "&where=" + filter;


    
    return new Promise((resolve, reject) => {
      this.http.get<Calls[]>(api).subscribe(
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

  export(filterBy): Promise<any> {

    let filter = this.makeFilter(filterBy, "count");

    let api = AppConfig.apiUrl + "callLogs/exportFilterCallLog?"
      + "access_token=" + this.authService.getToken() + "&where=" + filter;

    return new Promise((resolve, reject) => {

      this.http.get(api).subscribe(response => {
        resolve(response["path"]);
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
        })
    });
  }



}
