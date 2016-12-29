/* 
 * Code was adopted from the URL below
 * http://plnkr.co/edit/RwCZ1JKE3NldVL9YwNWK?p=preview
 * http://www.codingandclimbing.co.uk/blog/ionic-2-simple-countdown-timer-25
*/

import { Component, Input } from '@angular/core';
import { ITimer } from './ittimer';
import { TimerService } from './timer.service';

@Component({
    selector: 'timer',
    //from root web server directory, not timer's component directory
    templateUrl: './app/timer/timer.html',
    providers: [TimerService]
})
export class TimerComponent {

    @Input() timeInSeconds: number;

    constructor(private timerService: TimerService) { }

    ngOnInit() {
        this.timerService.createTimer(this.timeInSeconds);
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

    getDisplayTime(){
        return this.timerService.getDisplayTime();
    }

}