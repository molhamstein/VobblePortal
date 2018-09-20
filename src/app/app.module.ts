import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpModule } from "@angular/http";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import "hammerjs";
import { SharedModule } from "./core/modules/shared.module";
import { AppComponent } from "./app.component";

import { FuseMainModule } from "./main/main.module";
import { PagesModule } from "./main/content/pages/pages.module";
import { FuseSplashScreenService } from "./core/services/splash-screen.service";
import { FuseConfigService } from "./core/services/config.service";
import { FuseNavigationService } from "./core/components/navigation/navigation.service";

import { MarkdownModule } from "angular2-markdown";
import { TranslateModule } from "@ngx-translate/core";
import { UsersModule } from "./main/content/apps/users/users.module";
import { AuthService } from "./main/content/pages/authentication/auth.service";
import { AnonymousGuardService } from "./main/content/pages/authentication/anonymous-guard.service";
import { AuthGuardService } from "./main/content/pages/authentication/auth-guard.service";
import { HelpersService } from "./main/shared/helpers.service";
import { BottlesModule } from "./main/content/apps/bottles/bottles.module";
import { ItemsModule } from "./main/content/apps/items/items.module";
import { ShoresModule } from "./main/content/apps/shores/shores.module";
import { UploadFileService } from "./main/shared/upload-file.service";
import { ProductsModule } from "./main/content/apps/products/products.module";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { ProgressBarService } from "./core/services/progress-bar.service";
import { ReportsModule } from "./main/content/apps/reports/reports.module";
import { ReportTypesModule } from "./main/content/apps/report-types/report-types.module";
import { TypeGoodsModule } from "./main/content/apps/type-goods/type-goods.module";
import { DashboardModule } from "./main/content/apps/dashboard/dashboard.module";

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
    path: "reports",
    loadChildren: "./main/content/apps/reports/reports.module#ReportsModule",
    canLoad: [AuthGuardService]
  },
  {
    path: "dashboard",
    loadChildren:
      "./main/content/apps/dashboard/dashboard.module#DashboardModule",
    canLoad: [AuthGuardService]
  },
  {
    path: "auth",
    loadChildren: "./main/content/pages/pages.module#PagesModule",
    canLoad: [AnonymousGuardService]
  },
  /*  {
    path: '**',
    redirectTo: 'users'
  },*/
  {
    path: "",
    pathMatch: "full",
    redirectTo: "users/list"
  }
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes, { useHash: false }),
    SharedModule,
    MarkdownModule.forRoot(),
    TranslateModule.forRoot(),

    FuseMainModule,

    UsersModule,
    BottlesModule,
    ShoresModule,
    ItemsModule,
    ProductsModule,
    ReportsModule,
    ReportTypesModule,
    TypeGoodsModule,
    DashboardModule,

    PagesModule
  ],
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
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
