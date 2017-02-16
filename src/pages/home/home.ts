import { Component } from '@angular/core';

import { NavController, AlertController } from 'ionic-angular';
import { SessionService } from '../../services/sessionService';
import { ExerciseService } from '../../services/exerciseService';

import { SettingsPage } from '../settings/settings'
import { ExercisePage } from '../exercise/exercise'
import 'datejs'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  DateJs: IDateJSStatic = <any>Date;
  remainingExercise: number;
  patient: any;
  today: any;
  constructor(public navCtrl: NavController, private session: SessionService, private exercise: ExerciseService, private alertCtrl: AlertController) {
    this.patient = this.session.patient;
    this.today = this.DateJs.today().toString('M-dd-yyyy');
    this.getPatientLog()  
  
  }

  ionViewDidEnter() {
    var temp = this.session.patient.patientLog[this.today]
    this.remainingExercise = temp.assigned - temp.completed;
  }

  getPatientLog() {
    
    this.session.getPatientLog(this.patient.access_token, this.patient.AccountType, this.patient.attributes.PatientLogID)
    .then(data => {
      this.session.patient.patientLog = JSON.parse(atob(data._body))
      var today = JSON.parse(atob(data._body))[this.today]
      this.remainingExercise = (today.assigned - today.completed)
    });

  }

  completeAll() {
     this.session.patient.patientLog[this.today].completed = this.patient.patientLog[this.today].assigned;
     for (let exercise of this.session.patient.patientLog[this.today].exercises) {
       exercise.completed = true;
       exercise.status = 1;
     }
     this.session.updatePatientLog(this.patient.access_token, this.patient.AccountType, this.patient.attributes.PatientLogID)
     .then(data => {
       this.remainingExercise = 0;
     });
    
  }

  getAssignedExercises() {
    if(!this.exercise.exercises[0]){
      this.exercise.getAssignedExercises(this.patient.access_token, this.patient.AccountType, this.patient.user_id)
      .then(exercises => {
        this.navCtrl.push(ExercisePage);
      })
    } else {
      this.navCtrl.push(ExercisePage);
    }
  }

  updateAptTime() {
    let alert = this.alertCtrl.create({
      title: 'Appointment Time',
      inputs: [
        {
          name: 'date',
          placeholder: 'Date',
          type: 'datetime-local',
          value: '2017-02-09T17:03:44.457'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Update',
          handler: data => {
            if (data.date) {
              console.log(data.date);
              // logged in!
            } else {
              // invalid login
              return false;
            }
          }
        }
      ]
    });
    alert.present();
  }

  toSettings() {
    this.navCtrl.push(SettingsPage);
  }



}
