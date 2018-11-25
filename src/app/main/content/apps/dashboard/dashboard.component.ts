import { ProgressBarService } from "./../../../../core/services/progress-bar.service";
import { FormControl } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { fuseAnimations } from "./../../../../core/animations";
import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { DashboardService } from "./dashboard.service";
import * as shape from "d3-shape";

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
  filtersForm: FormGroup;

  lineChart: any = {};
  pieChart: any = {};
  today = new Date();
  dateNow = Date.now();

  purchasesChartType = "count";

  constructor(
    private dashboardService: DashboardService,
    private formBuilder: FormBuilder,
    private progressBarService: ProgressBarService
  ) {
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
    let month, day, year;
    year = this.today.getFullYear();
    month = this.today.getMonth();
    day = this.today.getDate();
    if (month - 1 <= 0) year = this.today.getFullYear() - 1;
    const backdate = new Date(year, month - 1, day);

    this.filtersForm = this.formBuilder.group({
      from: new FormControl(backdate),
      to: new FormControl(this.today)
    });

    this.BottlesChartData = this.dashboardService.bottles;
    this.UsersChartData = this.dashboardService.users;
    this.ItemsChartData = this.dashboardService.items;

    //  console.log("this.BottlesChartData ", this.BottlesChartData);
    //  console.log("this.UsersChartData ", this.UsersChartData);
    //  console.log("this.ItemsChartData ", this.ItemsChartData);
  }

  ngOnDestroy() {}

  purchasesChartTypeChanged() {
    this.dashboardService.purchasesChartTypeChanged(this.purchasesChartType);
    this.ItemsChartData = this.dashboardService.items;
  }

  applyFilter() {
    this.progressBarService.toggle();

    this.dashboardService.getBottles(this.filtersForm.value).then(
      val => {
        this.BottlesChartData = this.dashboardService.bottles;

        this.progressBarService.toggle();
      },
      reason => {
        // this.helpersService.showActionSnackbar(PageAction.Create, false, 'user', {style: 'failed-snackbar'});
        this.progressBarService.toggle();
        console.log("error ", reason);
      }
    );
  }

  // clearFilter() {
  //   this.filtersForm.reset();
  //   this.dashboardService.getBottles();
  // }
}
