import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NavController, NavParams } from 'ionic-angular';
import { Dialogs } from 'ionic-native';
import { SessionService } from '../../services/sessionService';
import { EnterAccessCodePage } from '../enterAccessCode/enterAccessCode';


@Component({
  templateUrl: 'forgotPassword.html',
})


export class ForgotPasswordPage {
  forgotForm: FormGroup; 
  type: any = 'forgotPassword';
     

  constructor(private navParams: NavParams, public navCtrl: NavController, fb: FormBuilder, private session: SessionService) {
    this.forgotForm = fb.group({
      email: ["", Validators.required]
    });

    if(navParams.get('type')){
      this.type = 'getActivationCode';
    }
  }

  toAccessCode(){
    this.navCtrl.push(EnterAccessCodePage)
  }

 forgotPassword(){  
     if(this.forgotForm.controls["email"]){
        this.session.verifyUser(this.forgotForm.controls["email"].value)
        .then(data => {
          if(data.json().data.documents[0]){
           this.session[this.type](this.forgotForm.controls["email"].value)
            .then(data => {
                this.showDialog("An email has been sent. Please follow the link to reset your passowrd.", true)
            });
          } else {
              this.showDialog("No account associated with this email.", false);
          }
        })
        
     }
  }

  showDialog(message, exit){
      Dialogs.confirm(message, "Password Reset", ["Ok"])
        .then((response) => {
          if(exit){this.navCtrl.pop();}
       })
  }
}