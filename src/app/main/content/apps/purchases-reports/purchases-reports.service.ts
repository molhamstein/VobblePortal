import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import * as XLSX from "xlsx";
import { ProgressBarService } from "../../../../core/services/progress-bar.service";
import { AppConfig } from "../../../shared/app.config";
import { HelpersService } from "../../../shared/helpers.service";
import { AuthService } from "../../pages/authentication/auth.service";




@Injectable()
export class PurchasesReportsService implements Resolve<any> {
  perUsers: any[];
  perDay: any[];
  totalPerDay: any[];
  onePerUsersChanged: BehaviorSubject<any> = new BehaviorSubject({});
  onePerDaysChanged: BehaviorSubject<any> = new BehaviorSubject({});
  totalPerDaysChanged: BehaviorSubject<any> = new BehaviorSubject({});
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private progressBarService: ProgressBarService,
    private helpersService: HelpersService
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      let resolverType = route.data["resolverType"];
      if (resolverType == "perUser") {
        var today = new Date();
        var tomorrow = new Date(new Date().setDate(today.getDate() + 1));
        Promise.all([
          this.getItemsPerUser({ "from": today, "to": tomorrow }),
        ]).then(() => {
          resolve();
        }, reject);
      } else if (resolverType == "perDay") {
        var today = new Date();
        var lastMonth = new Date(new Date().setDate(today.getDate() - 30));
        Promise.all([
          this.getItemsPerDay({ "from": lastMonth, "to": today }),
        ]).then(() => {
          resolve();
        }, reject);
      }

    });
  }

  getItemsPerDay(filter = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      var from = new Date(filter['from']);
      from.setHours(0);
      from.setMinutes(0);
      var to = new Date(filter['to']);
      from.setHours(23);
      from.setMinutes(59);

      this.http
        .get(
          AppConfig.apiUrl +
          "items/getItemsByDay?access_token=" +
          this.authService.getToken() +
          "&from=" + from +
          "&to=" + to

        )
        .subscribe(
          (response: any) => {
            //
            this.perDay = response;
            this.totalPerDay = []
            var totalObject = {
              "countBottle": 0,
              "countCoins": 0,
              "countExtendChat": 0,
              "countFilterByCountry": 0,
              "countFilterByGender": 0,
              "countGift": 0,
              "countReply": 0,
              "countUnlockChat": 0,
              "countFilterByType": 0,
              "countCall": 0,
              "totalBottle": 0,
              "totalCoins": 0,
              "totalExtendChat": 0,
              "totalFilterByCountry": 0,
              "totalFilterByGender": 0,
              "totalGift": 0,
              "totalReply": 0,
              "totalSpentCoins": 0,
              "totalUnlockChat": 0,
              "totalFilterByType": 0,
              "totalCall" : 0,
            }
            for (let index = 0; index < response.length; index++) {
              const element = response[index];
              var percentageSpentCoins;
              var percentageSellCoins;
              if (response[index + 1]) {
                var nextElement = response[index + 1];
                if (nextElement.totalSpentCoins == 0) {
                  percentageSpentCoins = "-"
                } else {
                  percentageSpentCoins = element.totalSpentCoins / nextElement.totalSpentCoins;
                  percentageSpentCoins--;
                  percentageSpentCoins *= 100;
                  percentageSpentCoins = percentageSpentCoins.toFixed(2)
                }

                if (nextElement.totalCoins == 0) {
                  percentageSellCoins = "-"
                } else {
                  percentageSellCoins = element.totalCoins / nextElement.totalCoins;
                  percentageSellCoins--;
                  percentageSellCoins *= 100;
                  percentageSellCoins = percentageSellCoins.toFixed(2)

                }

              } else {
                percentageSpentCoins = 0;
                percentageSellCoins = 0;
              }
              response[index]['percentageSpentCoins'] = percentageSpentCoins;
              response[index]['percentageSellCoins'] = percentageSellCoins;


              totalObject['countBottle'] += element.countBottle
              totalObject['countCoins'] += element.countCoins
              totalObject['countExtendChat'] += element.countExtendChat
              totalObject['countFilterByCountry'] += element.countFilterByCountry
              totalObject['countFilterByGender'] += element.countFilterByGender
              totalObject['countGift'] += element.countGift
              totalObject['countReply'] += element.countReply
              totalObject['countUnlockChat'] += element.countUnlockChat
              totalObject['countFilterByType'] += element.countFilterByType
              totalObject['countCall'] += element.countCall
              totalObject['totalBottle'] += element.totalBottle
              totalObject['totalCoins'] += element.totalCoins
              totalObject['totalExtendChat'] += element.totalExtendChat
              totalObject['totalFilterByCountry'] += element.totalFilterByCountry
              totalObject['totalFilterByGender'] += element.totalFilterByGender
              totalObject['totalGift'] += element.totalGift
              totalObject['totalReply'] += element.totalReply
              totalObject['totalSpentCoins'] += element.totalSpentCoins
              totalObject['totalUnlockChat'] += element.totalUnlockChat
              totalObject['totalFilterByType'] += element.totalFilterByType
              totalObject['totalCall'] += element.totalCall
            }
            this.onePerDaysChanged.next(this.perDay);
            this.totalPerDay.push(totalObject)
            this.totalPerDaysChanged.next(this.totalPerDay);

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



  getItemsPerUser(filter = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      var from = new Date(filter['from']);
      from.setHours(0);
      from.setMinutes(0);
      var to = new Date(filter['to']);
      to.setHours(23);
      to.setMinutes(59);

      this.http
        .get(
          AppConfig.apiUrl +
          "items/getUsersCoinsByDay?access_token=" +
          this.authService.getToken() +
          "&from=" + from +
          "&to=" + to

        )
        .subscribe(
          (response: any) => {
            //
            this.perUsers = response;
            this.onePerUsersChanged.next(this.perUsers);
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


  getItemsByUser(date, ownerId): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get(
          AppConfig.apiUrl +
          "users/" + ownerId + "/getItemsByUser?access_token=" +
          this.authService.getToken() +
          "&from=" + date.from +
          "&to=" + date.to
        )
        .subscribe(
          (response: any) => {
            //
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

  export(filter): Promise<any> {


    return new Promise((resolve, reject) => {
      // send get request
      var from = new Date(filter['from']);
      from.setHours(0);
      from.setMinutes(0);
      var to = new Date(filter['to']);
      to.setHours(23);
      to.setMinutes(59);

      this.http
        .get(
          AppConfig.apiUrl +
          "items/getUsersItems?" +
          "&from=" + from +
          "&to=" + to +
          "&access_token=" +
          this.authService.getToken()
        )
        .subscribe(
          items => {
            resolve(items["path"]);
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
          }
        );
    });
  }

  exportAsExcelFile(filter): void {
    const json = []
    json[0] = {}
    json[0]['Title'] = "Cost"
    json[0]['Date'] = filter.from.getDate() + "-" + (filter.from.getMonth() + 1) + "-" + filter.from.getFullYear();
    json[0]['Expended Coins'] = this.totalPerDay[0]['totalSpentCoins'];
    json[0]['Coins'] = this.totalPerDay[0]['totalCoins'];
    json[0]['Bottle'] = this.totalPerDay[0]['totalBottle'];
    json[0]['Gender'] = this.totalPerDay[0]['totalFilterByGender'];
    json[0]['Country'] = this.totalPerDay[0]['totalFilterByCountry'];
    json[0]['Extend Chat'] = this.totalPerDay[0]['totalExtendChat'];
    json[0]['Reply'] = this.totalPerDay[0]['totalReply'];
    json[0]['Gift'] = this.totalPerDay[0]['totalGift'];
    json[0]['Filter By Type'] = this.totalPerDay[0]['totalFilterByType'];
    json[0]['Unlock Chat'] = this.totalPerDay[0]['totalUnlockChat'];
    json[0]['Call'] = this.totalPerDay[0]['totalCall'];
    json[1] = {}
    json[1]['Date'] = filter.to.getDate() + "-" + (filter.to.getMonth() + 1) + "-" + filter.to.getFullYear();
    json[1]['Title'] = "Count"
    json[1]['Coins'] = this.totalPerDay[0]['countCoins'];
    json[1]['Bottle'] = this.totalPerDay[0]['countBottle'];
    json[1]['Gender'] = this.totalPerDay[0]['countFilterByGender'];
    json[1]['Country'] = this.totalPerDay[0]['countFilterByCountry'];
    json[1]['Extend Chat'] = this.totalPerDay[0]['countExtendChat'];
    json[1]['Reply'] = this.totalPerDay[0]['countReply'];
    json[1]['Gift'] = this.totalPerDay[0]['countGift'];
    json[1]['Filter By Type'] = this.totalPerDay[0]['countFilterByType'];
    json[1]['Unlock Chat'] = this.totalPerDay[0]['countUnlockChat'];
    json[1]['Call'] = this.totalPerDay[0]['countCall'];

    
    const excelFileName = "Item_Total_";

    const workbook = XLSX.utils.book_new(); // create a new blank book
    const workSheet = XLSX.utils.json_to_sheet(json);

    XLSX.utils.book_append_sheet(workbook, workSheet, "data");

    XLSX.writeFile(workbook, excelFileName + new Date() + ".xlsx");
  }

}
