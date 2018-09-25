import { fuseAnimations } from "./../../../../core/animations";
import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { DashboardService } from "./dashboard.service";
import * as shape from "d3-shape";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { DataSource } from "@angular/cdk/collections";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class DashboardComponent implements OnInit, OnDestroy {
  BottlesChartData;
  UsersChartData;
  ItemsChartData;

  pieChartResults = [
    {
      name: "Germany",
      value: 40632
    },
    {
      name: "United States",
      value: 49737
    },
    {
      name: "France",
      value: 36745
    },
    {
      name: "United Kingdom",
      value: 36240
    },
    {
      name: "Spain",
      value: 33000
    },
    {
      name: "Italy",
      value: 35800
    }
  ];

  lineChart: any = {};
  pieChart: any = {};

  dateNow = Date.now();

  constructor(private dashboardService: DashboardService) {
    /**
     *  //users
     */
    this.lineChart = {
      //currentRange: "",
      xAxis: true,
      yAxis: true,
      gradient: false,
      legend: true,
      showXAxisLabel: true,
      xAxisLabel: "Date",
      showYAxisLabel: true,
      yAxisLabel: "Count",
      scheme: {
        domain: ["#42BFF7", "#C6ECFD", "#C7B42C", "#AAAAAA"]
      },
      curve: shape.curveBasis,
      onSelect: ev => {
        console.log(ev);
      }
    };

    /**
     * pieChart
     */
    this.pieChart = {
      // currentRange: "TW",
      legend: false,
      explodeSlices: false,
      labels: true,
      doughnut: false,
      gradient: false,
      scheme: {
        domain: ["#f44336", "#9c27b0", "#03a9f4", "#e91e63"]
      },
      onSelect: ev => {
        console.log(ev);
      }
    };

    setInterval(() => {
      this.dateNow = Date.now();
    }, 1000);
  }

  ngOnInit() {
    this.BottlesChartData = this.dashboardService.bottles;
    this.UsersChartData = this.dashboardService.users;

    console.log("this.BottlesChartData ", this.BottlesChartData);
    console.log("this.UsersChartData ", this.UsersChartData);
  }

  ngOnDestroy() {}
}

// export class FilesDataSource extends DataSource<any> {
//   constructor(private widget11) {
//     super();
//   }

//   /** Connect function called by the table to retrieve one stream containing the data to render. */
//   connect(): Observable<any[]> {
//     return this.widget11.onContactsChanged;
//   }

//   disconnect() {}
// }
