import {Component, Input} from '@angular/core';
import { ITimer } from './itimer';
 
 
@Component({
    selector: 'timer',
    templateUrl: 'timer.html'
})
export class TimerComponent {
 
    @Input() timeInSeconds: number;
    public timer: ITimer;
    public time: number;
    themeColor: any;
    
    constructor() {
        this.themeColor = window.localStorage.getItem("clinicID") || "primary";
    }
    
    ngOnInit() {
        this.initTimer(this.timeInSeconds);
    }
    
    hasFinished() {
        return this.timer.hasFinished;
    }
    
    initTimer(time) {
        this.time = time
        if(!this.timeInSeconds) { this.timeInSeconds = 0; }
    
        this.timer = <ITimer>{
            seconds: time,
            runTimer: false,
            hasStarted: false,
            hasFinished: false,
            secondsRemaining: time
        };
    
        this.timer.displayTime = this.getSecondsAsDigitalClock(this.timer.secondsRemaining);
    }

    resetTimer() {
        this.initTimer(this.time)
    }
    
    startTimer() {
        this.timer.hasStarted = true;
        this.timer.runTimer = true;
        this.timerTick();
    }
    
    pauseTimer() {
        this.timer.runTimer = false;
    }
    
    resumeTimer() {
        this.startTimer();
    }
    
    timerTick() {
        setTimeout(() => {
            if (!this.timer.runTimer) { return; }
                this.timer.secondsRemaining--;
                this.timer.displayTime = this.getSecondsAsDigitalClock(this.timer.secondsRemaining);
            if (this.timer.secondsRemaining > 0) {
                this.timerTick();
            }
            else {
                this.timer.hasFinished = true;
            }
        }, 1000);
    }
    
    getSecondsAsDigitalClock(inputSeconds: number) {
        var sec_num = parseInt(inputSeconds.toString(), 10); // don't forget the second param
        var hours = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);
        var minutesString = '';
        var secondsString = '';
        // hoursString = (hours < 10) ? "0" + hours : hours.toString();
        minutesString = (minutes < 10) ? "" + minutes : minutes.toString();
        secondsString = (seconds < 10) ? "0" + seconds : seconds.toString();
        return minutesString + ':' + secondsString;

        // return hoursString + ':' + minutesString + ':' + secondsString;
    }
}