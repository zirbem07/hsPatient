import { Component, ViewChild } from '@angular/core';

import { NavController, Platform, ModalController } from 'ionic-angular';
import { ExerciseService }  from '../../services/exerciseService';
import { SessionService } from '../../services/sessionService';
import { Exercise }  from '../../models/exercise';
import { TimerComponent } from '../timer/timer'
import { FeedbackModal } from '../feedbackModal/feedbackModal'

import 'datejs';


@Component({
  selector: 'page-exercise',
  templateUrl: 'exercise.html'
})
export class ExercisePage {
  private exercises: Exercise[] = [];
  private selectedExercise: Exercise;
  private patient: any;
  private DateJs: IDateJSStatic =  <any>Date;
  private today;
  private timerActive: boolean = false;
  showText: boolean = true;
  @ViewChild('video') video;
  private noExercises: Exercise = {
    Name: "No Exercises",
    BodyPart: "",
    Days: "1,1,1,1,1,1,1,1,1,1,1",
    Strength: "",
    Hold: 0,
    Equipment: "",
    Deleted: false,
    Video: "",
    Img: "",
    TimeStamp: "",
    AssignedExerciseID: "",
    PatientID: "",
    Frequency: 0,
    Reps: 0,
    Sets: 0,
    Description: "You have no exercises assigned for today.",
    ImgBlobID: "",
    VideoBlobID: "",
    Completed: true,
    Status: 1,
    document_id: ""
}

  @ViewChild(TimerComponent) timer: TimerComponent;

  constructor(public navCtrl: NavController, public plt: Platform, private session: SessionService, private exercise: ExerciseService, public modalCtrl: ModalController) {
    this.exercises = exercise.exercises;
    this.patient = session.patient;
    this.today = this.DateJs.today().toString('M-dd-yyyy')
    this.checkCompleted();
    this.getBlobImgs()
    this.selectedExercise = this.exercises[0] || this.noExercises;
  }

  checkCompleted(){
    var d = new Date();
    var log = this.session.patient.patientLog[this.today].exercises;
    this.exercises.forEach((item, index) => { 
      if(typeof item.Days === 'string' && item.Days.split(',')[d.getDay()] === "0"){
          this.exercises.splice(index, 1);
      }
      for (let logItem of log){

        if(logItem.exerciseName == item.Name && logItem.completed){
          item.Completed = true;
          item.Status = logItem.status;
        }
      }
    });
  }

  getBlobImgs(){
    for (let item of this.exercises) {
      if(item.ImgBlobID) {
        this.exercise.getBlobImg(this.patient.access_token, this.patient.AccountType, item.ImgBlobID)
        .then(imgData => {
          item.Img = imgData._body;
        })

        this.exercise.getBlobVideo(this.patient.access_token, this.patient.AccountType, item.VideoBlobID)
        .then(vidData => {
          item.Video = vidData._body;
        })
      }   
    }
  }

  completeExercise(name, status) {
    for(let exercise of this.session.patient.patientLog[this.today].exercises){
      if(exercise.exerciseName == name){
        if(!exercise.completed){
          this.session.patient.patientLog[this.today].completed+=1;

        }
        exercise.completed = true;
        exercise.status = status; 
      }
    }
    this.session.lastCompleted = new Date().toString('MMM dd hh:mm tt');
    this.session.patient.patientLog.lastDate = new Date().toString('MMM dd hh:mm tt');
    
    if(status == -1){
      this.presentFeedbackModal();
    }

    this.session.updatePatientLog(this.patient.access_token, this.patient.AccountType, this.patient.attributes.PatientLogID)
    this.checkCompleted();
  }

  presentFeedbackModal(){
    let feedbackModal = this.modalCtrl.create(FeedbackModal);
    feedbackModal.onDidDismiss(data => {
      if(data){
        console.log(data);
        
        this.session.SubmitFeedback(this.patient.access_token, this.patient.AccountType, data.message, this.selectedExercise.Name, this.session.patient.attributes.PatientID, this.session.patient.attributes.ClinicID, new Date().toString('MMM dd hh:mm tt'))
        
      }
    });
    feedbackModal.present();
  }

  selectExercise(exercise) {
    if(this.plt.is('android')){
      var video = document.getElementById("myVideo");
      video.style.width = "180px";
      video.style.height = "180px";
      this.showText = true;
    }
    this.timerActive = false;
    this.selectedExercise = exercise;
    this.timer.initTimer(exercise.Hold);
  }

  toggleTimer() {
    this.timerActive = !this.timerActive;
  }

  videoPlay() {
    console.log('play')
    if(this.plt.is('android')){
      this.showText = false;
      var video = document.getElementById("myVideo");
      video.style.width = "300px";
      video.style.height = "300px";
    }
  }

  videoPause() {
    console.log('pause')
    if(this.plt.is('android')){
      this.showText = true;
      var video = document.getElementById("myVideo");
      video.style.width = "180px";
      video.style.height = "180px";
    }
  }

  videoEnd() {
    console.log('end')
    if(this.plt.is('android')){
      this.showText = true;
      var video = document.getElementById("myVideo");
      video.style.width = "180px";
      video.style.height = "180px";
    }
  }

}
