import { Team } from './team';
import { Event } from './event';
import { Rule } from './rule';

export interface Game {
  id: number;
  homeTeam: Team;
  awayTeam: Team;
  events: Event[];
  rules: Rule;
  officials: string[];
  startTime: Date;
  endTime: Date;
  name: string;
  attendance: number;
  location: string;
  isNeutralSite: boolean;
  gameKind: number; //preseason, postseason, regular season, exhibition, etc
}