import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FuseNavigationModule } from '../core/components/navigation/navigation.module';
import { FuseThemeOptionsComponent } from '../core/components/theme-options/theme-options.component';
import { SharedModule } from '../core/modules/shared.module';
import { FuseContentComponent } from './content/content.component';
import { FuseFooterComponent } from './footer/footer.component';
import { FuseMainComponent } from './main.component';
import { FuseNavbarHorizontalComponent } from './navbar/horizontal/navbar-horizontal.component';
import { FuseNavbarVerticalToggleDirective } from './navbar/vertical/navbar-vertical-toggle.directive';
import { FuseNavbarVerticalComponent } from './navbar/vertical/navbar-vertical.component';
import { FuseQuickPanelComponent } from './quick-panel/quick-panel.component';
import { FuseToolbarComponent } from './toolbar/toolbar.component';



@NgModule({
  declarations: [
    FuseContentComponent,
    FuseFooterComponent,
    FuseMainComponent,
    FuseNavbarVerticalComponent,
    FuseNavbarHorizontalComponent,
    FuseToolbarComponent,
    FuseNavbarVerticalToggleDirective,
    FuseThemeOptionsComponent,
    FuseQuickPanelComponent,
  ],
  imports: [
    SharedModule,
    RouterModule,
    FuseNavigationModule,
  ],
  exports: [
    FuseMainComponent, FuseContentComponent
  ]

})

export class FuseMainModule {
}


  //  FuseShortcutsModule,
  //  FuseSearchBarModule