import { Component, ViewChild } from '@angular/core';

import { TimerComponent } from './timer/timer';
import { RosterComponent } from './roster/roster';

import { EventService } from '../shared/service/event.service';
import { GameService } from '../shared/service/game.service';
import { TeamService } from '../shared/service/team.service';
import { TimerService } from '../shared/service/timer.service';

import { Game } from '../shared/interface/game';
import { Event } from '../shared/interface/event';

@Component({
  moduleId: module.id,
  selector: 'game',
  templateUrl: 'game.html',
  providers: [
    EventService,
    GameService,
    TeamService,
    TimerService
  ]
})
export class GameComponent {

@ViewChild(TimerComponent) timer: TimerComponent;
@ViewChild(RosterComponent) roster: RosterComponent;

  game:Game;
  homeScore:number = 0;
  awayScore:number = 0;

  previousGameEvents:Event[] = [];
  currentSortID:number = 1;
  eventOptionsSymbolTable:{} = {}

    constructor(
        private timerService: TimerService,
        private teamService: TeamService,
        private gameService: GameService,
        private eventService: EventService,
    ) {}

  ngOnInit(){
    this.game = this.gameService.getGame(0);
    this.eventOptionsSymbolTable = this.eventService.getGameEventOptions();
  }

  createEvent(event:string){

    //get player event emitter

    //create new event & assign params
    let newEvent:Event = new Event(this.timerService.getTimer().secondsRemaining, 
    this.timerService.getPeriod(), null, // player ID 
    this.eventOptionsSymbolTable[event], this.game.id, this.currentSortID);

    this.currentSortID++;
    this.eventService.createGameEvent(this.game.id, newEvent);
  }

  undo(){
    if(this.previousGameEvents.length > 0){
      this.previousGameEvents.pop();
    }
  }
}
