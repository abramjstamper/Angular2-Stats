import { Team } from '../interface/team';
import { Game } from '../interface/game';
import { Rule } from '../interface/rule';

import { TEAMS } from '../mockData/mock-team';

export const GAMES: Game[] = [
  <Game>{
    id: 0,
    homeTeam: TEAMS[0],
    awayTeam: TEAMS[1],
    events: [],
    rules: <Rule>{
      technicalFoulIsPersonalFoul: true,
      jumpBallsAlternatePossession: true,
      benchTechnicalFoulIsTeamFoul: true,
      foulsResetAtHalf: false,
      numberFullTimeouts: 3,
      numberHalfTimeouts: 2,
      numberOfPeriods: 4,
      periodLengthInSeconds: 480,
      overtimeLengthInSeconds: 240
    },
    officials: ['Sam', 'Bob', 'Alex'],
    startTime: new Date(2017, 1, 7, 19),
    endTime: new Date(2017, 1, 7, 21),
    name: 'It a game name',
    attendance: 10000,
    location: 'Memorial Gym',
    isNeutralSite: true,
    gameKind: 0
  }
];