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

    //checks to see if a player needs to be selected before creating a new subscription
    if (!this.subscription) {
      //get player event emitter as a subscription
      this.subscription = this.createEventSubscription(event);
    } else {
      this.status = "Select an event";
      this.subscription.unsubscribe();
      this.subscription = this.createEventSubscription(event);
    }

  }

  private createEventSubscription(event: string) {

    if (this.timerService.getTimer().runTimer)
      this.status = "Select a player";
    else
      this.status = "Start the clock";

    return this.eventService.player$.subscribe(
      player => {
        //create new event object & assign params
        let newEvent: Event = new Event(this.timerService.getTimer().secondsRemaining,
          this.timerService.getPeriod(), player.id, // player ID 
          this.eventOptionsSymbolTable.findIndex(str => str == event), this.game.id, this.currentSortID);
        this.currentSortID++;

        this.eventService.createGameEvent(this.game.id, newEvent);
        this.subscription.unsubscribe();
        this.subscription = undefined;
        this.status = "Select an event";
      });
  }

  undo(){
    console.log(this.game.events);
    if (this.game.events.length > 0) {
      this.game.events.pop();
    }
  }
}
