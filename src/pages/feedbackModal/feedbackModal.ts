import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  templateUrl: 'feedbackModal.html',
  selector: 'FeedbackModal'
})
export class FeedbackModal {

 message: string;
 themeColor: any;
 logoLink: any;

 constructor(public viewCtrl: ViewController) {
    this.logoLink = window.localStorage.getItem("logoLink") || "./assets/logo.png";
    this.themeColor = window.localStorage.getItem("clinicID") || "primary";
 }

 close() {
   this.viewCtrl.dismiss();
 }

 submitFeedback(message) {
   let data = { 'message': this.message };
   this.viewCtrl.dismiss(data);
 }

}