import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NavController } from 'ionic-angular';
import { SessionService } from '../../services/sessionService';

import { HomePage } from '../home/home';
import { ForgotPasswordPage } from '../forgotPassword/forgotPassword';
import { EnterAccessCodePage } from '../enterAccessCode/enterAccessCode';
import { PasswordLoginPage } from '../passwordLogin/passwordLogin';


@Component({
  templateUrl: 'login.html',
})


export class LoginPage {
  loginForm: FormGroup; 
  email: string;
  pin: any[];
  @ViewChild('input')  pin1;
  @ViewChild('input2') pin2;
  @ViewChild('input3') pin3 ;
  @ViewChild('input4') pin4;
     

  constructor(public navCtrl: NavController, fb: FormBuilder, private session: SessionService) {
    this.email = window.localStorage.getItem("username") || "";
    
    this.loginForm = fb.group({
      email: [this.email, Validators.required],
      password: ["1234", Validators.required]
    });
  }

  ngOnInit() {

      var firstTimeCheck = localStorage.getItem('activated')
      if(firstTimeCheck != 'true' && this.email == ""){
         //access code
        this.navCtrl.push(EnterAccessCodePage)
        //have a Dont have an access code? click here to get it and this will mimic forgot password
        //have I set my pin already button
      }
      else if(firstTimeCheck != 'true' && this.email != ""){
        this.navCtrl.push(PasswordLoginPage)
        //password login -> set pin
        //have I set my password to a pin already button
      }
      else{
        //pin login
       
      }
    }

  ionViewDidLoad(){
    this.pin = [
      this.pin1, this.pin2, this.pin3, this.pin4
    ]
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


  nextInput(ev, index){
    if(ev.key === "Backspace") {
      if(this.pin[index - 2]){
        this.pin[index - 2]._value = "";
        this.pin[index - 1 ]._type = "tel";
        this.pin[index - 2 ]._type = "tel";
        this.pin[index - 2].setFocus();
      }
    } else {
      if(this.pin[index]){
        this.pin[index -1 ]._type = "password";
        this.pin[index].setFocus();
      }
    } 
  }

  forgotPassword() {
    this.navCtrl.push(ForgotPasswordPage)
  }

}