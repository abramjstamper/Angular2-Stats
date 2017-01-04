import { Component, Input } from '@angular/core';

import { GameService } from '../../shared/service/game.service';
import { TeamService } from '../../shared/service/team.service';
import { TimerService } from '../../shared/service/timer.service';

import { Event } from '../../shared/interface/event';

@Component({
  moduleId: module.id,
  selector: 'event',
  templateUrl: 'event.html'
})
export class EventComponent {

  @Input() gameID: number;

  sortBy:string = 'gameSortID';

  previousGameEvents:Event[] = [];

    constructor(
        private timerService: TimerService,
        private teamService: TeamService,
        private gameService: GameService
    ) {}

  ngOnInit(){
    //get game events
    this.previousGameEvents = this.gameService.getGame(this.gameID).events;
  }

}
