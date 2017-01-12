import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "secondsAsDigitalClock"
})
export class SecondsAsDigitalClockPipe implements PipeTransform {

    transform(sec: any): any {
        return this.getSecondsAsDigitalClock(<number>sec);
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