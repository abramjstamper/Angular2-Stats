/* 
 * Code was adopted from the URL below
 * http://plnkr.co/edit/RwCZ1JKE3NldVL9YwNWK?p=preview
 * http://www.codingandclimbing.co.uk/blog/ionic-2-simple-countdown-timer-25
*/


import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import { ITimer } from '../interface/ittimer';

@Injectable()
export class TimerService {

  private timer: ITimer;
  private period: number;

  private runTimer = new Subject<boolean>();

  runTimer$ = this.runTimer.asObservable();

  getPeriod(){
    return this.period;
  }

  setPeriod(period : number){
    this.period = period;
  }

  incrementPeriod(){
    this.period += 1;
  }

  createTimer(timeInSeconds: number) {
    if (!timeInSeconds) { timeInSeconds = 0; }

    this.timer = <ITimer>{
      seconds: timeInSeconds,
      runTimer: false,
      hasStarted: false,
      hasFinished: false,
      secondsRemaining: timeInSeconds
    };
  }

  getTimer() { return this.timer; }

  startTimer() {
    this.timer.hasStarted = true;
    this.timer.runTimer = true;
    this.runTimer.next(this.timer.runTimer);
    this.timerTick();
  }

  pauseTimer() {
    this.timer.runTimer = false;
    this.runTimer.next(this.timer.runTimer);
  }

  resumeTimer() {
    this.startTimer();
  }

  hasFinished() {
    return this.timer.hasFinished;
  }

  getDisplayTime(){
    return this.getSecondsAsDigitalClock(this.timer.secondsRemaining);
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
    var hoursString = '';
    var minutesString = '';
    var secondsString = '';
    hoursString = (hours < 10) ? "0" + hours : hours.toString();
    minutesString = (minutes < 10) ? "0" + minutes : minutes.toString();
    secondsString = (seconds < 10) ? "0" + seconds : seconds.toString();
    return minutesString + ':' + secondsString;
  }

}