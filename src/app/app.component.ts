import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

// import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login'
import { EnterAccessCodePage } from '../pages/enterAccessCode/enterAccessCode';
import { SessionService } from '../services/sessionService';
import { ExerciseService } from '../services/exerciseService';
import { PasswordLoginPage } from '../pages/passwordLogin/passwordLogin';



@Component({
  templateUrl: 'app.html',
  providers: [SessionService, ExerciseService]
})

export class MyApp {
  rootPage

  constructor(public platform: Platform) {
    platform.ready().then(() => {
      if(window.localStorage.getItem("email") && !window.localStorage.getItem("activated")){
        this.rootPage = PasswordLoginPage;
      }
      else if(window.localStorage.getItem("activated")){
         this.rootPage = LoginPage;
      } else {
        this.rootPage = EnterAccessCodePage;
      }
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}
