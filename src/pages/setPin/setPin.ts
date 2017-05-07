import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NavController, NavParams } from 'ionic-angular';
import { Dialogs } from 'ionic-native';
import { SessionService } from '../../services/sessionService';
import { LoginPage } from '../login/login';


@Component({
  templateUrl: 'setPin.html',
})


export class SetPinPage {
  setPinForm: FormGroup;
  emailFromCode: String; 
  pin: any[];
  @ViewChild('input') pin1;
  @ViewChild('input2') pin2;
  @ViewChild('input3') pin3 ;
  @ViewChild('input4') pin4;
     

  constructor(public navCtrl: NavController, fb: FormBuilder, params: NavParams, private session: SessionService) {
    this.setPinForm = fb.group({
      pin: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(4)])],
      confirmPin: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(4)])],
    });

    this.emailFromCode = params.data.Email

    console.log(params)
  }

  ionViewDidLoad(){
    this.pin = [
      this.pin1, this.pin2, this.pin3, this.pin4
    ]
  }


//healthconnection.io/hcPassword/php/resetPassword.php
 setPin(){  
      let finalPin = this.pin1._value + this.pin2._value +  this.pin3._value +  this.pin4._value;
      this.session.verifyUser(this.emailFromCode)
      .then(data => {
          console.log(data.json())
          this.session.setPin(data.json().data.documents[data.json().data.documents.length - 1].user_id, finalPin)
            .then(data => {
              window.localStorage.setItem("activated", "true")
              this.navCtrl.setRoot(LoginPage)
          });
      });
    
  }

  showDialog(){
      Dialogs.confirm("An email has been sent. Please follow the link to reset your passowrd.", "Password Reset", ["Ok"])
        .then((response) => {
          this.navCtrl.pop();
       })
  }

  nextInput(ev, index){
    if(ev.key === "Backspace") {
      if(this.pin[index - 2]){
        this.pin[index - 2]._value = "";
        this.pin[index - 2].setFocus();
      }
    } else {
      if(this.pin[index]){
        this.pin[index].setFocus();
      }
    } 
  }
}