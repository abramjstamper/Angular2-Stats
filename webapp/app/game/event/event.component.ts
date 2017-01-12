import { Component, Input } from '@angular/core';

import { EventService } from '../../shared/service/event.service';
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
  rowsOnPageSet = 10;

    constructor(
        private eventService: EventService,
        private gameService: GameService,
        private teamService: TeamService,
        private timerService: TimerService
    ) {
      eventService.event$.subscribe(
        event => {
          event['player'] = teamService.getPlayer(event.playerID);
          this.previousGameEvents.push(event);
        });
    }

  ngOnInit(){
    //get game events
    //this.previousGameEvents = this.gameService.getGame(this.gameID).events;
  }

}
