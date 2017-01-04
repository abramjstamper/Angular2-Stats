import { Component, ViewChild } from '@angular/core';

import { TimerComponent } from './timer/timer';
import { RosterComponent } from './roster/roster';

import { TimerService } from '../shared/service/timer.service';
import { TeamService } from '../shared/service/team.service';

@Component({
  moduleId: module.id,
  selector: 'game',
  templateUrl: 'game.html',
  providers: [
    TimerService,
    TeamService
  ]
})
export class GameComponent {

@ViewChild(TimerComponent) timer: TimerComponent;
@ViewChild(RosterComponent) roster: RosterComponent;

  title = "Stats";

  homeScore = 0;
  visitorScore = 0;
  visitorTeamName = "Western";
  homeTeamName = "Kokomo";

  secondsPerQuarter = 480;
}
