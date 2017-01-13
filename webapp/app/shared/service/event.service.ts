import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { Game } from '../interface/game';
import { Player } from '../interface/player';
import { Event } from '../interface/event';

import { GAMES } from '../mockData/mock-game';
import { EVENT_OPTIONS } from '../mockData/mock-event-options';

@Injectable()
export class EventService {

  event = new Subject<Event>();
  player = new Subject<Player>();

  event$ = this.event.asObservable();
  player$ = this.player.asObservable();

  subscription: Subscription;
  currentSortID: number = 0;

  createGameEvent(gameID: number, newEvent: Event) {
    if (!this.subscription) {
      //get player event emitter as a subscription
      this.subscription = this.createEventSubscription(gameID, newEvent);
    } else {
      this.subscription.unsubscribe();
      this.subscription = this.createEventSubscription(gameID, newEvent);
    }
  }

  private createEventSubscription(gameID: number, event: Event) {
    return this.player$.subscribe(
      player => {
        event.playerID = player.id;
        event.gameSortID = this.currentSortID++;
        this.event.next(event);
        GAMES[gameID].events.push(event);
        this.subscription.unsubscribe();
        this.subscription = undefined;
      });
  }

  convertToMake(gameID:number){
    let previousEvent:Event = GAMES[gameID].events.pop();
    if(previousEvent.eventID == EVENT_OPTIONS.findIndex(str => str == 'field goal missed')){
        previousEvent.eventID = EVENT_OPTIONS.findIndex(str => str == 'field goal made');
    }
    if(previousEvent.eventID == EVENT_OPTIONS.findIndex(str => str == '3pt field goal missed')){
      previousEvent.eventID = EVENT_OPTIONS.findIndex(str => str == '3pt field goal made');
    }
    GAMES[gameID].events.push(previousEvent);
  }

    undo(gameID:number) {
    console.log(GAMES[gameID].events);
    if (GAMES[gameID].events.length > 0) {
      GAMES[gameID].events.pop();
    }
  }

  deleteGameEvent(gameID: number, event: Event) {
    let idx: number = GAMES[gameID].events.indexOf(event);
    if (idx > -1) {
      GAMES[gameID].events.splice(idx, 1);
    }
  }

  getGameEventOptions() {
    return EVENT_OPTIONS;
  }
}