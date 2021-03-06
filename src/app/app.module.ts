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
import { PrivacyPolicy } from '../pages/privacyPolicy/privacyPolicy';
import { FusionChartsComponent } from 'angular2-fusioncharts';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { ForgotPasswordPage } from '../pages/forgotPassword/forgotPassword';
import { TimerComponent } from '../pages/timer/timer';
import { SetPinPage } from '../pages/setPin/setPin';
import { EnterAccessCodePage } from '../pages/enterAccessCode/enterAccessCode';
import { PasswordLoginPage } from '../pages/passwordLogin/passwordLogin';
import { Chat } from '../pages/chat/chat';
import { ReviewModal } from '../pages/reviewModal/reviewModal';
import { Ionic2RatingModule } from 'ionic2-rating';
import { SessionService } from '../services/sessionService';

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '9ec1b6bf'
  },
  'push': {
    'sender_id': '383934093345',
    'pluginConfig': {
      'ios': {
        'badge': false,
        'sound': true,
        "clearBadge": true
      },
      'android': {
        'iconColor': '#343434'
      }
    }
  }

};

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
    FusionChartsComponent,
    PrivacyPolicy,
    ForgotPasswordPage,
    TimerComponent,
    SetPinPage,
    EnterAccessCodePage,
    PasswordLoginPage,
    Chat,
    ReviewModal
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings),
    Ionic2RatingModule
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
    FusionChartsComponent,
    PrivacyPolicy,
    ForgotPasswordPage,
    TimerComponent,
    SetPinPage,
    EnterAccessCodePage,
    PasswordLoginPage,
    Chat,
    ReviewModal
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, SessionService]
})
export class AppModule {}
