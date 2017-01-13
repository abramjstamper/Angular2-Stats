import { Player } from './player';
import { Point } from './point';

export class Event {
  id : number;
  timeEventOccuredInSeconds : number;
  periodEventOccured : number;
  playerID : number;
  eventID : number;
  gameID: number;
  gameSortID: number;
  location: Point;

  constructor(timeEventOccuredInSeconds:number, periodEventOccured:number,
  playerID:number, eventID:number, gameID:number, gameSortID:number, location?:Point){
    this.timeEventOccuredInSeconds = timeEventOccuredInSeconds;
    this.periodEventOccured = periodEventOccured;
    this.playerID = playerID;
    this.eventID = eventID;
    this.gameID = gameID;
    this.gameSortID = gameSortID;
    this.location = location;
  }
}