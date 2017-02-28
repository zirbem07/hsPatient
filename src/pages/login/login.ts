import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NavController } from 'ionic-angular';
import { SessionService } from '../../services/sessionService';

import { HomePage } from '../home/home';
import { ForgotPasswordPage } from '../forgotPassword/forgotPassword'
import { Push, PushToken } from '@ionic/cloud-angular';


@Component({
  templateUrl: 'login.html',
})


export class LoginPage {
  loginForm: FormGroup; 
     

  constructor(public navCtrl: NavController, fb: FormBuilder, private session: SessionService, public push: Push) {
    this.loginForm = fb.group({
      email: ["", Validators.required],
      password: ["", Validators.required]
    });
  }



  login(event) {

    if(this.loginForm.controls["email"] && this.loginForm.controls["password"]){
        this.session.login(this.loginForm.controls["email"].value, this.loginForm.controls["password"].value)
        .then(user => {
            this.session.getUserInfo(this.session.patient.id, this.session.patient.access_token)
            .then(data => {
                var patient = this.session.patient
                this.session.getUserAttributes(patient.access_token, patient.AccountType, patient.user_id)
                .then(attr =>  {
                  this.push.register().then((t: PushToken) => {
                    return this.push.saveToken(t, 'ignore_user');
                  }).then((t: PushToken) => {
                    if(t.token){
                      this.session.saveDeviceToken(this.session.patient.access_token, this.session.patient.AccountType, this.session.patient.attributes.document_id, t.token)
                      .then(data => this.navCtrl.setRoot(HomePage))
                    } else {
                      this.navCtrl.setRoot(HomePage)
                    }
                  });                  
                })
            })
        });

    } 
  }

  forgotPassword() {
    this.navCtrl.push(ForgotPasswordPage)
  }

}