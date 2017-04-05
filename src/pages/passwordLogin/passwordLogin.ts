import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NavController, ModalController, NavParams } from 'ionic-angular';
import { Dialogs } from 'ionic-native';
import { SessionService } from '../../services/sessionService';
import { SetPinPage } from '../setPin/setPin';
import { LoginPage } from '../login/login';

@Component({
  templateUrl: 'passwordLogin.html',
  providers: [SessionService]
})

export class PasswordLoginPage {
  loginForm: FormGroup; 
  email: String;

 constructor(public navCtrl: NavController, fb: FormBuilder, params: NavParams, public modalCtrl: ModalController, private session: SessionService) {
   this.email = window.localStorage.getItem("username") || "";
    
    this.loginForm = fb.group({
      email: [this.email, Validators.required],
      password: ["", Validators.required]
    });
 }

 toLogin(){
   window.localStorage.setItem("activated", "true")
   this.navCtrl.setRoot(LoginPage)
 }

  login(event) {

    if(this.loginForm.controls["email"] && this.loginForm.controls["password"]){
        this.session.login(this.loginForm.controls["email"].value, this.loginForm.controls["password"].value)
        .then(user => {
            this.navCtrl.push(SetPinPage, {Email: this.loginForm.controls["email"].value})
        })
    } 
  }

}