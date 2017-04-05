import { Component } from '@angular/core';
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
     

  constructor(public navCtrl: NavController, fb: FormBuilder, params: NavParams, private session: SessionService) {
    this.setPinForm = fb.group({
      pin: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(4)])],
      confirmPin: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(4)])],
    });

    this.emailFromCode = params.data.Email

    console.log(params)
  }


//healthconnection.io/hcPassword/php/resetPassword.php
 setPin(){  
   console.log('setpin')
     if(this.setPinForm.controls["pin"].value == this.setPinForm.controls["confirmPin"].value){
       this.session.verifyUser(this.emailFromCode)
        .then(data => {
            console.log(data)
            console.log(data.json().data.documents[0].user_id)
            this.session.setPin(data.json().data.documents[0].user_id, this.setPinForm.controls["pin"].value)
              .then(data => {
              console.log(data)
              window.localStorage.setItem("activated", "true")
              this.navCtrl.setRoot(LoginPage)
            });
        });
     }
     else{
       console.log('nope')
     }
  }

  showDialog(){
      Dialogs.confirm("An email has been sent. Please follow the link to reset your passowrd.", "Password Reset", ["Ok"])
        .then((response) => {
          this.navCtrl.pop();
       })
  }
}