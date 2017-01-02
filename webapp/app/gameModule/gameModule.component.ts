import { Component, ViewChild } from '@angular/core';

import { TimerComponent } from '../timer/timer';
import { RosterComponent } from '../roster/roster';

import { TimerService } from '../shared/timer.service';
import { RosterService } from '../roster/roster.service';

@Component({
  moduleId: module.id,
  selector: 'gameModule',
  templateUrl: 'gameModule.html',
  providers: [
    TimerService,
    RosterService
  ]
})
export class GameModuleComponent {

@ViewChild(TimerComponent) timer: TimerComponent;
@ViewChild(RosterComponent) roster: RosterComponent;

  title = "Stats";

  homeScore = 0;
  visitorScore = 0;
  visitorTeamName = "Western";
  homeTeamName = "Kokomo";

  secondsPerQuarter = 480;
}
