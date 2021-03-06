/* 
 * Code was adopted from the URL below
 * http://plnkr.co/edit/RwCZ1JKE3NldVL9YwNWK?p=preview
 * http://www.codingandclimbing.co.uk/blog/ionic-2-simple-countdown-timer-25
*/

import { Component, Input } from '@angular/core';
import { TimerService } from '../../shared/service/timer.service';

@Component({
    selector: 'timer',
    //from root web server directory, not timer's component directory
    templateUrl: './app/game/timer/timer.html'
})
export class TimerComponent {

    @Input() timeInSeconds: number;

    constructor(private timerService: TimerService) { }

    ngOnInit() {
        this.timerService.createTimer(this.timeInSeconds);
        this.timerService.setPeriod(1);
    }

    newPeriod() {
        this.timerService.incrementPeriod();
        this.timerService.createTimer(this.timeInSeconds);
    }

    canStartNextPeriod() {
        if (this.timerService.getPeriod() < 4) {
            if (this.timerService.getTimer().secondsRemaining == 0)
                return this.getTimer().hasStarted && (!this.getTimer().runTimer || this.getTimer().hasFinished)
        }
        return false;
    }

    getPeriod() {
        return this.timerService.getPeriod();
    }

    getTimer() {
        return this.timerService.getTimer();
    }

    startTimer() {
        this.timerService.startTimer();
    }

    pauseTimer() {
        this.timerService.pauseTimer();
    }

    resumeTimer() {
        this.timerService.resumeTimer();
    }

    getDisplayTime() {
        return this.timerService.getDisplayTime();
    }

    addSecond() {
        this.timerService.changeSecondByOne(true);
    }

    subtractSecond() {
        this.timerService.changeSecondByOne(false);
    }

    addMinute() {
        this.timerService.changeMinuteByOne(true);
    }

    subtractMinute() {
        this.timerService.changeMinuteByOne(false);
    }
}