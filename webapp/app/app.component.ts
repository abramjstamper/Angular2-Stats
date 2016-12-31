import { Component, ViewChild } from '@angular/core';
import { TimerComponent } from './timer/timer';
import { RosterComponent } from './roster/roster';
import { TimerService } from './shared/timer.service';

@Component({
  moduleId: module.id,
  selector: 'core-app',
  templateUrl: 'app.component.html',
  providers: [TimerService]
})
export class AppComponent {

@ViewChild(TimerComponent) timer: TimerComponent;
@ViewChild(RosterComponent) roster: RosterComponent;

  title = "Stats";

  homeScore = 0;
  visitorScore = 0;
  visitorTeamName = "Western";
  homeTeamName = "Kokomo";

  secondsPerQuarter = 480;
}
