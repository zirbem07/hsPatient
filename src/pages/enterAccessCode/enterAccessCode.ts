import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NavController, ModalController, NavParams } from 'ionic-angular';
import { Dialogs } from 'ionic-native';
import { SessionService } from '../../services/sessionService';
import { SetPinPage } from '../setPin/setPin';
import { PasswordLoginPage } from '../passwordLogin/passwordLogin';
import { LoginPage } from '../login/login';
import { ForgotPasswordPage } from '../forgotPassword/forgotPassword';


@Component({
  templateUrl: 'enterAccessCode.html',
})


export class EnterAccessCodePage {
  accessCodeForm: FormGroup; 
     

  constructor(public navCtrl: NavController, fb: FormBuilder, params: NavParams, public modalCtrl: ModalController, private session: SessionService) {
    this.accessCodeForm = fb.group({
      code: ["", Validators.required]
    });
  }


 verifyCode(){  
     if(this.accessCodeForm.controls["code"]){
         this.session.verifyCode(this.accessCodeForm.controls["code"].value)
        .then(data => {
            console.log(data.json())
            data = data.json();
            if(data[0]){
              this.navCtrl.push(SetPinPage, {Email: data[0].Email})
            }
            else{
              //show error dialog
            }
        });
     }
  }

  toPasswordLogin(){
    let passwordLoginModal = this.modalCtrl.create(PasswordLoginPage);
    passwordLoginModal.onDidDismiss(data => {
      if(data){
        this.navCtrl.push(SetPinPage, {Email: data})
      }
    });
    passwordLoginModal.present();
  }

  newAccessCode(){
    this.navCtrl.push(ForgotPasswordPage)
  }

  toLogin(){
    window.localStorage.setItem("activated", "true")
    this.navCtrl.setRoot(LoginPage)
  }

  showDialog(){
      Dialogs.confirm("An email has been sent. Please follow the link to reset your passowrd.", "Password Reset", ["Ok"])
        .then((response) => {
          this.navCtrl.pop();
       })
  }
}