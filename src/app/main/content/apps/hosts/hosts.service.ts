import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../pages/authentication/auth.service';
import { HelpersService } from '../../../shared/helpers.service';
import { AppConfig } from '../../../shared/app.config';
import { map } from 'rxjs/operators';
import { Hosts } from '../hosts/hosts.model';


@Injectable()
export class HostsService implements Resolve<any> {

  onItemsChanged: BehaviorSubject<any> = new BehaviorSubject({});
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
          this.getItemsPaging("")
        ]).then(() => {
          resolve();
        }, reject);
      }
    });
  }

  makeFilter(filterBy, key) {

    let values = filterBy;
    let filter = "";


    if (values.startFrom || values.startTo) {    
      if (values.startFrom)
        filter += '{"createdAt":{"gte":"' + values.startFrom + '"}},';
      if (values.startTo)
        filter += '{"createdAt":{"lte":"' + values.startTo + '"}},';
    }
    else { 
      let today = new Date();
      let priorDate = new Date().setDate(today.getDate()-30);
      let lastMonth = new Date(priorDate);
      
      filter += '{"createdAt":{"gte":"' + lastMonth + '"}},';
      filter += '{"createdAt":{"lte":"' + today + '"}},';
    }

    if (values.ownerId)
      filter += '{"relatedUserId":"' + values.ownerId + '"},';
    if (values.isHost)
      filter += '{"relatedUser.isHost":' + values.isHost + '},';
    else 
      filter += '{"relatedUser.isHost":' + true + '},';

    if (values.agency)
      filter += '{"relatedUser.agencyId":"' + values.agency + '"},';

    if (filter.charAt(0) === ",") {
      filter = filter.substr(1);
    }
    if (filter.charAt(filter.length - 1) === ",")
      filter = filter.slice(0, -1);

    // filter={"where":{"and":[{"createdAt":{"gte":"2010-01-21T09:52:30.427Z"}},
    //                         {"createdAt":{"lte":"2010-01-21T09:52:30.427Z"}}]}}

    if (key === 'filter') {
      if (filter !== "") filter = '{"where":{"and":[' + filter + ']}}';
      else filter = '{"where":{"and":[]}}';
    }
    else if (key === 'export') {
      if (filter !== "") filter = "{" + filter + "}";
      else filter = "{}";
    }

    return filter;
  }

  getItemsPaging(filterBy): Promise<any> {
    return new Promise((resolve, reject) => {

      let api = AppConfig.apiUrl + "users/getReportHost?"
        + "access_token=" + this.authService.getToken() + "&filter=";


      let filter = this.makeFilter(filterBy, "filter");
      api += filter;

      this.http.get<Hosts[]>(api).pipe(
        map(response => {
          let result: Hosts[] = [];
          for (let res of response)
            result.push(new Hosts(res));
          return result;
        }),
      ).subscribe((response: any) => {
        this.items = response;
        this.onItemsChanged.next(this.items);
        resolve(response);
      },
        error => {
          console.log("error ", error);
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

    let filter = this.makeFilter(filterBy, "export");

    let api = AppConfig.apiUrl + "users/exportReportHost?"
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
