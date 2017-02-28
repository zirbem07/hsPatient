import { Component, ViewChild } from '@angular/core';

import { NavController } from 'ionic-angular';
import { ExerciseService }  from '../../services/exerciseService';
import { SessionService } from '../../services/sessionService';
import { Exercise }  from '../../models/exercise';
import { TimerComponent } from '../timer/timer'
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

  @ViewChild(TimerComponent) timer: TimerComponent;

  constructor(public navCtrl: NavController, private session: SessionService, private exercise: ExerciseService) {
    this.exercises = exercise.exercises;
    this.patient = session.patient;
    this.today = this.DateJs.today().toString('M-dd-yyyy')
    this.checkCompleted();
    this.getBlobImgs()
    this.selectedExercise = this.exercises[0];
  }

  checkCompleted(){
    var d = new Date();
    var log = this.session.patient.patientLog[this.today].exercises;
    this.exercises.forEach((item, index) => { 
      if(item.Days.split(',')[d.getDay()] === "0"){
          this.exercises.splice(1, index);
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

    this.session.updatePatientLog(this.patient.access_token, this.patient.AccountType, this.patient.attributes.PatientLogID)
    this.checkCompleted();
  }

  selectExercise(exercise) {
    this.timerActive = false;
    this.selectedExercise = exercise;
  }

  toggleTimer() {
    this.timerActive = !this.timerActive;
  }

}
