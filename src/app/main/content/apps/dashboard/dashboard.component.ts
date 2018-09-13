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
  lineChartResults = [
    {
      name: "New Users",
      series: [
        {
          value: 5252,
          name: "2016-09-15"
        },
        {
          value: 3885,
          name: "2016-09-13"
        },
        {
          value: 3132,
          name: "2016-09-16"
        },
        {
          value: 4131,
          name: "2016-09-21"
        },
        {
          value: 4632,
          name: "2016-09-15"
        }
      ]
    },
    {
      name: "Active Users",
      series: [
        {
          value: 5961,
          name: "2016-09-15"
        },
        {
          value: 5059,
          name: "2016-09-13"
        },
        {
          value: 3111,
          name: "2016-09-16"
        },
        {
          value: 2250,
          name: "2016-09-21"
        },
        {
          value: 5782,
          name: "2016-09-15"
        }
      ]
    },
    {
      name: "New Bottles",
      series: [
        {
          value: 3919,
          name: "2016-09-15"
        },
        {
          value: 4639,
          name: "2016-09-13"
        },
        {
          value: 5007,
          name: "2016-09-16"
        },
        {
          value: 2576,
          name: "2016-09-21"
        },
        {
          value: 3831,
          name: "2016-09-15"
        }
      ]
    }
  ];

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

  pieChartGenderResults = [
    {
      name: "Male",
      value: 40632
    },
    {
      name: "Female",
      value: 49737
    },
    {
      name: "Undefined",
      value: 36745
    }
  ];

  lineChart: any = {};
  pieChart: any = {};

  dateNow = Date.now();

  constructor(private projectsDashboardService: DashboardService) {
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
    // /**
    //  * Widget 11
    //  */
    // this.widget11.onContactsChanged = new BehaviorSubject({});
    // this.widget11.onContactsChanged.next(this.widgets.widget11.table.rows);
    // this.widget11.dataSource = new FilesDataSource(this.widget11);
  }

  ngOnDestroy() {}
}

export class FilesDataSource extends DataSource<any> {
  constructor(private widget11) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    return this.widget11.onContactsChanged;
  }

  disconnect() {}
}
