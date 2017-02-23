import { Component } from '@angular/core';

import { NavController, AlertController, ModalController } from 'ionic-angular';
import { SessionService } from '../../services/sessionService';
import { ExerciseService } from '../../services/exerciseService';

import { SettingsPage } from '../settings/settings'
import { ExercisePage } from '../exercise/exercise'
import { LogModal } from '../logModal/logModal'
import { AnalyticsPage } from '../analytics/analytics' 
import 'datejs'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  DateJs: IDateJSStatic = <any>Date;
  remainingExercise: number;
  nextApt: string; 
  patient: any;
  today: any;
  constructor(public navCtrl: NavController, private session: SessionService, private exercise: ExerciseService, private alertCtrl: AlertController, public modalCtrl: ModalController) {
    this.nextApt =  window.localStorage.getItem("nextApt") || "Wednesday, Mar 1st"
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

  presentLogModal() {
   let logModal = this.modalCtrl.create(LogModal);
   logModal.present();
  }

  toAnalytics() {
    this.navCtrl.push(AnalyticsPage);
  }

  updateAptTime() {
    let alert = this.alertCtrl.create({
      title: 'Appointment Time',
      inputs: [
        {
          name: 'date',
          placeholder: 'Date',
          type: 'datetime-local',
          value: Date.now().toString(),
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
               this.nextApt = this.DateJs.parse(data.date).toString('dddd, MMM dS');
               window.localStorage.setItem("nextApt", this.nextApt)
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
