import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  templateUrl: 'logModal.html',
  selector: 'log-modal'
})
export class LogModal {

 feeling: number;
 pain: number;
 logoLink: string;
 gettingBetter: boolean;
 themeColor: any;

 constructor(public viewCtrl: ViewController) {
    this.logoLink = window.localStorage.getItem("logoLink") || "./assets/logo.png";
    this.themeColor = window.localStorage.getItem("clinicID") || "primary";
    this.feeling = 5;
    this.pain = 5;
    this.gettingBetter = true;
 }

 close() {
   this.viewCtrl.dismiss();
 }

 submitLog() {
   let data = { 'feeling': this.feeling, 'pain': this.pain, 'gettingBetter': this.gettingBetter };
   this.viewCtrl.dismiss(data);
 }

}