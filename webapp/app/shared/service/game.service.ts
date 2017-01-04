import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

import { Game } from '../interface/game';
import { Event } from '../interface/event';

import { GAMES } from '../mockData/mock-game';
import { EVENT_OPTIONS } from '../mockData/mock-event-options';

@Injectable()
export class GameService {

//games
  getGame(gameID:number):Game{
    return GAMES[gameID];
  }

  getAllGames():Game[]{
    return GAMES;
  }

  createGame(newGame:Game){
    GAMES.push(newGame);
  }


//events
  createGameEvent(gameID:number, newEvent:Event){
    GAMES[gameID].events.push(newEvent);

    console.log(newEvent);
  }
  
  deleteGameEvent(gameID:number, event:Event){
    let idx:number = GAMES[gameID].events.indexOf(event);
    if (idx > -1) {
     GAMES[gameID].events.splice(idx, 1);
    }
  }

  getGameEventOptions(){
    return EVENT_OPTIONS;
  }


}