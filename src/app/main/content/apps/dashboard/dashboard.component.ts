import { GiftItemsService } from './../gift-items/gift-items.service';
import { ProductsService } from './../products/products.service';
import { ProgressBarService } from "./../../../../core/services/progress-bar.service";
import { FormControl } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { fuseAnimations } from "./../../../../core/animations";
import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { DashboardService } from "./dashboard.service";
import * as shape from "d3-shape";
import { forEach } from '@angular/router/src/utils/collection';

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
  BottlesReportChartData;
  AllItemsChartData;
  products = []
  filtersForm: FormGroup;
  filtersAllItemForm: FormGroup
  purchasesFiltersForm: FormGroup;
  genderFiltersForm: FormGroup;
  bottlesReportFiltersForm: FormGroup;

  allItem: any = {}
  lineChart: any = {};
  pieChart: any = {};
  today = new Date();
  report = {};
  dateNow = Date.now();
  purchasesChartType = "count";
  users = []
  currentTab = "item";
  colors = ["#ffebee", "#fce4ec", "#f3e5f5", "#ede7f6", "#e8eaf6", "#e3f2fd", "#e1f5fe", "#e0f7fa", "#e0f2f1", "#e8f5e9", "#f1f8e9", "#f9fbe7", "#fffde7", "#fff8e1", "#fff3e0", "#fbe9e7", "#efebe9", "#fafafa", "#eceff1", "#d32f2f", "#c2185b", "#7b1fa2", "#512da8", "#303f9f", "#1976d2", "#0288d1", "#0097a7", "#00796b", "#388e3c", "#689f38", "#afb42b", "#fbc02d", "#ffa000", "#f57c00", "#e64a19", "#9e9e9e", "#607d8b", "#d50000", "#c51162", "#aa00ff", "#6200ea", "#304ffe", "#2962ff", "#0091ea", "#00b8d4", "#00bfa5", "#00c853", "#64dd17", "#aeea00", "#ffd600", "#ffab00", "#ff6d00", "#dd2c00", "#3e2723", "#212121", "#263238"]
  constructor(
    private dashboardService: DashboardService,
    private formBuilder: FormBuilder,
    private giftItemsServices: GiftItemsService,
    private progressBarService: ProgressBarService,
    private productSer: ProductsService
  ) {
    // then(items => {
    //   return items;
    // });
    /**
     *  //users
     */

    this.allItem = {
      currentRange: 'itemCount',
      xAxis: true,
      yAxis: true,
      gradient: false,
      legend: false,
      showXAxisLabel: false,
      xAxisLabel: 'Days',
      showYAxisLabel: false,
      yAxisLabel: 'Isues',
      scheme: {
        domain: this.colors
      },
      onSelect: (ev) => {
        
      }
    };
    this.lineChart = {
      xAxis: true,
      yAxis: true,
      gradient: false,
      legend: true,
      showXAxisLabel: true,
      xAxisLabel: "Date",
      showYAxisLabel: true,
      yAxisLabel: "Count",
      scheme: {
        domain: ["#42BFF7", "#f84a62", "#C7B42C", "#AAAAAA"]
      },
      curve: shape.curveBasis,
      onSelect: ev => {
        
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
        
      }
    };

    setInterval(() => {
      this.dateNow = Date.now();
    }, 1000);
  }

  sortKey(obj) {
    var keys = [];

    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        keys.push(key);
      }
    }
    var tempKey = keys.sort(function (a, b) {
      var c = new Date(a).getTime()
      var d = new Date(b).getTime()
      
      
      
      
      if (d < c)
        return 1
      else
        return -1
    });
    return tempKey;
  }



  reportToArray(array) {
    var data = [[], []]
    for (const key in array['coins']) {
      if (array['coins'].hasOwnProperty(key)) {
        const element = array['coins'][key];
        var newArrayElement = []
        for (const childKey in element['product']) {
          if (element['product'].hasOwnProperty(childKey)) {
            const newElement = element['product'][childKey];
            newArrayElement.push(newElement)
          }
        }
        data[0].unshift({ 'data': newArrayElement, 'date': key })
      }
    }

    for (const key in array['dollar']) {
      if (array['dollar'].hasOwnProperty(key)) {
        const element = array['dollar'][key];
        var newArrayElement = []
        for (const childKey in element['product']) {
          if (element['product'].hasOwnProperty(childKey)) {
            const newElement = element['product'][childKey];
            newArrayElement.push(newElement)
          }
        }
        data[1].unshift({ 'data': newArrayElement, 'date': key })
      }
    }

    return data
  }
  ngOnInit() {
    let month, day, year;
    year = this.today.getFullYear();
    month = this.today.getMonth();
    day = this.today.getDate();

    if (month <= 0) {
      year -= 1;
      month = 12;
    }

    const backdate = new Date(year, month - 1, day);

    this.filtersForm = this.formBuilder.group({
      from: new FormControl(backdate),
      to: new FormControl(this.today)
    });
    this.filtersAllItemForm = this.formBuilder.group({
      from: new FormControl(backdate),
      to: new FormControl(this.today),
      user: new FormControl(),
      productsId: new FormControl()
    });



    this.purchasesFiltersForm = this.formBuilder.group({
      from: new FormControl(backdate),
      to: new FormControl(this.today)
    });

    this.genderFiltersForm = this.formBuilder.group({
      from: new FormControl(backdate),
      to: new FormControl(this.today)
    });

    this.bottlesReportFiltersForm = this.formBuilder.group({
      from: new FormControl(backdate),
      to: new FormControl(this.today)
    });

    this.BottlesReportChartData = this.dashboardService.bottlesReport;
    this.BottlesChartData = this.dashboardService.bottles;
    this.UsersChartData = this.dashboardService.users;
    this.ItemsChartData = this.dashboardService.items;
    let mainChart = { "itemCount": [], "coinsCount": [], "itemCost": [], "coinsCost": [] }
    this.productSer.getAllItems().then(
      val => {
        this.products = val
        this.report = this.reportToArray(this.dashboardService.allItems)
        
        
        //   },
        //  err => , 
        //  () =>  
        //  );

        var sortedKeysCoins = this.sortKey(this.dashboardService.allItems['coins'])
        
        
        sortedKeysCoins.forEach(key => {
          const element = this.dashboardService.allItems['coins'][key];
          let tempObjectCount = {
            'name': key,
            'series': []
          }
          let tempObjectCost = {
            'name': key,
            'series': []
          }
          for (let index = 0; index < this.products.length; index++) {
            const produstElement = this.products[index];
            if (element.product[produstElement.id] != null) {
              tempObjectCost.series.push({
                'name': produstElement.name_ar,
                'value': element.product[produstElement.id].cost
              })
              tempObjectCount.series.push({
                'name': produstElement.name_ar,
                'value': element.product[produstElement.id].count
              })

            } else {
              tempObjectCost.series.push({
                'name': produstElement.name_ar,
                'value': 0
              })
              tempObjectCount.series.push({
                'name': produstElement.name_ar,
                'value': 0
              })
            }
            if (index + 1 == this.products.length) {
              mainChart['itemCost'].push(tempObjectCost)
              mainChart['itemCount'].push(tempObjectCount)
            }
          }
        });
        // for (const key in this.dashboardService.allItems['coins']) {
        var sortedKeysDollar = this.sortKey(this.dashboardService.allItems['dollar'])

        sortedKeysDollar.forEach(key => {

          const element = this.dashboardService.allItems['dollar'][key];
          let tempObjectCount = {
            'name': key,
            'series': []
          }
          let tempObjectCost = {
            'name': key,
            'series': []
          }
          for (let index = 0; index < this.products.length; index++) {
            const produstElement = this.products[index];
            if (element.product[produstElement.id] != null) {
              tempObjectCost.series.push({
                'name': produstElement.name_ar,
                'value': element.product[produstElement.id].cost
              })
              tempObjectCount.series.push({
                'name': produstElement.name_ar,
                'value': element.product[produstElement.id].count
              })

            } else {
              tempObjectCost.series.push({
                'name': produstElement.name_ar,
                'value': 0
              })
              tempObjectCount.series.push({
                'name': produstElement.name_ar,
                'value': 0
              })
            }
            if (index + 1 == this.products.length) {
              mainChart['coinsCost'].push(tempObjectCost)
              mainChart['coinsCount'].push(tempObjectCount)
            }
          }

        })


        
      },
      reason => {
      }
    );

    this.AllItemsChartData = {
      'title': 'Github Issues',
      'ranges': {
        'TW': 'This Week',
        'LW': 'Last Week',
        '2W': '2 Weeks Ago'
      },
      'mainChart': mainChart
    }
    //  
    //  
    //  
  }

  ngOnDestroy() { }

  purchasesChartTypeChanged() {
    this.dashboardService.purchasesChartTypeChanged(this.purchasesChartType);
    this.ItemsChartData = this.dashboardService.items;
  }

  purchasesApplyFilter() {
    this.progressBarService.toggle();

    this.dashboardService.getItems(this.purchasesFiltersForm.value).then(
      val => {
        this.ItemsChartData = this.dashboardService.items;

        this.progressBarService.toggle();
      },
      reason => {
        // this.helpersService.showActionSnackbar(PageAction.Create, false, 'user', {style: 'failed-snackbar'});
        this.progressBarService.toggle();
        
      }
    );
  }

  genderApplyFilter() {
    this.progressBarService.toggle();

    this.dashboardService.getUsers(this.genderFiltersForm.value).then(
      val => {
        this.UsersChartData = this.dashboardService.users;

        this.progressBarService.toggle();
      },
      reason => {
        // this.helpersService.showActionSnackbar(PageAction.Create, false, 'user', {style: 'failed-snackbar'});
        this.progressBarService.toggle();
        
      }
    );
  }

  bottlesApplyFilter() {
    this.progressBarService.toggle();

    this.dashboardService.getBottlesReport(this.bottlesReportFiltersForm.value).then(
      val => {
        this.BottlesReportChartData = this.dashboardService.bottlesReport;
        this.progressBarService.toggle();
      },
      reason => {
        this.progressBarService.toggle();
        
      }
    );
  }

  getUserByString() {
    this.giftItemsServices
      .getUserByString(this.filtersAllItemForm.value.user)
      .then((data: any) => {
        this.users = data;
      });
  }
  keyUp() {
    var lastSearch = ""
    var mainThis = this
    lastSearch = mainThis.filtersAllItemForm.value.user
    setTimeout(function () {
      if (lastSearch == mainThis.filtersAllItemForm.value.user) {
        // mainThis.getItemsPaging()
        if (lastSearch != "")
          mainThis.getUserByString()
      }
    }, 1500);

  }
  exportAllItemFilter() {
    this.progressBarService.toggle();
    var username = this.filtersAllItemForm.value.user
    var filter = this.filtersAllItemForm.value
    if (username != "" && username != null)
      filter['ownerId'] = this.users.filter(function (el) {
        return el.username <= username
      })[0].id;
    this.dashboardService.exportAllItems(filter).then(
      val => {
        if (val)
          window.location.href = val;
      }
      ,
      reason => {
        // this.helpersService.showActionSnackbar(PageAction.Create, false, 'user', {style: 'failed-snackbar'});
        this.progressBarService.toggle();
        
      })
  }
  applyAllItemFilter() {
    this.progressBarService.toggle();
    var username = this.filtersAllItemForm.value.user
    var filter = this.filtersAllItemForm.value
    if (username != "" && username != null)
      filter['ownerId'] = this.users.filter(function (el) {
        return el.username <= username
      })[0].id;
    
    
    
    
    this.dashboardService.getAllItems(filter).then(
      val => {
        this.report = this.reportToArray(this.dashboardService.allItems)

        let mainChart = { "itemCount": [], "coinsCount": [], "itemCost": [], "coinsCost": [] }
        for (const key in this.dashboardService.allItems['coins']) {
          if (this.dashboardService.allItems['coins'].hasOwnProperty(key)) {
            const element = this.dashboardService.allItems['coins'][key];
            let tempObjectCount = {
              'name': key,
              'series': []
            }
            let tempObjectCost = {
              'name': key,
              'series': []
            }
            for (let index = 0; index < this.products.length; index++) {
              const produstElement = this.products[index];
              if (element.product[produstElement.id] != null) {
                tempObjectCost.series.push({
                  'name': produstElement.name_ar,
                  'value': element.product[produstElement.id].cost
                })
                tempObjectCount.series.push({
                  'name': produstElement.name_ar,
                  'value': element.product[produstElement.id].count
                })

              } else {
                tempObjectCost.series.push({
                  'name': produstElement.name_ar,
                  'value': 0
                })
                tempObjectCount.series.push({
                  'name': produstElement.name_ar,
                  'value': 0
                })
              }
              if (index + 1 == this.products.length) {
                mainChart['itemCost'].push(tempObjectCost)
                mainChart['itemCount'].push(tempObjectCount)
              }
            }

          }
        }
        for (const key in this.dashboardService.allItems['dollar']) {
          if (this.dashboardService.allItems['dollar'].hasOwnProperty(key)) {
            const element = this.dashboardService.allItems['dollar'][key];
            let tempObjectCount = {
              'name': key,
              'series': []
            }
            let tempObjectCost = {
              'name': key,
              'series': []
            }
            for (let index = 0; index < this.products.length; index++) {
              const produstElement = this.products[index];
              if (element.product[produstElement.id] != null) {
                tempObjectCost.series.push({
                  'name': produstElement.name_ar,
                  'value': element.product[produstElement.id].cost
                })
                tempObjectCount.series.push({
                  'name': produstElement.name_ar,
                  'value': element.product[produstElement.id].count
                })

              } else {
                tempObjectCost.series.push({
                  'name': produstElement.name_ar,
                  'value': 0
                })
                tempObjectCount.series.push({
                  'name': produstElement.name_ar,
                  'value': 0
                })
              }
              if (index + 1 == this.products.length) {
                mainChart['coinsCost'].push(tempObjectCost)
                mainChart['coinsCount'].push(tempObjectCount)
              }
            }

          }
        }
        this.AllItemsChartData = {
          'title': 'Github Issues',
          'ranges': {
            'TW': 'This Week',
            'LW': 'Last Week',
            '2W': '2 Weeks Ago'
          },
          'mainChart': mainChart
        }
        this.progressBarService.toggle();
      },
      reason => {
        // this.helpersService.showActionSnackbar(PageAction.Create, false, 'user', {style: 'failed-snackbar'});
        this.progressBarService.toggle();
        
      }
    );

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
        
      }
    );
  }

  exportTimeStates(): void {
    this.dashboardService.exportTimeStates(this.filtersForm.value).then(res => {
      if (res) {
        window.location.href = res;
      }
    });
  }

  // purchasesExport(): void {
  //   this.dashboardService.purchasesExport(this.filtersForm.value).then(res => {
  //     if (res) {
  //       window.location.href = res;
  //     }
  //   });
  // }
  purchasesExport(): void {
    this.dashboardService.exportAsExcelFile();
  }

  // clearFilter() {
  //   this.filtersForm.reset();
  //   this.dashboardService.getBottles();
  // }
}
