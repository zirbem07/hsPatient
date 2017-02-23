import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { SettingsPage } from '../pages/settings/settings';
import { ExercisePage } from '../pages/exercise/exercise';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { LogModal } from '../pages/logModal/logModal';
import { AnalyticsPage } from '../pages/analytics/analytics';
import { FusionChartsComponent } from 'angular2-fusioncharts';

@NgModule({
  declarations: [
    MyApp,
    SettingsPage,
    ExercisePage,
    HomePage,
    TabsPage,
    LoginPage,
    LogModal,
    AnalyticsPage,
    FusionChartsComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SettingsPage,
    ExercisePage,
    HomePage,
    TabsPage,
    LoginPage,
    LogModal,
    AnalyticsPage,
    FusionChartsComponent
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
