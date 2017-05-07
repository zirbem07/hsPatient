import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

// import { TabsPage } from '../pages/tabs/tabs';
import { EnterAccessCodePage } from '../pages/enterAccessCode/enterAccessCode';
import { SessionService } from '../services/sessionService';
import { ExerciseService } from '../services/exerciseService';


@Component({
  templateUrl: 'app.html',
  providers: [SessionService, ExerciseService]
})

export class MyApp {
  rootPage = EnterAccessCodePage;

  constructor(public platform: Platform) {
    platform.ready().then(() => {

      
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}
