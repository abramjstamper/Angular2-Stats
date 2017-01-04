import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

import { Game } from '../interface/game';
import { Event } from '../interface/event';

import { GAMES } from '../mockData/mock-game';

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
}