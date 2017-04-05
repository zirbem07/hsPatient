import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NavController } from 'ionic-angular';
import { Dialogs } from 'ionic-native';
import { SessionService } from '../../services/sessionService';
import { EnterAccessCodePage } from '../enterAccessCode/enterAccessCode';


@Component({
  templateUrl: 'forgotPassword.html',
})


export class ForgotPasswordPage {
  forgotForm: FormGroup; 
     

  constructor(public navCtrl: NavController, fb: FormBuilder, private session: SessionService) {
    this.forgotForm = fb.group({
      email: ["", Validators.required]
    });
  }

  toAccessCode(){
    this.navCtrl.push(EnterAccessCodePage)
  }

 forgotPassword(){  
     if(this.forgotForm.controls["email"]){
         this.session.forgotPassword(this.forgotForm.controls["email"].value)
        .then(data => {
            this.showDialog()
        });
     }
  }

  showDialog(){
      Dialogs.confirm("An email has been sent. Please follow the link to reset your passowrd.", "Password Reset", ["Ok"])
        .then((response) => {
          this.navCtrl.pop();
       })
  }
}