import { Component, ViewChild } from '@angular/core';

import { TimerComponent } from './timer/timer';
import { RosterComponent } from './roster/roster';

import { GameService } from '../shared/service/game.service';
import { TeamService } from '../shared/service/team.service';
import { TimerService } from '../shared/service/timer.service';

import { Game } from '../shared/interface/game';

@Component({
  moduleId: module.id,
  selector: 'game',
  templateUrl: 'game.html',
  providers: [
    TimerService,
    TeamService,
    GameService
  ]
})
export class GameComponent {

@ViewChild(TimerComponent) timer: TimerComponent;
@ViewChild(RosterComponent) roster: RosterComponent;

  game:Game;
  homeScore:number = 0;
  awayScore:number = 0;

    constructor(
        private timerService: TimerService,
        private teamService: TeamService,
        private gameService: GameService
    ) {

    }

  ngOnInit(){
    this.game = this.gameService.getGame(0);
  }
}
