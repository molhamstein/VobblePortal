import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { HttpModule } from '@angular/http';
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { MarkdownModule } from 'angular2-markdown';
import "hammerjs";
import { MAT_DATE_LOCALE } from "../../node_modules/@angular/material";
import { AppComponent } from "./app.component";
import { FuseNavigationService } from "./core/components/navigation/navigation.service";
import { SharedModule } from "./core/modules/shared.module";
import { FuseConfigService } from "./core/services/config.service";
import { ProgressBarService } from "./core/services/progress-bar.service";
import { FuseSplashScreenService } from "./core/services/splash-screen.service";
import { AgenciesModule } from './main/content/apps/agencies/agencies.module';
import { BlockModule } from './main/content/apps/block/block.module';
import { BottlesModule } from './main/content/apps/bottles/bottles.module';
import { CallsModule } from './main/content/apps/calls/calls.module';
import { DashboardModule } from './main/content/apps/dashboard/dashboard.module';
import { ExtendMessageModule } from './main/content/apps/extend-message/extend-message.module';
import { GiftItemModule } from './main/content/apps/gift-items/gift-items.module';
import { HostsModule } from './main/content/apps/hosts/hosts.module';
import { ItemsModule } from './main/content/apps/items/items.module';
import { ProductsModule } from './main/content/apps/products/products.module';
import { ReportTypesModule } from './main/content/apps/report-types/report-types.module';
import { ReportsModule } from './main/content/apps/reports/reports.module';
import { ShoresModule } from './main/content/apps/shores/shores.module';
import { TestBottlesModule } from './main/content/apps/test bottles/test-bottles.module';
import { TopicsModule } from './main/content/apps/topics/topics.module';
import { TypeGoodsModule } from './main/content/apps/type-goods/type-goods.module';
import { UsersModule } from './main/content/apps/users/users.module';
import { AnonymousGuardService } from "./main/content/pages/authentication/anonymous-guard.service";
import { AuthGuardService } from "./main/content/pages/authentication/auth-guard.service";
import { AuthService } from "./main/content/pages/authentication/auth.service";
import { PagesModule } from './main/content/pages/pages.module';
import { FilterComponent } from './main/dialog/filter/filter.component';
import { FuseMainModule } from "./main/main.module";
import { HelpersService } from "./main/shared/helpers.service";
import { UploadFileService } from "./main/shared/upload-file.service";




const appRoutes: Routes = [
  {
    path: "users",
    loadChildren: "./main/content/apps/users/users.module#UsersModule",
    canLoad: [AuthGuardService]
  },
  {
    path: "bottles",
    loadChildren: "./main/content/apps/bottles/bottles.module#BottlesModule",
    canLoad: [AuthGuardService]
  },
  {
    path: "testBottles",
    loadChildren: "./main/content/apps/test bottles/test-bottles.module#TestBottlesModule",
    canLoad: [AuthGuardService]
  },
  {
    path: "shores",
    loadChildren: "./main/content/apps/shores/shores.module#ShoresModule",
    canLoad: [AuthGuardService]
  },
  {
    path: "items",
    loadChildren: "./main/content/apps/items/items.module#ItemsModule",
    canLoad: [AuthGuardService]
  },
  {
    path: "products",
    loadChildren: "./main/content/apps/products/products.module#ProductsModule",
    canLoad: [AuthGuardService]
  },
  {
    path: "chat-base-products",
    loadChildren: "./main/content/apps/chat-base-products/chat-base-products.module#ChatBaseProductsModule",
    canLoad: [AuthGuardService]
  },
  {
    path: "calls",
    loadChildren: "./main/content/apps/calls/calls.module#CallsModule",
    canLoad: [AuthGuardService]
  },
  {
    path: "hosts",
    loadChildren: "./main/content/apps/hosts/hosts.module#HostsModule",
    canLoad: [AuthGuardService]
  },
  {
    path: "agency",
    loadChildren: "./main/content/apps/agencies/agencies.module#AgenciesModule",
    canLoad: [AuthGuardService]
  },
  {
    path: "topics",
    loadChildren: "./main/content/apps/topics/topics.module#TopicsModule",
    canLoad: [AuthGuardService]
  },
  {
    path: "reports",
    loadChildren: "./main/content/apps/reports/reports.module#ReportsModule",
    canLoad: [AuthGuardService]
  },
  {
    path: "block",
    loadChildren: "./main/content/apps/block/block.module#BlockModule",
    canLoad: [AuthGuardService]
  },
  {
    path: "purchasesReports",
    loadChildren: "./main/content/apps/purchases-reports/purchases-reports.module#PurchasesReportsModule",
    canLoad: [AuthGuardService]
  },
  {
    path: "dashboard",
    loadChildren:
      "./main/content/apps/dashboard/dashboard.module#DashboardModule",
    canLoad: [AuthGuardService]
  },
  {
    path: "extend-message",
    loadChildren:
      "./main/content/apps/extend-message/extend-message.module#ExtendMessageModule",
    canLoad: [AuthGuardService]
  },
  {
    path: "gift-items",
    loadChildren:
      "./main/content/apps/gift-items/gift-items.module#GiftItemModule",
    canLoad: [AuthGuardService]
  },
  {
    path: "auth",
    loadChildren: "./main/content/pages/pages.module#PagesModule",
    canLoad: [AnonymousGuardService]
  },
  {
    path: "",
    pathMatch: "full",
    redirectTo: "users/list"
  }
];

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes, { useHash: false }),
    SharedModule,
    TranslateModule.forRoot(),

    HttpModule,
    MarkdownModule.forRoot(),

    FuseMainModule,

    UsersModule,
    BottlesModule,
    TestBottlesModule,
    ShoresModule,
    ItemsModule,
    ProductsModule,
    TopicsModule,
    ReportsModule,
    BlockModule,
    ReportTypesModule,
    TypeGoodsModule,
    DashboardModule,
    ExtendMessageModule,
    GiftItemModule,
    PagesModule,
    AgenciesModule,
    CallsModule,
    HostsModule,
  ],

  entryComponents: [FilterComponent],
  providers: [
    FuseSplashScreenService,
    FuseConfigService,
    FuseNavigationService,
    AuthService,
    AnonymousGuardService,
    AuthGuardService,
    HelpersService,
    UploadFileService,
    ProgressBarService,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" }
  ],
  declarations: [AppComponent, FilterComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }



