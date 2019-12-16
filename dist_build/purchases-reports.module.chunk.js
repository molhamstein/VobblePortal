webpackJsonp(["purchases-reports.module"],{

/***/ "../../../../../src/app/main/content/apps/purchases-reports/per-days/per-day.component.html":
/***/ (function(module, exports) {

module.exports = "<div id=\"products\" class=\"page-layout carded fullwidth\" fusePerfectScrollbar>\r\n  <!-- TOP BACKGROUND -->\r\n  <div class=\"top-bg mat-accent-bg\"></div>\r\n  <!-- / TOP BACKGROUND -->\r\n\r\n  <!-- CENTER -->\r\n  <div class=\"center\">\r\n    <!-- HEADER -->\r\n    <form class=\"header headerCustom white-fg\" fxLayout=\"column\" fxLayoutAlign=\"center space-around\"\r\n      [formGroup]=\"filtersForm\" style=\"margin: 17px 0;\">\r\n      <div fxLayout=\"row\" fxLayoutAlign=\"space-between center\">\r\n        <!-- APP TITLE -->\r\n        <div class=\"logo my-12 m-sm-0\" fxLayout=\"row\" fxLayoutAlign=\"start center\">\r\n          <mat-icon class=\"logo-icon mr-16\" *fuseIfOnDom\r\n            [@animate]=\"{ value: '*', params: { delay: '50ms', scale: '0.2' } }\">add_alarm</mat-icon>\r\n          <span class=\"logo-text h1\" *fuseIfOnDom\r\n            [@animate]=\"{ value: '*', params: { delay: '100ms', x: '-25px' } }\">Per Day</span>\r\n        </div>\r\n        <!-- / APP TITLE -->\r\n\r\n        <!-- SEARCH -->\r\n        <!-- <div class=\"search-input-wrapper mx-12 m-md-0\" fxFlex=\"1 0 auto\" fxLayout=\"row\" fxLayoutAlign=\"start center\">\r\n          <label for=\"search\" class=\"mr-8\">\r\n            <mat-icon class=\"secondary-text\">search</mat-icon>\r\n          </label>\r\n          <mat-form-field floatPlaceholder=\"never\" fxFlex=\"1 0 auto\">\r\n            <input type=\"text\" placeholder=\"User\" (keyup)=\"keyUp()\" aria-label=\"user\" matInput formControlName=\"user\"\r\n              name=\"country\" [matAutocomplete]=\"auto\" />\r\n            <mat-autocomplete #auto=\"matAutocomplete\">\r\n              <mat-option *ngFor=\"let iso of countries\" [value]=\"iso.username\">\r\n                {{ iso.username }}\r\n              </mat-option>\r\n            </mat-autocomplete>\r\n          </mat-form-field>\r\n        \r\n          <label for=\"search\" class=\"mr-8\" *ngIf=\"curentTab==2\">\r\n            <mat-icon class=\"secondary-text\">search</mat-icon>\r\n          </label>\r\n          <mat-form-field floatPlaceholder=\"never\" fxFlex=\"1 0 auto\" *ngIf=\"curentTab==2\">\r\n            <input type=\"text\" placeholder=\"Related User\" (keyup)=\"relatedUserkeyUp()\" aria-label=\"user\" matInput\r\n              formControlName=\"relatedUser\" name=\"country\" [matAutocomplete]=\"auto\" />\r\n            <mat-autocomplete #auto=\"matAutocomplete\">\r\n              <mat-option *ngFor=\"let iso of relatedUser\" [value]=\"iso.username\">\r\n                {{ iso.username }}\r\n              </mat-option>\r\n            </mat-autocomplete>\r\n          </mat-form-field>\r\n        </div> -->\r\n\r\n        <mat-form-field>\r\n          <input matInput (click)=\"picker.open()\" [matDatepicker]=\"picker\" placeholder=\"Date From\"\r\n            formControlName=\"from\" name=\"createdAt\" />\r\n          <mat-datepicker-toggle matSuffix [for]=\"picker\"></mat-datepicker-toggle>\r\n          <mat-datepicker #picker></mat-datepicker>\r\n        </mat-form-field>\r\n        <mat-form-field>\r\n          <input matInput (click)=\"topicker.open()\" [matDatepicker]=\"topicker\" placeholder=\"Date To\"\r\n            formControlName=\"to\" name=\"createdAt\" />\r\n          <mat-datepicker-toggle matSuffix [for]=\"topicker\"></mat-datepicker-toggle>\r\n          <mat-datepicker #topicker></mat-datepicker>\r\n        </mat-form-field>\r\n        <!-- / SEARCH -->\r\n\r\n        <button type=\"button\" mat-raised-button type=\"submit\" (click)=\"clearFilter()\"\r\n          class=\"add-product-button mat-white-bg  mt-sm-0\">\r\n          <span> CLEAR </span>\r\n        </button>\r\n\r\n        <button mat-raised-button type=\"submit\" (click)=\"applyFilter()\"\r\n          class=\"add-product-button mat-white-bg  mt-sm-0\">\r\n          <span> FILTER </span>\r\n        </button>\r\n\r\n        <!-- <button mat-raised-button [routerLink]=\"'/reports/new'\" class=\"add-product-button mat-white-bg  mt-sm-0\">\r\n            <span> NEW </span>\r\n          </button> -->\r\n      </div>\r\n\r\n      <div fxLayout=\"row\" fxLayoutAlign=\"\" fxLayoutGap=\"20px\">\r\n\r\n        <div>\r\n          <button mat-raised-button (click)=\"exportAsExcelFile()\" class=\"add-product-button mat-white-bg  mt-sm-0\">\r\n            Export\r\n          </button>\r\n        </div>\r\n\r\n\r\n      </div>\r\n      <div fxLayout=\"row\" fxLayoutAlign=\"space-between center\" fxLayoutGap=\"20px\">\r\n        <div mat-raised-button class=\"add-product-button mat-white-bg  mt-sm-0\">\r\n\r\n        </div>\r\n\r\n\r\n      </div>\r\n    </form>\r\n    <!-- / HEADER -->\r\n\r\n    <div class=\"content-card mat-white-bg\" class=\"custom-table\"\r\n      style=\"box-shadow:0px 4px 5px -2px rgba(0, 0, 0, 0.2), 0px 7px 10px 1px rgba(0, 0, 0, 0.14), 0px 2px 16px 1px rgba(0, 0, 0, 0.12)\">\r\n\r\n      <mat-table class=\"products-table\" #table [dataSource]=\"totalDataSource\" matSort\r\n        [@animateStagger]=\"{ value: '50' }\" fusePerfectScrollbar>\r\n\r\n        <ng-container cdkColumnDef=\"date\">\r\n          <mat-header-cell *cdkHeaderCellDef mat-sort-header>Date</mat-header-cell>\r\n          <mat-cell *cdkCellDef=\"let user\" style=\"width:30px\">\r\n            <div fxLayout=\"column\">\r\n\r\n              <p class=\"text-truncate\">{{ filtersForm.value.from| date:'dd-MM-yyyy'}} </p>\r\n              <p>\r\n                {{ filtersForm.value.to| date:'dd-MM-yyyy' }}</p>\r\n            </div>\r\n          </mat-cell>\r\n        </ng-container>\r\n\r\n\r\n        <ng-container cdkColumnDef=\"gender\">\r\n          <mat-header-cell *cdkHeaderCellDef mat-sort-header>Gender</mat-header-cell>\r\n          <mat-cell *cdkCellDef=\"let day\" matTooltip=\"Gender\" (click)=\"viewItems(day.filterByGenderArray)\">\r\n            <div fxLayout=\"column\">\r\n\r\n              <p class=\"text-truncate\" style=\"width: 50px;margin: 5px auto\">Cost :</p>\r\n              <p class=\"text-truncate\" style=\"width: 50px;margin: 5px auto\">Count :</p>\r\n            </div>\r\n\r\n            <div fxLayout=\"column\">\r\n              <p class=\"text-truncate\" style=\"margin: 5px auto\"><b>{{ day.totalFilterByGender }}</b> </p>\r\n              <p class=\"text-truncate\" style=\"margin: 5px auto\"><b>{{ day.countFilterByGender }}</b></p>\r\n            </div>\r\n          </mat-cell>\r\n        </ng-container>\r\n\r\n\r\n        <ng-container cdkColumnDef=\"country\">\r\n          <mat-header-cell *cdkHeaderCellDef mat-sort-header>Country</mat-header-cell>\r\n          <mat-cell *cdkCellDef=\"let day\" matTooltip=\"Country\" (click)=\"viewItems(day.filterByCountryArray)\">\r\n            <div fxLayout=\"column\">\r\n\r\n              <p class=\"text-truncate\" style=\"width: 50px;margin: 5px auto\">Cost :</p>\r\n              <p class=\"text-truncate\" style=\"width: 50px;margin: 5px auto\">Count :</p>\r\n            </div>\r\n\r\n            <div fxLayout=\"column\">\r\n              <p class=\"text-truncate\" style=\"margin: 5px auto\"><b>{{ day.totalFilterByCountry }}</b> </p>\r\n              <p class=\"text-truncate\" style=\"margin: 5px auto\"><b>{{ day.countFilterByCountry }}</b></p>\r\n            </div>\r\n          </mat-cell>\r\n        </ng-container>\r\n\r\n\r\n        <ng-container cdkColumnDef=\"totalSpentCoins\">\r\n          <mat-header-cell *cdkHeaderCellDef mat-sort-header>Total Coins</mat-header-cell>\r\n          <mat-cell *cdkCellDef=\"let day\" style=\"display: grid;\">\r\n            <p style=\"margin: 5px 0px\">{{ day.totalSpentCoins }}</p>\r\n            <!-- <br> -->\r\n\r\n          </mat-cell>\r\n        </ng-container>\r\n\r\n\r\n        <ng-container cdkColumnDef=\"coins\">\r\n          <mat-header-cell *cdkHeaderCellDef mat-sort-header>Coins</mat-header-cell>\r\n          <mat-cell *cdkCellDef=\"let day\" matTooltip=\"Coins\" (click)=\"viewItems(day.coinsArray)\">\r\n            <div fxLayout=\"column\">\r\n\r\n              <p class=\"text-truncate\" style=\"width: 50px;margin: 5px auto\">Cost :</p>\r\n              <p class=\"text-truncate\" style=\"width: 50px;margin: 5px auto\">Count :</p>\r\n            </div>\r\n            <div fxLayout=\"column\">\r\n              <p class=\"text-truncate\" style=\"margin: 5px auto\"><b>{{ day.totalCoins | number: '1.0-2'  }} $ </b></p>\r\n              <p class=\"text-truncate\" style=\"margin: 5px auto\"><b>{{ day.countCoins }}</b></p>\r\n            </div>\r\n\r\n          </mat-cell>\r\n        </ng-container>\r\n\r\n\r\n        <ng-container cdkColumnDef=\"extendChat\">\r\n          <mat-header-cell *cdkHeaderCellDef mat-sort-header>Extend Chat</mat-header-cell>\r\n          <mat-cell *cdkCellDef=\"let day\" matTooltip=\"Extend Chat\" (click)=\"viewItems(day.extendChatArray)\">\r\n            <div fxLayout=\"column\">\r\n\r\n              <p class=\"text-truncate\" style=\"width: 50px;margin: 5px auto\">Cost :</p>\r\n              <p class=\"text-truncate\" style=\"width: 50px;margin: 5px auto\">Count :</p>\r\n            </div>\r\n\r\n            <div fxLayout=\"column\">\r\n              <p class=\"text-truncate\" style=\"margin: 5px auto\"><b>{{ day.totalExtendChat }}</b> </p>\r\n              <p class=\"text-truncate\" style=\"margin: 5px auto\"><b>{{ day.countExtendChat }}</b></p>\r\n            </div>\r\n          </mat-cell>\r\n        </ng-container>\r\n\r\n\r\n        <ng-container cdkColumnDef=\"reply\">\r\n          <mat-header-cell *cdkHeaderCellDef mat-sort-header>Reply</mat-header-cell>\r\n          <mat-cell *cdkCellDef=\"let day\" matTooltip=\"Reply\" (click)=\"viewItems(day.repliesArray)\">\r\n            <div fxLayout=\"column\">\r\n\r\n              <p class=\"text-truncate\" style=\"width: 50px;margin: 5px auto\">Cost :</p>\r\n              <p class=\"text-truncate\" style=\"width: 50px;margin: 5px auto\">Count :</p>\r\n            </div>\r\n\r\n            <div fxLayout=\"column\">\r\n              <p class=\"text-truncate\" style=\"margin: 5px auto\"><b>{{ day.totalReply }}</b> </p>\r\n              <p class=\"text-truncate\" style=\"margin: 5px auto\"><b>{{ day.countReply }}</b></p>\r\n            </div>\r\n          </mat-cell>\r\n        </ng-container>\r\n\r\n\r\n        <ng-container cdkColumnDef=\"bottle\">\r\n          <mat-header-cell *cdkHeaderCellDef mat-sort-header>Bottle</mat-header-cell>\r\n          <mat-cell *cdkCellDef=\"let day\" matTooltip=\"Bottle\" (click)=\"viewItems(day.bottleArray)\">\r\n            <div fxLayout=\"column\">\r\n\r\n              <p class=\"text-truncate\" style=\"width: 50px;margin: 5px auto\">Cost :</p>\r\n              <p class=\"text-truncate\" style=\"width: 50px;margin: 5px auto\">Count :</p>\r\n            </div>\r\n\r\n            <div fxLayout=\"column\">\r\n              <p class=\"text-truncate\" style=\"margin: 5px auto\"><b>{{ day.totalBottle }}</b> </p>\r\n              <p class=\"text-truncate\" style=\"margin: 5px auto\"><b>{{ day.countBottle }}</b></p>\r\n            </div>\r\n          </mat-cell>\r\n        </ng-container>\r\n\r\n        <ng-container cdkColumnDef=\"gift\">\r\n          <mat-header-cell *cdkHeaderCellDef mat-sort-header>Gift</mat-header-cell>\r\n          <mat-cell *cdkCellDef=\"let day\" matTooltip=\"Gift\" (click)=\"viewItems(day.giftArray)\">\r\n            <div fxLayout=\"column\">\r\n\r\n              <p class=\"text-truncate\" style=\"width: 50px;margin: 5px auto\">Cost :</p>\r\n              <p class=\"text-truncate\" style=\"width: 50px;margin: 5px auto\">Count :</p>\r\n            </div>\r\n\r\n            <div fxLayout=\"column\">\r\n              <p class=\"text-truncate\" style=\"margin: 5px auto\"><b>{{ day.totalGift }}</b> </p>\r\n              <p class=\"text-truncate\" style=\"margin: 5px auto\"><b>{{ day.countGift }}</b></p>\r\n            </div>\r\n          </mat-cell>\r\n        </ng-container>\r\n        <mat-header-row *cdkHeaderRowDef=\"displayedColumns\"></mat-header-row>\r\n\r\n        <mat-row *cdkRowDef=\"let user; columns: displayedColumns\" class=\"product\" matRipple>\r\n        </mat-row>\r\n      </mat-table>\r\n\r\n      <mat-table class=\"products-table\" #table [dataSource]=\"dataSource\" matSort [@animateStagger]=\"{ value: '50' }\"\r\n        fusePerfectScrollbar>\r\n\r\n        <ng-container cdkColumnDef=\"date\">\r\n          <mat-header-cell *cdkHeaderCellDef mat-sort-header>Date</mat-header-cell>\r\n          <mat-cell *cdkCellDef=\"let user\" style=\"width:30px\">\r\n            <p class=\"text-truncate\">{{ user.date }}</p>\r\n          </mat-cell>\r\n        </ng-container>\r\n\r\n\r\n        <ng-container cdkColumnDef=\"gender\">\r\n          <mat-header-cell *cdkHeaderCellDef mat-sort-header>Gender</mat-header-cell>\r\n          <mat-cell *cdkCellDef=\"let day\" matTooltip=\"Gender\" (click)=\"viewItems(day.filterByGenderArray)\">\r\n            <div fxLayout=\"column\">\r\n\r\n              <p class=\"text-truncate\" style=\"width: 50px;margin: 5px auto\">Cost :</p>\r\n              <p class=\"text-truncate\" style=\"width: 50px;margin: 5px auto\">Count :</p>\r\n            </div>\r\n\r\n            <div fxLayout=\"column\">\r\n              <p class=\"text-truncate\" style=\"margin: 5px auto\"><b>{{ day.totalFilterByGender }}</b> </p>\r\n              <p class=\"text-truncate\" style=\"margin: 5px auto\"><b>{{ day.countFilterByGender }}</b></p>\r\n            </div>\r\n          </mat-cell>\r\n        </ng-container>\r\n\r\n\r\n        <ng-container cdkColumnDef=\"country\">\r\n          <mat-header-cell *cdkHeaderCellDef mat-sort-header>Country</mat-header-cell>\r\n          <mat-cell *cdkCellDef=\"let day\" matTooltip=\"Country\" (click)=\"viewItems(day.filterByCountryArray)\">\r\n            <div fxLayout=\"column\">\r\n\r\n              <p class=\"text-truncate\" style=\"width: 50px;margin: 5px auto\">Cost :</p>\r\n              <p class=\"text-truncate\" style=\"width: 50px;margin: 5px auto\">Count :</p>\r\n            </div>\r\n\r\n            <div fxLayout=\"column\">\r\n              <p class=\"text-truncate\" style=\"margin: 5px auto\"><b>{{ day.totalFilterByCountry }}</b> </p>\r\n              <p class=\"text-truncate\" style=\"margin: 5px auto\"><b>{{ day.countFilterByCountry }}</b></p>\r\n            </div>\r\n          </mat-cell>\r\n        </ng-container>\r\n\r\n\r\n        <ng-container cdkColumnDef=\"totalSpentCoins\">\r\n          <mat-header-cell *cdkHeaderCellDef mat-sort-header>Total Coins</mat-header-cell>\r\n          <mat-cell *cdkCellDef=\"let day\" style=\"display: grid;\">\r\n            <p style=\"margin: 5px 0px\">{{ day.totalSpentCoins }}</p>\r\n            <!-- <br> -->\r\n            <p></p>\r\n            <p style=\"margin: 5px 0px;position: relative;padding: 0px 20px;\">\r\n              <mat-icon class=\"logo-icon mr-16\"\r\n                style=\"color: green;margin-right: 0px !important;font-size: 25px;position: absolute;left: -6px;top: -4px;\"\r\n                *ngIf=\"day.percentageSpentCoins!='-' && day.percentageSpentCoins>0\">arrow_drop_up</mat-icon>\r\n              <mat-icon class=\"logo-icon mr-16\"\r\n                style=\"color: red;margin-right: 0px !important;font-size: 25px;position: absolute;left: -6px;top: -4px;\"\r\n                *ngIf=\"day.percentageSpentCoins!='-' && day.percentageSpentCoins<0\">arrow_drop_down</mat-icon>\r\n              <mat-icon class=\"logo-icon mr-16\"\r\n                style=\"    margin-right: 0px !important;font-size: 25px;position: absolute;left: -6px;top: -4px;\"\r\n                *ngIf=\"day.percentageSpentCoins=='-'\">maximize</mat-icon>\r\n\r\n              {{day.percentageSpentCoins!='-'?day.percentageSpentCoins+'%':''}}\r\n            </p>\r\n          </mat-cell>\r\n        </ng-container>\r\n\r\n\r\n        <ng-container cdkColumnDef=\"coins\">\r\n          <mat-header-cell *cdkHeaderCellDef mat-sort-header>Coins</mat-header-cell>\r\n          <mat-cell *cdkCellDef=\"let day\" matTooltip=\"Coins\" (click)=\"viewItems(day.coinsArray)\">\r\n            <div fxLayout=\"column\">\r\n\r\n              <p class=\"text-truncate\" style=\"width: 50px;margin: 5px auto\">Cost :</p>\r\n              <p class=\"text-truncate\" style=\"width: 50px;margin: 5px auto\">Count :</p>\r\n              <p class=\"text-truncate\" style=\"width: 50px;margin: 15px auto\"></p>\r\n            </div>\r\n\r\n            <div fxLayout=\"column\">\r\n              <p class=\"text-truncate\" style=\"margin: 5px auto\"><b>{{ day.totalCoins | number: '1.0-2'  }} $ </b></p>\r\n              <p class=\"text-truncate\" style=\"margin: 5px auto\"><b>{{ day.countCoins }}</b></p>\r\n\r\n              <p style=\"margin: 5px 0px;position: relative;padding: 0px 20px;margin-left: -45px;min-height: 19px;\">\r\n                <mat-icon class=\"logo-icon mr-16\"\r\n                  style=\"color:green;margin-right: 0px !important;font-size: 25px;position: absolute;left: -6px;top: -4px;\"\r\n                  *ngIf=\"day.percentageSellCoins!='-' && day.percentageSellCoins>0\">arrow_drop_up</mat-icon>\r\n                <mat-icon class=\"logo-icon mr-16\"\r\n                  style=\"color:red;margin-right: 0px !important;font-size: 25px;position: absolute;left: -6px;top: -4px;\"\r\n                  *ngIf=\"day.percentageSellCoins!='-' && day.percentageSellCoins<0\">arrow_drop_down</mat-icon>\r\n                <mat-icon class=\"logo-icon mr-16\"\r\n                  style=\"margin-right: 0px !important;font-size: 25px;position: absolute;left: -6px;bottom: -11px;\"\r\n                  *ngIf=\"day.percentageSellCoins=='-'\">maximize</mat-icon>\r\n\r\n                {{day.percentageSellCoins!='-'?day.percentageSellCoins+'%':''}}\r\n              </p>\r\n            </div>\r\n          </mat-cell>\r\n        </ng-container>\r\n\r\n\r\n        <ng-container cdkColumnDef=\"extendChat\">\r\n          <mat-header-cell *cdkHeaderCellDef mat-sort-header>Extend Chat</mat-header-cell>\r\n          <mat-cell *cdkCellDef=\"let day\" matTooltip=\"Extend Chat\" (click)=\"viewItems(day.extendChatArray)\">\r\n            <div fxLayout=\"column\">\r\n\r\n              <p class=\"text-truncate\" style=\"width: 50px;margin: 5px auto\">Cost :</p>\r\n              <p class=\"text-truncate\" style=\"width: 50px;margin: 5px auto\">Count :</p>\r\n            </div>\r\n\r\n            <div fxLayout=\"column\">\r\n              <p class=\"text-truncate\" style=\"margin: 5px auto\"><b>{{ day.totalExtendChat }}</b> </p>\r\n              <p class=\"text-truncate\" style=\"margin: 5px auto\"><b>{{ day.countExtendChat }}</b></p>\r\n            </div>\r\n          </mat-cell>\r\n        </ng-container>\r\n\r\n\r\n        <ng-container cdkColumnDef=\"reply\">\r\n          <mat-header-cell *cdkHeaderCellDef mat-sort-header>Reply</mat-header-cell>\r\n          <mat-cell *cdkCellDef=\"let day\" matTooltip=\"Reply\" (click)=\"viewItems(day.repliesArray)\">\r\n            <div fxLayout=\"column\">\r\n\r\n              <p class=\"text-truncate\" style=\"width: 50px;margin: 5px auto\">Cost :</p>\r\n              <p class=\"text-truncate\" style=\"width: 50px;margin: 5px auto\">Count :</p>\r\n            </div>\r\n\r\n            <div fxLayout=\"column\">\r\n              <p class=\"text-truncate\" style=\"margin: 5px auto\"><b>{{ day.totalReply }}</b> </p>\r\n              <p class=\"text-truncate\" style=\"margin: 5px auto\"><b>{{ day.countReply }}</b></p>\r\n            </div>\r\n          </mat-cell>\r\n        </ng-container>\r\n\r\n\r\n        <ng-container cdkColumnDef=\"bottle\">\r\n          <mat-header-cell *cdkHeaderCellDef mat-sort-header>Bottle</mat-header-cell>\r\n          <mat-cell *cdkCellDef=\"let day\" matTooltip=\"Bottle\" (click)=\"viewItems(day.bottleArray)\">\r\n            <div fxLayout=\"column\">\r\n\r\n              <p class=\"text-truncate\" style=\"width: 50px;margin: 5px auto\">Cost :</p>\r\n              <p class=\"text-truncate\" style=\"width: 50px;margin: 5px auto\">Count :</p>\r\n            </div>\r\n\r\n            <div fxLayout=\"column\">\r\n              <p class=\"text-truncate\" style=\"margin: 5px auto\"><b>{{ day.totalBottle }}</b> </p>\r\n              <p class=\"text-truncate\" style=\"margin: 5px auto\"><b>{{ day.countBottle }}</b></p>\r\n            </div>\r\n          </mat-cell>\r\n        </ng-container>\r\n\r\n        <ng-container cdkColumnDef=\"gift\">\r\n          <mat-header-cell *cdkHeaderCellDef mat-sort-header>Gift</mat-header-cell>\r\n          <mat-cell *cdkCellDef=\"let day\" matTooltip=\"Gift\" (click)=\"viewItems(day.giftArray)\">\r\n            <div fxLayout=\"column\">\r\n\r\n              <p class=\"text-truncate\" style=\"width: 50px;margin: 5px auto\">Cost :</p>\r\n              <p class=\"text-truncate\" style=\"width: 50px;margin: 5px auto\">Count :</p>\r\n            </div>\r\n\r\n            <div fxLayout=\"column\">\r\n              <p class=\"text-truncate\" style=\"margin: 5px auto\"><b>{{ day.totalGift }}</b> </p>\r\n              <p class=\"text-truncate\" style=\"margin: 5px auto\"><b>{{ day.countGift }}</b></p>\r\n            </div>\r\n          </mat-cell>\r\n        </ng-container>\r\n\r\n        <!-- \r\n      <ng-container cdkColumnDef=\"gender\">\r\n        <mat-header-cell *cdkHeaderCellDef mat-sort-header>gender</mat-header-cell>\r\n        <mat-cell *cdkCellDef=\"let product\" style=\"width:30px\">\r\n          <p class=\"text-truncate\">{{ product.owner.gender }}</p>\r\n        </mat-cell>\r\n      </ng-container>\r\n\r\n\r\n      <ng-container cdkColumnDef=\"country\">\r\n        <mat-header-cell *cdkHeaderCellDef mat-sort-header>country</mat-header-cell>\r\n        <mat-cell *cdkCellDef=\"let product\">\r\n          <p class=\"text-truncate\">{{ product.owner.country?.name }}</p>\r\n        </mat-cell>\r\n      </ng-container>\r\n\r\n      <ng-container cdkColumnDef=\"count\">\r\n        <mat-header-cell *cdkHeaderCellDef mat-sort-header>Count</mat-header-cell>\r\n        <mat-cell *cdkCellDef=\"let product\">\r\n          <div fxLayout=\"column\">\r\n\r\n            <p class=\"text-truncate\" style=\"width: 50px;\"><b>Cost :</b></p>\r\n            <p class=\"text-truncate\" style=\"width: 50px;\"><b>Count :</b></p>\r\n          </div>\r\n\r\n          <div fxLayout=\"column\">\r\n            <p class=\"text-truncate\">{{ product.totalCost }}</p>\r\n            <p class=\"text-truncate\">{{ product.totalCount }}</p>\r\n          </div>\r\n        </mat-cell>\r\n      </ng-container>\r\n\r\n\r\n      <ng-container cdkColumnDef=\"product\">\r\n        <mat-header-cell *cdkHeaderCellDef mat-sort-header>product</mat-header-cell>\r\n        <mat-cell *cdkCellDef=\"let product\">\r\n\r\n          <div fxFlex=\"column\">\r\n            <div *ngFor=\"let oneProduct of product.products\">\r\n              <div style=\"width: 100%\">\r\n                <p class=\"text-truncate\">{{ oneProduct.name_en }} <span> {{ oneProduct.count }}</span>\r\n                  ,{{ oneProduct.cost }}$\r\n                </p>\r\n\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </mat-cell>\r\n      </ng-container> -->\r\n\r\n        <mat-header-row *cdkHeaderRowDef=\"displayedColumns\"></mat-header-row>\r\n\r\n        <mat-row *cdkRowDef=\"let user; columns: displayedColumns\" class=\"product\" matRipple>\r\n        </mat-row>\r\n      </mat-table>\r\n\r\n    </div>\r\n  </div>\r\n</div>\r\n"

/***/ }),

/***/ "../../../../../src/app/main/content/apps/purchases-reports/per-days/per-day.component.scss":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "/**\n * Applies styles for users in high contrast mode. Note that this only applies\n * to Microsoft browsers. Chrome can be included by checking for the `html[hc]`\n * attribute, however Chrome handles high contrast differently.\n */\n/* Theme for the ripple elements.*/\n/** The mixins below are shared between mat-menu and mat-select */\n/**\n * This mixin adds the correct panel transform styles based\n * on the direction that the menu panel opens.\n */\n/* stylelint-disable material/no-prefixes */\n/* stylelint-enable */\n/**\n * This mixin contains shared option styles between the select and\n * autocomplete components.\n */\n:host .header .search-input-wrapper {\n  max-width: 480px; }\n\n@media (max-width: 599px) {\n  :host .header {\n    height: 176px !important;\n    min-height: 176px !important;\n    max-height: 176px !important; } }\n\n@media (max-width: 599px) {\n  :host .top-bg {\n    height: 240px; } }\n\n:host .products-table {\n  -webkit-box-flex: 1;\n      -ms-flex: 1 1 auto;\n          flex: 1 1 auto;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.12); }\n  :host .products-table .mat-header-row {\n    min-height: 64px; }\n  :host .products-table .product {\n    position: relative;\n    cursor: pointer;\n    height: 84px; }\n  :host .products-table .mat-cell {\n    min-width: 0;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center; }\n    :host .products-table .mat-cell img {\n      width: 60px;\n      height: 60px;\n      border-radius: 50%;\n      -o-object-fit: cover;\n         object-fit: cover; }\n  :host .products-table .mat-column-id {\n    -webkit-box-flex: 0;\n        -ms-flex: 0 1 84px;\n            flex: 0 1 84px; }\n  :host .products-table .mat-column-image {\n    -webkit-box-flex: 0;\n        -ms-flex: 0 1 84px;\n            flex: 0 1 84px; }\n    :host .products-table .mat-column-image .product-image {\n      width: 52px;\n      height: 52px;\n      border: 1px solid rgba(0, 0, 0, 0.12); }\n  :host .products-table .mat-column-buttons {\n    -webkit-box-flex: 0;\n        -ms-flex: 0 1 80px;\n            flex: 0 1 80px; }\n  :host .products-table .quantity-indicator {\n    display: inline-block;\n    vertical-align: middle;\n    width: 8px;\n    height: 8px;\n    border-radius: 4px;\n    margin-right: 8px; }\n    :host .products-table .quantity-indicator + span {\n      display: inline-block;\n      vertical-align: middle; }\n  :host .products-table .active-icon {\n    border-radius: 50%; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/main/content/apps/purchases-reports/per-days/per-day.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PerDayComponent; });
/* unused harmony export FilesDataSource */
/* unused harmony export TotalDataSource */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__purchases_reports_service__ = __webpack_require__("../../../../../src/app/main/content/apps/purchases-reports/purchases-reports.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_animations__ = __webpack_require__("../../../../../src/app/core/animations.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__("../../../forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_material__ = __webpack_require__("../../../material/esm5/material.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_cdk_collections__ = __webpack_require__("../../../cdk/esm5/collections.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_Observable__ = __webpack_require__("../../../../rxjs/_esm5/Observable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_BehaviorSubject__ = __webpack_require__("../../../../rxjs/_esm5/BehaviorSubject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rxjs_add_operator_startWith__ = __webpack_require__("../../../../rxjs/_esm5/add/operator/startWith.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_rxjs_add_observable_merge__ = __webpack_require__("../../../../rxjs/_esm5/add/observable/merge.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_rxjs_add_operator_map__ = __webpack_require__("../../../../rxjs/_esm5/add/operator/map.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_rxjs_add_operator_debounceTime__ = __webpack_require__("../../../../rxjs/_esm5/add/operator/debounceTime.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_rxjs_add_operator_distinctUntilChanged__ = __webpack_require__("../../../../rxjs/_esm5/add/operator/distinctUntilChanged.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_rxjs_add_observable_fromEvent__ = __webpack_require__("../../../../rxjs/_esm5/add/observable/fromEvent.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__core_components_view_items_view_items_component__ = __webpack_require__("../../../../../src/app/core/components/view-items/view-items.component.ts");
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};















var PerDayComponent = (function () {
    function PerDayComponent(formBuilder, purchaseSer, dialog) {
        this.formBuilder = formBuilder;
        this.purchaseSer = purchaseSer;
        this.dialog = dialog;
        this.displayedColumns = [
            "date",
            "totalSpentCoins",
            "coins",
            "bottle",
            "gender",
            "country",
            "extendChat",
            "reply",
            "gift"
            // "product"
        ];
        this.dataSource = new FilesDataSource(this.purchaseSer);
        this.totalDataSource = new TotalDataSource(this.purchaseSer);
    }
    PerDayComponent.prototype.ngOnInit = function () {
        var today = new Date();
        var lastMonth = new Date(new Date().setDate(today.getDate() - 30));
        this.filtersForm = this.formBuilder.group({
            from: new __WEBPACK_IMPORTED_MODULE_3__angular_forms__["c" /* FormControl */](lastMonth),
            to: new __WEBPACK_IMPORTED_MODULE_3__angular_forms__["c" /* FormControl */](today),
        });
    };
    PerDayComponent.prototype.applyFilter = function () {
        this.purchaseSer.getItemsPerDay(this.filtersForm.value);
    };
    PerDayComponent.prototype.exportAsExcelFile = function () {
        this.purchaseSer.exportAsExcelFile(this.filtersForm.value);
    };
    PerDayComponent.prototype.clearFilter = function () {
        this.ngOnInit();
        this.purchaseSer.getItemsPerDay(this.filtersForm.value);
    };
    PerDayComponent.prototype.viewItems = function (data) {
        this.dialogRef = this.dialog.open(__WEBPACK_IMPORTED_MODULE_14__core_components_view_items_view_items_component__["a" /* FuseViewItemsComponent */], {
            width: '7 00px',
            data: { data: data },
            disableClose: false
        });
    };
    PerDayComponent.prototype.disconnect = function () { };
    PerDayComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["Component"])({
            selector: "app-per-day",
            template: __webpack_require__("../../../../../src/app/main/content/apps/purchases-reports/per-days/per-day.component.html"),
            styles: [__webpack_require__("../../../../../src/app/main/content/apps/purchases-reports/per-days/per-day.component.scss")],
            animations: __WEBPACK_IMPORTED_MODULE_2__core_animations__["a" /* fuseAnimations */]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["b" /* FormBuilder */], __WEBPACK_IMPORTED_MODULE_0__purchases_reports_service__["a" /* PurchasesReportsService */], __WEBPACK_IMPORTED_MODULE_4__angular_material__["j" /* MatDialog */]])
    ], PerDayComponent);
    return PerDayComponent;
}());

var FilesDataSource = (function (_super) {
    __extends(FilesDataSource, _super);
    function FilesDataSource(purchaseSer) {
        var _this = _super.call(this) || this;
        _this.purchaseSer = purchaseSer;
        _this._filterChange = new __WEBPACK_IMPORTED_MODULE_7_rxjs_BehaviorSubject__["a" /* BehaviorSubject */]("");
        _this._filteredDataChange = new __WEBPACK_IMPORTED_MODULE_7_rxjs_BehaviorSubject__["a" /* BehaviorSubject */]("");
        _this.filteredData = _this.purchaseSer.perDay;
        return _this;
    }
    Object.defineProperty(FilesDataSource.prototype, "filteredData", {
        get: function () {
            return this._filteredDataChange.value;
        },
        set: function (value) {
            this._filteredDataChange.next(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FilesDataSource.prototype, "filter", {
        get: function () {
            return this._filterChange.value;
        },
        set: function (filter) {
            this._filterChange.next(filter);
        },
        enumerable: true,
        configurable: true
    });
    /** Connect function called by the table to retrieve one stream containing the data to render. */
    FilesDataSource.prototype.connect = function () {
        var _this = this;
        var displayDataChanges = [
            this.purchaseSer.onePerDaysChanged,
        ];
        return __WEBPACK_IMPORTED_MODULE_6_rxjs_Observable__["Observable"].merge.apply(__WEBPACK_IMPORTED_MODULE_6_rxjs_Observable__["Observable"], displayDataChanges).map(function () {
            var data = _this.purchaseSer.perDay.slice();
            return data;
        });
    };
    FilesDataSource.prototype.disconnect = function () { };
    return FilesDataSource;
}(__WEBPACK_IMPORTED_MODULE_5__angular_cdk_collections__["a" /* DataSource */]));

var TotalDataSource = (function (_super) {
    __extends(TotalDataSource, _super);
    function TotalDataSource(purchaseSer) {
        var _this = _super.call(this) || this;
        _this.purchaseSer = purchaseSer;
        _this._filterChange = new __WEBPACK_IMPORTED_MODULE_7_rxjs_BehaviorSubject__["a" /* BehaviorSubject */]("");
        _this._filteredDataChange = new __WEBPACK_IMPORTED_MODULE_7_rxjs_BehaviorSubject__["a" /* BehaviorSubject */]("");
        _this.filteredData = _this.purchaseSer.totalPerDay;
        return _this;
    }
    Object.defineProperty(TotalDataSource.prototype, "filteredData", {
        get: function () {
            return this._filteredDataChange.value;
        },
        set: function (value) {
            this._filteredDataChange.next(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TotalDataSource.prototype, "filter", {
        get: function () {
            return this._filterChange.value;
        },
        set: function (filter) {
            this._filterChange.next(filter);
        },
        enumerable: true,
        configurable: true
    });
    /** Connect function called by the table to retrieve one stream containing the data to render. */
    TotalDataSource.prototype.connect = function () {
        var _this = this;
        var displayDataChanges = [
            this.purchaseSer.totalPerDaysChanged,
        ];
        return __WEBPACK_IMPORTED_MODULE_6_rxjs_Observable__["Observable"].merge.apply(__WEBPACK_IMPORTED_MODULE_6_rxjs_Observable__["Observable"], displayDataChanges).map(function () {
            var data = _this.purchaseSer.totalPerDay.slice();
            return data;
        });
    };
    TotalDataSource.prototype.disconnect = function () { };
    return TotalDataSource;
}(__WEBPACK_IMPORTED_MODULE_5__angular_cdk_collections__["a" /* DataSource */]));



/***/ }),

/***/ "../../../../../src/app/main/content/apps/purchases-reports/per-users/per-user.component.html":
/***/ (function(module, exports) {

module.exports = "<div id=\"products\" class=\"page-layout carded fullwidth\" fusePerfectScrollbar>\r\n  <!-- TOP BACKGROUND -->\r\n  <div class=\"top-bg mat-accent-bg\"></div>\r\n  <!-- / TOP BACKGROUND -->\r\n\r\n  <!-- CENTER -->\r\n  <div class=\"center\">\r\n    <!-- HEADER -->\r\n    <form class=\"header headerCustom white-fg\" fxLayout=\"column\" fxLayoutAlign=\"center space-around\"\r\n      [formGroup]=\"filtersForm\" style=\"margin: 17px 0;\">\r\n      <div fxLayout=\"row\" fxLayoutAlign=\"space-between center\">\r\n        <!-- APP TITLE -->\r\n        <div class=\"logo my-12 m-sm-0\" fxLayout=\"row\" fxLayoutAlign=\"start center\">\r\n          <mat-icon class=\"logo-icon mr-16\" *fuseIfOnDom\r\n            [@animate]=\"{ value: '*', params: { delay: '50ms', scale: '0.2' } }\">add_alarm</mat-icon>\r\n          <span class=\"logo-text h1\" *fuseIfOnDom\r\n            [@animate]=\"{ value: '*', params: { delay: '100ms', x: '-25px' } }\">Per User</span>\r\n\r\n        </div>\r\n        <!-- / APP TITLE -->\r\n      \r\n\r\n        <!-- SEARCH -->\r\n        <!-- <div class=\"search-input-wrapper mx-12 m-md-0\" fxFlex=\"1 0 auto\" fxLayout=\"row\" fxLayoutAlign=\"start center\">\r\n          <label for=\"search\" class=\"mr-8\">\r\n            <mat-icon class=\"secondary-text\">search</mat-icon>\r\n          </label>\r\n          <mat-form-field floatPlaceholder=\"never\" fxFlex=\"1 0 auto\">\r\n            <input type=\"text\" placeholder=\"User\" (keyup)=\"keyUp()\" aria-label=\"user\" matInput formControlName=\"user\"\r\n              name=\"country\" [matAutocomplete]=\"auto\" />\r\n            <mat-autocomplete #auto=\"matAutocomplete\">\r\n              <mat-option *ngFor=\"let iso of countries\" [value]=\"iso.username\">\r\n                {{ iso.username }}\r\n              </mat-option>\r\n            </mat-autocomplete>\r\n          </mat-form-field>\r\n        \r\n          <label for=\"search\" class=\"mr-8\" *ngIf=\"curentTab==2\">\r\n            <mat-icon class=\"secondary-text\">search</mat-icon>\r\n          </label>\r\n          <mat-form-field floatPlaceholder=\"never\" fxFlex=\"1 0 auto\" *ngIf=\"curentTab==2\">\r\n            <input type=\"text\" placeholder=\"Related User\" (keyup)=\"relatedUserkeyUp()\" aria-label=\"user\" matInput\r\n              formControlName=\"relatedUser\" name=\"country\" [matAutocomplete]=\"auto\" />\r\n            <mat-autocomplete #auto=\"matAutocomplete\">\r\n              <mat-option *ngFor=\"let iso of relatedUser\" [value]=\"iso.username\">\r\n                {{ iso.username }}\r\n              </mat-option>\r\n            </mat-autocomplete>\r\n          </mat-form-field>\r\n        </div> -->\r\n\r\n        <mat-form-field>\r\n          <input matInput (click)=\"picker.open()\" [matDatepicker]=\"picker\" placeholder=\"Date From\"\r\n            formControlName=\"from\" name=\"createdAt\" />\r\n          <mat-datepicker-toggle matSuffix [for]=\"picker\"></mat-datepicker-toggle>\r\n          <mat-datepicker #picker></mat-datepicker>\r\n        </mat-form-field>\r\n        <mat-form-field>\r\n          <input matInput (click)=\"topicker.open()\" [matDatepicker]=\"topicker\" placeholder=\"Date To\"\r\n            formControlName=\"to\" name=\"createdAt\" />\r\n          <mat-datepicker-toggle matSuffix [for]=\"topicker\"></mat-datepicker-toggle>\r\n          <mat-datepicker #topicker></mat-datepicker>\r\n        </mat-form-field>\r\n        <!-- / SEARCH -->\r\n\r\n        <button type=\"button\" mat-raised-button type=\"submit\" (click)=\"clearFilter()\"\r\n          class=\"add-product-button mat-white-bg  mt-sm-0\">\r\n          <span> CLEAR </span>\r\n        </button>\r\n\r\n        <button mat-raised-button type=\"submit\" (click)=\"applyFilter()\"\r\n          class=\"add-product-button mat-white-bg  mt-sm-0\">\r\n          <span> FILTER </span>\r\n        </button>\r\n        <!-- <button mat-raised-button [routerLink]=\"'/reports/new'\" class=\"add-product-button mat-white-bg  mt-sm-0\">\r\n            <span> NEW </span>\r\n          </button> -->\r\n      </div>\r\n      <div fxLayout=\"row\" fxLayoutAlign=\"\" fxLayoutGap=\"20px\">\r\n        <div>\r\n          <button mat-raised-button (click)=\"exportAsExcelFile()\" class=\"add-product-button mat-white-bg  mt-sm-0\">\r\n            Export\r\n          </button>\r\n        </div>\r\n\r\n\r\n      </div>\r\n      <div fxLayout=\"row\" fxLayoutAlign=\"space-between center\" fxLayoutGap=\"20px\">\r\n        <div mat-raised-button class=\"add-product-button mat-white-bg  mt-sm-0\">\r\n\r\n        </div>\r\n\r\n\r\n      </div>\r\n    </form>\r\n    <!-- / HEADER -->\r\n\r\n    <div class=\"content-card mat-white-bg\" class=\"custom-table\"\r\n      style=\"box-shadow:0px 4px 5px -2px rgba(0, 0, 0, 0.2), 0px 7px 10px 1px rgba(0, 0, 0, 0.14), 0px 2px 16px 1px rgba(0, 0, 0, 0.12)\">\r\n\r\n      <mat-table class=\"products-table\" #table [dataSource]=\"dataSource\" matSort [@animateStagger]=\"{ value: '50' }\"\r\n        fusePerfectScrollbar>\r\n\r\n        <!-- <ng-container cdkColumnDef=\"date\">\r\n          <mat-header-cell *cdkHeaderCellDef mat-sort-header>Date</mat-header-cell>\r\n          <mat-cell *cdkCellDef=\"let user\" style=\"width:30px\">\r\n            <p class=\"text-truncate\">{{ user.date }}</p>\r\n          </mat-cell>\r\n        </ng-container> -->\r\n\r\n\r\n        <ng-container cdkColumnDef=\"owner\">\r\n          <mat-header-cell *cdkHeaderCellDef mat-sort-header>Owner</mat-header-cell>\r\n          <mat-cell *cdkCellDef=\"let user\" style=\"width:30px\">\r\n            <p class=\"text-truncate\">{{ user.owner.username }}</p>\r\n          </mat-cell>\r\n        </ng-container>\r\n\r\n\r\n        <ng-container cdkColumnDef=\"total\">\r\n          <mat-header-cell *cdkHeaderCellDef mat-sort-header>Total</mat-header-cell>\r\n          <mat-cell *cdkCellDef=\"let user\">\r\n            <div fxLayout=\"column\">\r\n\r\n              <p class=\"text-truncate\" style=\"width: 80px;margin: 5px auto\"><b>Total Cost :</b></p>\r\n              <p class=\"text-truncate\" style=\"width: 80px;margin: 5px auto\"><b>Total Count :</b></p>\r\n            </div>\r\n\r\n            <div fxLayout=\"column\">\r\n              <p class=\"text-truncate\" style=\"margin: 5px auto\">{{ user.total }} $</p>\r\n              <p class=\"text-truncate\" style=\"margin: 5px auto\">{{ user.count }}</p>\r\n            </div>\r\n          </mat-cell>\r\n        </ng-container>\r\n\r\n        <ng-container cdkColumnDef=\"product\">\r\n          <mat-header-cell *cdkHeaderCellDef mat-sort-header>Product</mat-header-cell>\r\n          <mat-cell *cdkCellDef=\"let user\">\r\n\r\n            <div fxFlex=\"column\">\r\n              <div *ngFor=\"let oneProduct of user.products\">\r\n                <div style=\"width: 100%\">\r\n                  <p class=\"text-truncate\">{{ oneProduct.name_en }}\r\n                    <!-- <b>Count :</b> -->\r\n                    ,{{ oneProduct.price }}$\r\n                  </p>\r\n\r\n                </div>\r\n              </div>\r\n            </div>\r\n          </mat-cell>\r\n        </ng-container>\r\n\r\n\r\n\r\n        <!-- \r\n      <ng-container cdkColumnDef=\"gender\">\r\n        <mat-header-cell *cdkHeaderCellDef mat-sort-header>gender</mat-header-cell>\r\n        <mat-cell *cdkCellDef=\"let product\" style=\"width:30px\">\r\n          <p class=\"text-truncate\">{{ product.owner.gender }}</p>\r\n        </mat-cell>\r\n      </ng-container>\r\n\r\n\r\n      <ng-container cdkColumnDef=\"country\">\r\n        <mat-header-cell *cdkHeaderCellDef mat-sort-header>country</mat-header-cell>\r\n        <mat-cell *cdkCellDef=\"let product\">\r\n          <p class=\"text-truncate\">{{ product.owner.country?.name }}</p>\r\n        </mat-cell>\r\n      </ng-container>\r\n\r\n      <ng-container cdkColumnDef=\"count\">\r\n        <mat-header-cell *cdkHeaderCellDef mat-sort-header>Count</mat-header-cell>\r\n        <mat-cell *cdkCellDef=\"let product\">\r\n          <div fxLayout=\"column\">\r\n\r\n            <p class=\"text-truncate\" style=\"width: 80px;\"><b>Total Cost :</b></p>\r\n            <p class=\"text-truncate\" style=\"width: 80px;\"><b>Total Count :</b></p>\r\n          </div>\r\n\r\n          <div fxLayout=\"column\">\r\n            <p class=\"text-truncate\">{{ product.totalCost }}</p>\r\n            <p class=\"text-truncate\">{{ product.totalCount }}</p>\r\n          </div>\r\n        </mat-cell>\r\n      </ng-container>\r\n\r\n\r\n      <ng-container cdkColumnDef=\"product\">\r\n        <mat-header-cell *cdkHeaderCellDef mat-sort-header>product</mat-header-cell>\r\n        <mat-cell *cdkCellDef=\"let product\">\r\n\r\n          <div fxFlex=\"column\">\r\n            <div *ngFor=\"let oneProduct of product.products\">\r\n              <div style=\"width: 100%\">\r\n                <p class=\"text-truncate\">{{ oneProduct.name_en }} <span> {{ oneProduct.count }}</span>\r\n                  ,{{ oneProduct.cost }}$\r\n                </p>\r\n\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </mat-cell>\r\n      </ng-container> -->\r\n\r\n        <mat-header-row *cdkHeaderRowDef=\"displayedColumns\"></mat-header-row>\r\n\r\n        <mat-row *cdkRowDef=\"let user; columns: displayedColumns\" class=\"product\" matRipple (click)=\"viewUsers(user)\">\r\n        </mat-row>\r\n      </mat-table>\r\n\r\n    </div>\r\n  </div>\r\n</div>\r\n"

/***/ }),

/***/ "../../../../../src/app/main/content/apps/purchases-reports/per-users/per-user.component.scss":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "/**\n * Applies styles for users in high contrast mode. Note that this only applies\n * to Microsoft browsers. Chrome can be included by checking for the `html[hc]`\n * attribute, however Chrome handles high contrast differently.\n */\n/* Theme for the ripple elements.*/\n/** The mixins below are shared between mat-menu and mat-select */\n/**\n * This mixin adds the correct panel transform styles based\n * on the direction that the menu panel opens.\n */\n/* stylelint-disable material/no-prefixes */\n/* stylelint-enable */\n/**\n * This mixin contains shared option styles between the select and\n * autocomplete components.\n */\n:host .header .search-input-wrapper {\n  max-width: 480px; }\n\n@media (max-width: 599px) {\n  :host .header {\n    height: 176px !important;\n    min-height: 176px !important;\n    max-height: 176px !important; } }\n\n@media (max-width: 599px) {\n  :host .top-bg {\n    height: 240px; } }\n\n:host .products-table {\n  -webkit-box-flex: 1;\n      -ms-flex: 1 1 auto;\n          flex: 1 1 auto;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.12); }\n  :host .products-table .mat-header-row {\n    min-height: 64px; }\n  :host .products-table .product {\n    position: relative;\n    cursor: pointer;\n    height: 84px; }\n  :host .products-table .mat-cell {\n    min-width: 0;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center; }\n    :host .products-table .mat-cell img {\n      width: 60px;\n      height: 60px;\n      border-radius: 50%;\n      -o-object-fit: cover;\n         object-fit: cover; }\n  :host .products-table .mat-column-id {\n    -webkit-box-flex: 0;\n        -ms-flex: 0 1 84px;\n            flex: 0 1 84px; }\n  :host .products-table .mat-column-image {\n    -webkit-box-flex: 0;\n        -ms-flex: 0 1 84px;\n            flex: 0 1 84px; }\n    :host .products-table .mat-column-image .product-image {\n      width: 52px;\n      height: 52px;\n      border: 1px solid rgba(0, 0, 0, 0.12); }\n  :host .products-table .mat-column-buttons {\n    -webkit-box-flex: 0;\n        -ms-flex: 0 1 80px;\n            flex: 0 1 80px; }\n  :host .products-table .quantity-indicator {\n    display: inline-block;\n    vertical-align: middle;\n    width: 8px;\n    height: 8px;\n    border-radius: 4px;\n    margin-right: 8px; }\n    :host .products-table .quantity-indicator + span {\n      display: inline-block;\n      vertical-align: middle; }\n  :host .products-table .active-icon {\n    border-radius: 50%; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/main/content/apps/purchases-reports/per-users/per-user.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PerUserComponent; });
/* unused harmony export FilesDataSource */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__purchases_reports_service__ = __webpack_require__("../../../../../src/app/main/content/apps/purchases-reports/purchases-reports.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_animations__ = __webpack_require__("../../../../../src/app/core/animations.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__("../../../forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_material__ = __webpack_require__("../../../material/esm5/material.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_cdk_collections__ = __webpack_require__("../../../cdk/esm5/collections.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_Observable__ = __webpack_require__("../../../../rxjs/_esm5/Observable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_BehaviorSubject__ = __webpack_require__("../../../../rxjs/_esm5/BehaviorSubject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rxjs_add_operator_startWith__ = __webpack_require__("../../../../rxjs/_esm5/add/operator/startWith.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_rxjs_add_observable_merge__ = __webpack_require__("../../../../rxjs/_esm5/add/observable/merge.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_rxjs_add_operator_map__ = __webpack_require__("../../../../rxjs/_esm5/add/operator/map.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_rxjs_add_operator_debounceTime__ = __webpack_require__("../../../../rxjs/_esm5/add/operator/debounceTime.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_rxjs_add_operator_distinctUntilChanged__ = __webpack_require__("../../../../rxjs/_esm5/add/operator/distinctUntilChanged.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_rxjs_add_observable_fromEvent__ = __webpack_require__("../../../../rxjs/_esm5/add/observable/fromEvent.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__core_components_view_user_items_view_user_items_component__ = __webpack_require__("../../../../../src/app/core/components/view-user-items/view-user-items.component.ts");
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};















var PerUserComponent = (function () {
    function PerUserComponent(formBuilder, purchaseSer, dialog) {
        this.formBuilder = formBuilder;
        this.purchaseSer = purchaseSer;
        this.dialog = dialog;
        this.displayedColumns = [
            "owner",
            "total",
            "product"
        ];
        this.dataSource = new FilesDataSource(this.purchaseSer);
    }
    PerUserComponent.prototype.ngOnInit = function () {
        var today = new Date();
        var tomorrow = new Date(new Date().setDate(today.getDate() + 1));
        this.filtersForm = this.formBuilder.group({
            from: new __WEBPACK_IMPORTED_MODULE_3__angular_forms__["c" /* FormControl */](today),
            to: new __WEBPACK_IMPORTED_MODULE_3__angular_forms__["c" /* FormControl */](tomorrow),
        });
    };
    PerUserComponent.prototype.exportAsExcelFile = function () {
        this.purchaseSer.export(this.filtersForm.value).then(function (res) {
            if (res) {
                window.location.href = res;
            }
        });
    };
    PerUserComponent.prototype.applyFilter = function () {
        this.purchaseSer.getItemsPerUser(this.filtersForm.value);
    };
    PerUserComponent.prototype.clearFilter = function () {
        this.ngOnInit();
        this.purchaseSer.getItemsPerUser(this.filtersForm.value);
    };
    PerUserComponent.prototype.viewUsers = function (object) {
        var _this = this;
        this.purchaseSer
            .getItemsByUser(this.filtersForm.value, object.ownerId)
            .then(function (data) {
            console.log(data);
            _this.dialogRef = _this.dialog.open(__WEBPACK_IMPORTED_MODULE_14__core_components_view_user_items_view_user_items_component__["a" /* FuseViewUserItemsComponent */], {
                width: '7 00px',
                data: { "owner": object.owner, data: data },
                disableClose: false
            });
        });
    };
    PerUserComponent.prototype.disconnect = function () { };
    PerUserComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["Component"])({
            selector: "app-per-user",
            template: __webpack_require__("../../../../../src/app/main/content/apps/purchases-reports/per-users/per-user.component.html"),
            styles: [__webpack_require__("../../../../../src/app/main/content/apps/purchases-reports/per-users/per-user.component.scss")],
            animations: __WEBPACK_IMPORTED_MODULE_2__core_animations__["a" /* fuseAnimations */]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["b" /* FormBuilder */], __WEBPACK_IMPORTED_MODULE_0__purchases_reports_service__["a" /* PurchasesReportsService */], __WEBPACK_IMPORTED_MODULE_4__angular_material__["j" /* MatDialog */]])
    ], PerUserComponent);
    return PerUserComponent;
}());

var FilesDataSource = (function (_super) {
    __extends(FilesDataSource, _super);
    function FilesDataSource(purchaseSer) {
        var _this = _super.call(this) || this;
        _this.purchaseSer = purchaseSer;
        _this._filterChange = new __WEBPACK_IMPORTED_MODULE_7_rxjs_BehaviorSubject__["a" /* BehaviorSubject */]("");
        _this._filteredDataChange = new __WEBPACK_IMPORTED_MODULE_7_rxjs_BehaviorSubject__["a" /* BehaviorSubject */]("");
        _this.filteredData = _this.purchaseSer.perUsers;
        return _this;
    }
    Object.defineProperty(FilesDataSource.prototype, "filteredData", {
        get: function () {
            return this._filteredDataChange.value;
        },
        set: function (value) {
            this._filteredDataChange.next(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FilesDataSource.prototype, "filter", {
        get: function () {
            return this._filterChange.value;
        },
        set: function (filter) {
            this._filterChange.next(filter);
        },
        enumerable: true,
        configurable: true
    });
    /** Connect function called by the table to retrieve one stream containing the data to render. */
    FilesDataSource.prototype.connect = function () {
        var _this = this;
        var displayDataChanges = [
            this.purchaseSer.onePerUsersChanged,
        ];
        return __WEBPACK_IMPORTED_MODULE_6_rxjs_Observable__["Observable"].merge.apply(__WEBPACK_IMPORTED_MODULE_6_rxjs_Observable__["Observable"], displayDataChanges).map(function () {
            var data = _this.purchaseSer.perUsers.slice();
            return data;
        });
    };
    FilesDataSource.prototype.disconnect = function () { };
    return FilesDataSource;
}(__WEBPACK_IMPORTED_MODULE_5__angular_cdk_collections__["a" /* DataSource */]));



/***/ }),

/***/ "../../../../../src/app/main/content/apps/purchases-reports/purchases-reports.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PurchasesReportsModule", function() { return PurchasesReportsModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_modules_shared_module__ = __webpack_require__("../../../../../src/app/core/modules/shared.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__purchases_reports_service__ = __webpack_require__("../../../../../src/app/main/content/apps/purchases-reports/purchases-reports.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__per_users_per_user_component__ = __webpack_require__("../../../../../src/app/main/content/apps/purchases-reports/per-users/per-user.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__per_days_per_day_component__ = __webpack_require__("../../../../../src/app/main/content/apps/purchases-reports/per-days/per-day.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






var routes = [
    {
        path: 'perUser',
        component: __WEBPACK_IMPORTED_MODULE_4__per_users_per_user_component__["a" /* PerUserComponent */],
        resolve: {
            PurchasesReportsService: __WEBPACK_IMPORTED_MODULE_3__purchases_reports_service__["a" /* PurchasesReportsService */]
        },
        data: { resolverType: 'perUser' }
    },
    {
        path: 'perDay',
        component: __WEBPACK_IMPORTED_MODULE_5__per_days_per_day_component__["a" /* PerDayComponent */],
        resolve: {
            PurchasesReportsService: __WEBPACK_IMPORTED_MODULE_3__purchases_reports_service__["a" /* PurchasesReportsService */]
        },
        data: { resolverType: 'perDay' }
    }
];
var PurchasesReportsModule = (function () {
    function PurchasesReportsModule() {
    }
    PurchasesReportsModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__core_modules_shared_module__["a" /* SharedModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_router__["e" /* RouterModule */].forChild(routes),
            ],
            exports: [__WEBPACK_IMPORTED_MODULE_2__angular_router__["e" /* RouterModule */]],
            providers: [__WEBPACK_IMPORTED_MODULE_3__purchases_reports_service__["a" /* PurchasesReportsService */]],
            declarations: [__WEBPACK_IMPORTED_MODULE_4__per_users_per_user_component__["a" /* PerUserComponent */], __WEBPACK_IMPORTED_MODULE_5__per_days_per_day_component__["a" /* PerDayComponent */]]
        })
    ], PurchasesReportsModule);
    return PurchasesReportsModule;
}());



/***/ }),

/***/ "../../../../../src/app/main/content/apps/purchases-reports/purchases-reports.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PurchasesReportsService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_BehaviorSubject__ = __webpack_require__("../../../../rxjs/_esm5/BehaviorSubject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_authentication_auth_service__ = __webpack_require__("../../../../../src/app/main/content/pages/authentication/auth.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__shared_app_config__ = __webpack_require__("../../../../../src/app/main/shared/app.config.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__shared_helpers_service__ = __webpack_require__("../../../../../src/app/main/shared/helpers.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__core_services_progress_bar_service__ = __webpack_require__("../../../../../src/app/core/services/progress-bar.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_xlsx__ = __webpack_require__("../../../../xlsx/xlsx.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_xlsx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_xlsx__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var PurchasesReportsService = (function () {
    function PurchasesReportsService(http, authService, router, progressBarService, helpersService) {
        this.http = http;
        this.authService = authService;
        this.router = router;
        this.progressBarService = progressBarService;
        this.helpersService = helpersService;
        this.onePerUsersChanged = new __WEBPACK_IMPORTED_MODULE_3_rxjs_BehaviorSubject__["a" /* BehaviorSubject */]({});
        this.onePerDaysChanged = new __WEBPACK_IMPORTED_MODULE_3_rxjs_BehaviorSubject__["a" /* BehaviorSubject */]({});
        this.totalPerDaysChanged = new __WEBPACK_IMPORTED_MODULE_3_rxjs_BehaviorSubject__["a" /* BehaviorSubject */]({});
    }
    PurchasesReportsService.prototype.resolve = function (route, state) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var resolverType = route.data["resolverType"];
            if (resolverType == "perUser") {
                var today = new Date();
                var tomorrow = new Date(new Date().setDate(today.getDate() + 1));
                Promise.all([
                    _this.getItemsPerUser({ "from": today, "to": tomorrow }),
                ]).then(function () {
                    resolve();
                }, reject);
            }
            else if (resolverType == "perDay") {
                var today = new Date();
                var lastMonth = new Date(new Date().setDate(today.getDate() - 30));
                Promise.all([
                    _this.getItemsPerDay({ "from": lastMonth, "to": today }),
                ]).then(function () {
                    resolve();
                }, reject);
            }
        });
    };
    PurchasesReportsService.prototype.getItemsPerDay = function (filter) {
        var _this = this;
        if (filter === void 0) { filter = {}; }
        return new Promise(function (resolve, reject) {
            var from = new Date(filter['from']);
            from.setHours(0);
            from.setMinutes(0);
            var to = new Date(filter['to']);
            from.setHours(23);
            from.setMinutes(59);
            _this.http
                .get(__WEBPACK_IMPORTED_MODULE_5__shared_app_config__["a" /* AppConfig */].apiUrl +
                "items/getItemsByDay?access_token=" +
                _this.authService.getToken() +
                "&from=" + from +
                "&to=" + to)
                .subscribe(function (response) {
                //console.log('response products', response);
                _this.perDay = response;
                _this.totalPerDay = [];
                var totalObject = {
                    "countBottle": 0,
                    "countCoins": 0,
                    "countExtendChat": 0,
                    "countFilterByCountry": 0,
                    "countFilterByGender": 0,
                    "countGift": 0,
                    "countReply": 0,
                    "totalBottle": 0,
                    "totalCoins": 0,
                    "totalExtendChat": 0,
                    "totalFilterByCountry": 0,
                    "totalFilterByGender": 0,
                    "totalGift": 0,
                    "totalReply": 0,
                    "totalSpentCoins": 0
                };
                for (var index = 0; index < response.length; index++) {
                    var element = response[index];
                    var percentageSpentCoins;
                    var percentageSellCoins;
                    if (response[index + 1]) {
                        var nextElement = response[index + 1];
                        if (nextElement.totalSpentCoins == 0) {
                            percentageSpentCoins = "-";
                        }
                        else {
                            percentageSpentCoins = element.totalSpentCoins / nextElement.totalSpentCoins;
                            percentageSpentCoins--;
                            percentageSpentCoins *= 100;
                            percentageSpentCoins = percentageSpentCoins.toFixed(2);
                        }
                        if (nextElement.totalCoins == 0) {
                            percentageSellCoins = "-";
                        }
                        else {
                            percentageSellCoins = element.totalCoins / nextElement.totalCoins;
                            percentageSellCoins--;
                            percentageSellCoins *= 100;
                            percentageSellCoins = percentageSellCoins.toFixed(2);
                        }
                    }
                    else {
                        percentageSpentCoins = 0;
                        percentageSellCoins = 0;
                    }
                    response[index]['percentageSpentCoins'] = percentageSpentCoins;
                    response[index]['percentageSellCoins'] = percentageSellCoins;
                    totalObject['countBottle'] += element.countBottle;
                    totalObject['countCoins'] += element.countCoins;
                    totalObject['countExtendChat'] += element.countExtendChat;
                    totalObject['countFilterByCountry'] += element.countFilterByCountry;
                    totalObject['countFilterByGender'] += element.countFilterByGender;
                    totalObject['countGift'] += element.countGift;
                    totalObject['countReply'] += element.countReply;
                    totalObject['totalBottle'] += element.totalBottle;
                    totalObject['totalCoins'] += element.totalCoins;
                    totalObject['totalExtendChat'] += element.totalExtendChat;
                    totalObject['totalFilterByCountry'] += element.totalFilterByCountry;
                    totalObject['totalFilterByGender'] += element.totalFilterByGender;
                    totalObject['totalGift'] += element.totalGift;
                    totalObject['totalReply'] += element.totalReply;
                    totalObject['totalSpentCoins'] += element.totalSpentCoins;
                }
                _this.onePerDaysChanged.next(_this.perDay);
                _this.totalPerDay.push(totalObject);
                _this.totalPerDaysChanged.next(_this.totalPerDay);
                resolve(response);
            }, function (error) {
                console.log("error ", error);
                _this.helpersService.showActionSnackbar(null, false, "", { style: "failed-snackbar" }, __WEBPACK_IMPORTED_MODULE_5__shared_app_config__["a" /* AppConfig */].technicalException);
                reject();
            });
        });
    };
    PurchasesReportsService.prototype.getItemsPerUser = function (filter) {
        var _this = this;
        if (filter === void 0) { filter = {}; }
        return new Promise(function (resolve, reject) {
            var from = new Date(filter['from']);
            from.setHours(0);
            from.setMinutes(0);
            var to = new Date(filter['to']);
            to.setHours(23);
            to.setMinutes(59);
            _this.http
                .get(__WEBPACK_IMPORTED_MODULE_5__shared_app_config__["a" /* AppConfig */].apiUrl +
                "items/getUsersCoinsByDay?access_token=" +
                _this.authService.getToken() +
                "&from=" + from +
                "&to=" + to)
                .subscribe(function (response) {
                //console.log('response products', response);
                _this.perUsers = response;
                _this.onePerUsersChanged.next(_this.perUsers);
                resolve(response);
            }, function (error) {
                console.log("error ", error);
                _this.helpersService.showActionSnackbar(null, false, "", { style: "failed-snackbar" }, __WEBPACK_IMPORTED_MODULE_5__shared_app_config__["a" /* AppConfig */].technicalException);
                reject();
            });
        });
    };
    PurchasesReportsService.prototype.getItemsByUser = function (date, ownerId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http
                .get(__WEBPACK_IMPORTED_MODULE_5__shared_app_config__["a" /* AppConfig */].apiUrl +
                "users/" + ownerId + "/getItemsByUser?access_token=" +
                _this.authService.getToken() +
                "&from=" + date.from +
                "&to=" + date.to)
                .subscribe(function (response) {
                //console.log('response products', response);
                resolve(response);
            }, function (error) {
                console.log("error ", error);
                _this.helpersService.showActionSnackbar(null, false, "", { style: "failed-snackbar" }, __WEBPACK_IMPORTED_MODULE_5__shared_app_config__["a" /* AppConfig */].technicalException);
                reject();
            });
        });
    };
    PurchasesReportsService.prototype.export = function (filter) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // send get request
            var from = new Date(filter['from']);
            from.setHours(0);
            from.setMinutes(0);
            var to = new Date(filter['to']);
            to.setHours(23);
            to.setMinutes(59);
            _this.http
                .get(__WEBPACK_IMPORTED_MODULE_5__shared_app_config__["a" /* AppConfig */].apiUrl +
                "items/getUsersItems?" +
                "&from=" + from +
                "&to=" + to +
                "&access_token=" +
                _this.authService.getToken())
                .subscribe(function (items) {
                resolve(items["path"]);
            }, function (error) {
                console.log("error ", error);
                if (error.error.code == __WEBPACK_IMPORTED_MODULE_5__shared_app_config__["a" /* AppConfig */].authErrorCode)
                    _this.router.navigate(["/error-404"]);
                else
                    _this.helpersService.showActionSnackbar(null, false, "", { style: "failed-snackbar" }, __WEBPACK_IMPORTED_MODULE_5__shared_app_config__["a" /* AppConfig */].technicalException);
                reject();
            });
        });
    };
    PurchasesReportsService.prototype.exportAsExcelFile = function (filter) {
        var json = [];
        json[0] = {};
        json[0]['Title'] = "Cost";
        json[0]['Date'] = filter.from.getDate() + "-" + (filter.from.getMonth() + 1) + "-" + filter.from.getFullYear();
        // json[0]['Total Coins'] = this.totalPerDay[0]['totalSpentCoins'];
        // json[0]['Coins'] = "Cost :" + this.totalPerDay[0]['totalCoins'] + "$ , Count :" + this.totalPerDay[0]['countCoins'];
        // json[0]['Bottle'] = "Cost :" + this.totalPerDay[0]['totalBottle'] + " , Count :" + this.totalPerDay[0]['countBottle'];
        // json[0]['Gender'] = "Cost :" + this.totalPerDay[0]['totalFilterByGender'] + " , Count :" + this.totalPerDay[0]['countFilterByGender'];
        // json[0]['Country'] = "Cost :" + this.totalPerDay[0]['totalFilterByCountry'] + " , Count :" + this.totalPerDay[0]['countFilterByCountry'];
        // json[0]['Extend Chat'] = "Cost :" + this.totalPerDay[0]['totalExtendChat'] + " , Count :" + this.totalPerDay[0]['countExtendChat'];
        // json[0]['Reply'] = "Cost :" + this.totalPerDay[0]['totalReply'] + " , Count :" + this.totalPerDay[0]['countReply'];
        // json[0]['Gift'] = "Cost :" + this.totalPerDay[0]['totalGift'] + " , Count :" + this.totalPerDay[0]['countGift'];
        json[0]['Expended Coins'] = this.totalPerDay[0]['totalSpentCoins'];
        json[0]['Coins'] = this.totalPerDay[0]['totalCoins'];
        json[0]['Bottle'] = this.totalPerDay[0]['totalBottle'];
        json[0]['Gender'] = this.totalPerDay[0]['totalFilterByGender'];
        json[0]['Country'] = this.totalPerDay[0]['totalFilterByCountry'];
        json[0]['Extend Chat'] = this.totalPerDay[0]['totalExtendChat'];
        json[0]['Reply'] = this.totalPerDay[0]['totalReply'];
        json[0]['Gift'] = this.totalPerDay[0]['totalGift'];
        json[1] = {};
        json[1]['Date'] = filter.to.getDate() + "-" + (filter.to.getMonth() + 1) + "-" + filter.to.getFullYear();
        json[1]['Title'] = "Count";
        json[1]['Coins'] = this.totalPerDay[0]['countCoins'];
        json[1]['Bottle'] = this.totalPerDay[0]['countBottle'];
        json[1]['Gender'] = this.totalPerDay[0]['countFilterByGender'];
        json[1]['Country'] = this.totalPerDay[0]['countFilterByCountry'];
        json[1]['Extend Chat'] = this.totalPerDay[0]['countExtendChat'];
        json[1]['Reply'] = this.totalPerDay[0]['countReply'];
        json[1]['Gift'] = this.totalPerDay[0]['countGift'];
        console.log("json ", json);
        var excelFileName = "Item_Total_";
        var workbook = __WEBPACK_IMPORTED_MODULE_8_xlsx__["utils"].book_new(); // create a new blank book
        var workSheet = __WEBPACK_IMPORTED_MODULE_8_xlsx__["utils"].json_to_sheet(json);
        __WEBPACK_IMPORTED_MODULE_8_xlsx__["utils"].book_append_sheet(workbook, workSheet, "data");
        __WEBPACK_IMPORTED_MODULE_8_xlsx__["writeFile"](workbook, excelFileName + new Date() + ".xlsx");
    };
    PurchasesReportsService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["a" /* HttpClient */],
            __WEBPACK_IMPORTED_MODULE_4__pages_authentication_auth_service__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_2__angular_router__["d" /* Router */],
            __WEBPACK_IMPORTED_MODULE_7__core_services_progress_bar_service__["a" /* ProgressBarService */],
            __WEBPACK_IMPORTED_MODULE_6__shared_helpers_service__["a" /* HelpersService */]])
    ], PurchasesReportsService);
    return PurchasesReportsService;
}());



/***/ })

});
//# sourceMappingURL=purchases-reports.module.chunk.js.map