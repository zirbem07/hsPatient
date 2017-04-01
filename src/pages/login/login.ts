import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NavController } from 'ionic-angular';
import { SessionService } from '../../services/sessionService';

import { HomePage } from '../home/home';
import { ForgotPasswordPage } from '../forgotPassword/forgotPassword'


@Component({
  templateUrl: 'login.html',
})


export class LoginPage {
  loginForm: FormGroup; 
  email: string;
     

  constructor(public navCtrl: NavController, fb: FormBuilder, private session: SessionService) {
    this.email = window.localStorage.getItem("username") || "";
    
    this.loginForm = fb.group({
      email: [this.email, Validators.required],
      password: ["", Validators.required]
    });
  }



  login(event) {

    if(this.loginForm.controls["email"] && this.loginForm.controls["password"]){
        this.session.login(this.loginForm.controls["email"].value, this.loginForm.controls["password"].value)
        .then(user => {
            window.localStorage.setItem("username", this.loginForm.controls["email"].value)
            this.session.getUserInfo(this.session.patient.id, this.session.patient.access_token)
            .then(data => {
                var patient = this.session.patient
                this.session.getUserAttributes(patient.access_token, patient.AccountType, patient.user_id)
                .then(attr =>  {
                  this.navCtrl.setRoot(HomePage)
                                  
                })
            })
        })
    } 
  }

  forgotPassword() {
    this.navCtrl.push(ForgotPasswordPage)
  }

}