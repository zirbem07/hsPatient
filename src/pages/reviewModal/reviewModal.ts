import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  templateUrl: 'reviewModal.html',
  selector: 'ReviewModal'
})
export class ReviewModal {

 review: string;
 themeColor: any;
 logoLink: any;
 rate: any;

 constructor(public viewCtrl: ViewController) {
    this.logoLink = window.localStorage.getItem("logoLink") || "./assets/logo.png";
    this.themeColor = window.localStorage.getItem("clinicID") || "primary";
 }

 close() {
   this.viewCtrl.dismiss();
 }

 submitReview() {
   let data = { 'message': this.review, 'rating': this.rate };
   this.viewCtrl.dismiss(data);
 }

}