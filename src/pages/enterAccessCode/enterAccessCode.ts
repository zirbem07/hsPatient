import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NavController, ModalController, NavParams, ToastController } from 'ionic-angular';
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
  @ViewChild('input') code1;
  @ViewChild('input2') code2;
  @ViewChild('input3') code3 ;
  @ViewChild('input4') code4;
  @ViewChild('input5') code5;
  @ViewChild('input6') code6 ;
  activationCode: any[];
  accessCodeForm: FormGroup; 
     

  constructor(public navCtrl: NavController, fb: FormBuilder, params: NavParams, public modalCtrl: ModalController, private session: SessionService, private toastCtrl: ToastController) {
    this.accessCodeForm = fb.group({
      code: ["", Validators.required]
    });
    
  }
  ionViewDidLoad(){
    this.activationCode = [
      this.code1, this.code2, this.code3,
      this.code4, this.code5, this.code6
      ]
  }

 verifyCode(){  
      let code = this.code1._value + this.code2._value + this.code3._value + this.code4._value + this.code5._value + this.code6._value 
     if(code.length === 6){
        this.session.verifyCode(code)
        .then(data => {
            data = data.json();
            if(data[0]){
              this.navCtrl.push(SetPinPage, {Email: data[0].Email})
            }
            else{
              this.presentToast()
              this.code1.setFocus();
              this.code1._value = "";
              this.code2._value = "";
              this.code3._value = "";
              this.code4._value = "";
              this.code5._value = "";
              this.code6._value = "";
              
            }
        });
     }
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Invalid Activation Code',
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
    });

    toast.present();
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

  nextInput(ev, index){

    if(ev.key === "Backspace") {
      if(this.activationCode[index - 2]){
        this.activationCode[index - 2]._value = "";
        this.activationCode[index - 2].setFocus();
      }
    } else {
      if(this.activationCode[index]){
        this.activationCode[index].setFocus();
      }
    } 
  }
}