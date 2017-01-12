import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

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

  createGameEvent(gameID: number, newEvent: Event) {
    this.event.next(newEvent);
    GAMES[gameID].events.push(newEvent);

    console.log(newEvent);
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