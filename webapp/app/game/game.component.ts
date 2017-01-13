import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

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

  game: Game;
  homeScore: number = 0;
  awayScore: number = 0;
  status: string = "Load Rosters and Select Starting Lineup";

  currentSortID: number = 1;
  eventOptionsSymbolTable: String[] = []
  subscription: Subscription;

  constructor(
    private eventService: EventService,
    private gameService: GameService,
    private teamService: TeamService,
    private timerService: TimerService
  ) {
  }

  ngOnInit() {
    this.game = this.gameService.getGame(0);
    this.eventOptionsSymbolTable = this.eventService.getGameEventOptions();
  }

  createEvent(event: string) {
    if (this.timerService.getTimer().runTimer)
      this.status = "Select a player";
    else
      this.status = "Start the clock";
    let newEvent: Event = new Event(this.timerService.getTimer().secondsRemaining,
      this.timerService.getPeriod(), null,
      this.eventOptionsSymbolTable.findIndex(str => str == event), this.game.id, null);
    this.eventService.createGameEvent(this.game.id, newEvent);
  }

  undo(){
    this.eventService.undo(this.game.id);
  }
}
