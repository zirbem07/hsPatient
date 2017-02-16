import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  templateUrl: 'privacyPolicy.html',
})
export class PrivacyPolicy {

 constructor(public viewCtrl: ViewController) {

 }

 close() {
   this.viewCtrl.dismiss();
 }

}