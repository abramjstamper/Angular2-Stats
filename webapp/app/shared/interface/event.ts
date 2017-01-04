import { Player } from './player';

export interface Event {
  id : number;
  seconds : number;
  period : number;
  playerID : Player;
  eventID : number;
  gameID: number;
  //location: Point;
}