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

  eventOptionsST:{} = {};
  previousGameEvents:Event[] = [];
  currentSortID:number = 1;

    constructor(
        private timerService: TimerService,
        private teamService: TeamService,
        private gameService: GameService
    ) {}

  ngOnInit(){
    //get game events
    this.eventOptionsST = this.gameService.getGameEventOptions();
    this.previousGameEvents = this.gameService.getGame(this.gameID).events;
  }

  createEvent(event:string){

    //get player event emitter

    //create new event & assign params
    let newEvent:Event = new Event(this.timerService.getTimer().secondsRemaining, 
    this.timerService.getPeriod(), null, // player ID 
    this.eventOptionsST[event], this.gameID, this.currentSortID);

    this.currentSortID++;
    this.gameService.createGameEvent(this.gameID, newEvent);
  }

  undo(){
    if(this.previousGameEvents.length > 0){
      this.previousGameEvents.pop();
    }
  }


}
