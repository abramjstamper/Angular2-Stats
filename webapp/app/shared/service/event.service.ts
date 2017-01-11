import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Game } from '../interface/game';
import { Event } from '../interface/event';

import { GAMES } from '../mockData/mock-game';
import { EVENT_OPTIONS } from '../mockData/mock-event-options';

@Injectable()
export class EventService {

  observable:any = Observable.create((observer: any) => {});

  constructor() {
  }

  createGameEvent(gameID: number, newEvent: Event) {
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