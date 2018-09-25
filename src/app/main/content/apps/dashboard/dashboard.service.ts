import { AuthService } from "./../../pages/authentication/auth.service";
import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from "@angular/router";
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";
import { AppConfig } from "../../../shared/app.config";

@Injectable()
export class DashboardService {
  users: any[];
  bottles: any[];
  items: any[];

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Resolve
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      Promise.all([this.getBottles(), this.getItems(), , this.getUsers()]).then(
        () => {
          resolve();
        },
        reject
      );
    });
  }

  getBottles(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get(
          AppConfig.apiUrl +
            "bottles/timeStateReport/?access_token=" +
            this.authService.getToken()
        )
        .subscribe((response: any) => {
          console.log("bottles ", response);
          this.bottles = response.map((i, index) => {
            const innerArray = i.map(inner => {
              return {
                value: inner.count,
                name:
                  inner.date.day +
                  "-" +
                  inner.date.month +
                  "-" +
                  inner.date.year
              };
            });
            let name = "";
            switch (index) {
              case 0: {
                name = "New Users";
                break;
              }
              case 1: {
                name = "Active Users";
                break;
              }
              case 2: {
                name = "New Bottles";
                break;
              }
            }
            return {
              name: name,
              series: innerArray
            };
          });

          console.log("this.BottlesChartData ", this.bottles);
          resolve(response);
        }, reject);
    });
  }

  getItems(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get(
          AppConfig.apiUrl +
            "items/itemStateReport/?access_token=" +
            this.authService.getToken()
        )
        .subscribe((response: any) => {
          console.log("items ", response);
          this.items = response;
          resolve(response);
        }, reject);
    });
  }

  getUsers(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get(
          AppConfig.apiUrl +
            "users/genderStateReport/?access_token=" +
            this.authService.getToken()
        )
        .subscribe((response: any) => {
          console.log("users ", response);
          this.users = [
            {
              name: "Male",
              value: response.male
            },
            {
              name: "Female",
              value: response.female
            }
          ];
          resolve(response);
        }, reject);
    });
  }
}
