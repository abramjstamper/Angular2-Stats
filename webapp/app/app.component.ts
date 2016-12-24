import { Component, ViewChild } from '@angular/core';
import { TimerComponent } from './timer/timer';

@Component({
  moduleId: module.id,
  selector: 'core-app',
  templateUrl: 'app.component.html'
})
export class AppComponent {

@ViewChild(TimerComponent) timer: TimerComponent;

  title = "Stats";

  period = 1;
  homeScore = 0;
  visitorScore = 0;
  visitorTeamName = "Western";
  homeTeamName = "Kokomo";

  secondsPerQuarter = 480;
}
