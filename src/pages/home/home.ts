import { Component } from '@angular/core';

import { NavController, AlertController, ModalController } from 'ionic-angular';
import { Push, PushToken } from '@ionic/cloud-angular';
import { SessionService } from '../../services/sessionService';
import { ExerciseService } from '../../services/exerciseService';

import { SettingsPage } from '../settings/settings'
import { ExercisePage } from '../exercise/exercise'
import { LogModal } from '../logModal/logModal'
import { Chat } from '../chat/chat'
import { AnalyticsPage } from '../analytics/analytics' 
import { ReviewModal } from '../reviewModal/reviewModal'
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
  lastCompleted: any;
  streak: any;
  unseenMessages: any;
  logCompleted: boolean;
  themeColor: any;
  reviewed: any;

  constructor(public navCtrl: NavController, private session: SessionService, private exercise: ExerciseService, private alertCtrl: AlertController, public modalCtrl: ModalController, public push: Push) {
    
    this.reviewed = window.localStorage.getItem("reviewed") || false;
    this.nextApt =  window.localStorage.getItem("nextApt") || "Not Set"
    this.themeColor = window.localStorage.getItem("clinicID") || "primary";
    this.patient = this.session.patient; 
    this.unseenMessages = this.patient.attributes.MessagesForPatient || 0;

    this.today = this.DateJs.today().toString('M-dd-yyyy');
    this.lastCompleted = "";
    this.getPatientLog()
    this.updateActivity()
    this.getDeviceToken()
    if(this.streak == 2 && this.reviewed == false){
      this.presentReviewModal()
    }
  }

  ionViewDidEnter() {
    var temp = this.session.patient.patientLog[this.today]
    this.remainingExercise = temp.assigned - temp.completed;
    if(this.session.lastCompleted){
      if(Date.parse(this.session.lastCompleted).compareTo(Date.parse(this.lastCompleted)) == 1){
        this.lastCompleted = this.session.lastCompleted;
      }
    }
  }

  getPatientLog() {
    
    this.session.getPatientLog(this.patient.access_token, this.patient.AccountType, this.patient.attributes.PatientLogID)
    .then(data => {
      this.session.patient.patientLog = JSON.parse(atob(data._body))
      this.lastCompleted = this.session.patient.patientLog.lastDate;
      if(!this.session.patient.patientLog[this.today]){
         this.session.patient.patientLog[this.today] =
         {
            "completed": 0,
            "assigned": 0,
            "exercises": []
        }
        this.logCompleted = false;
        this.session.updatePatientLog(this.patient.access_token, this.patient.AccountType, this.patient.attributes.PatientLogID)
      }

      var today = this.session.patient.patientLog[this.today]
      this.logCompleted = this.session.patient.patientLog[this.today].logCompleted || false;
      this.remainingExercise = (today.assigned - today.completed)
      
      if(this.session.patient.patientLog[this.today].logins){
        this.session.patient.patientLog[this.today].logins.push(new Date().toString('hh:mm tt'))
      }
      else{
        this.session.patient.patientLog[this.today].logins = [];
        this.session.patient.patientLog[this.today].logins.push(new Date().toString('hh:mm tt'))
      }
      this.session.updatePatientLog(this.patient.access_token, this.patient.AccountType, this.patient.attributes.PatientLogID)
      
    });

  }

  updateActivity() {
    if(this.session.patient.attributes.LastActive !== this.DateJs.today().toString("yyyy-MM-dd")){
      if(this.session.patient.attributes.LastActive === this.DateJs.today().addDays(-1).toString("yyyy-MM-dd")){
        this.streak = parseInt(this.streak) + 1;
        window.localStorage.setItem("streak", this.streak + "");
      } else {
        window.localStorage.setItem("streak", "1");
      }
      this.session.patient.attributes.LastActive = this.today;
      this.session.patient.attributes.Activated = true;
      this.session.updateLastActive(this.patient.access_token, this.patient.AccountType, this.patient.attributes.document_id);
    }
  }

  getDeviceToken() {
    this.push.register().then((t: PushToken) => {
        return this.push.saveToken(t, 'ignore_user');
      }).then((t: PushToken) => {
        if(t.token){
          this.session.saveDeviceToken(this.session.patient.access_token, this.session.patient.AccountType, this.session.patient.attributes.document_id, t.token)
        } 
      });  
  }

  updateLastCompleted() {
    this.lastCompleted = new Date().toString('MMM dd hh:mm tt');
  }

  completeAll() {
    var date = new Date().toString('MMM dd hh:mm tt');
    this.lastCompleted = date;
     if(!this.session.patient.patientLog[this.today].logCompleted ){
       this.presentLogModal();
     }
     this.session.patient.patientLog[this.today].completed = this.patient.patientLog[this.today].assigned;
     this.session.patient.patientLog.lastDate = date;
     for (let exercise of this.session.patient.patientLog[this.today].exercises) {
       exercise.completed = true;
       exercise.status = 1;
     }
     this.session.updatePatientLog(this.patient.access_token, this.patient.AccountType, this.patient.attributes.PatientLogID)
     .then(data => {
       
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

  presentMessageModal() {
    this.navCtrl.push(Chat);
  }

  presentLogModal() {
   let logModal = this.modalCtrl.create(LogModal);
   logModal.onDidDismiss(data => {
     if(data){
      this.session.patient.patientLog[this.today].feeling = data.feeling;
      this.session.patient.patientLog[this.today].pain = 10 - data.pain + 1;
      this.session.patient.patientLog[this.today].gettingBetter = data.gettingBetter;
      this.session.patient.patientLog[this.today].logCompleted = true;
      this.logCompleted = true;
      this.session.updatePatientLog(this.session.patient.access_token, this.session.patient.AccountType, this.session.patient.attributes.PatientLogID)
      .then(data => {

      });

      if(data.gettingBetter == false){
        // this.session.SubmitFeedback(this.patient.access_token, this.patient.AccountType, 'I am NOT feeling better', 'Patient Update Log Feedback', this.session.patient.attributes.PatientID, this.session.patient.attributes.ClinicID, new Date().toString('MMM dd hh:mm tt'))
        this.session.SendMessage(this.patient.access_token, this.patient.AccountType, 'I am NOT feeling better', 'Patient Update Log Feedback', this.session.patient.attributes.PatientID, this.session.patient.attributes.ClinicID, new Date().toString('MMM dd hh:mm tt'))
      }

     }
   });
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
              if(this.patient.attributes.deviceToken){
               this.session.scheduleAptPush(this.DateJs.parse(data.date).toString("h:mm"), this.DateJs.parse(data.date).addDays(-1).toString("yyyy-MM-ddT14:mm:ss+00:00"))
               .then(data => {
                  console.log(data.toString());
                });
              }
               this.nextApt = this.DateJs.parse(data.date).toString('dddd, MMM dS');
               window.localStorage.setItem("nextApt", this.nextApt)
              

            } else {
              return false;
            }
          }
        }
      ]
    });
    alert.present();
  }

  presentReviewModal(){
    let reviewModal = this.modalCtrl.create(ReviewModal);
    reviewModal.onDidDismiss(data => {
      if(data){
        window.localStorage.setItem("reviewed", 'true');
        console.log(data)
        this.session.submitReview(this.session.patient.attributes.Email, data.rating, data.message, this.session.patient.attributes.ClinicID);
      }
    });
    reviewModal.present();
  }

  toSettings() {
    this.navCtrl.push(SettingsPage);
  }



}
