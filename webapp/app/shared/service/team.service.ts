import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

import { Player } from '../interface/player';
import { Team } from '../interface/team';
import { TEAMS } from '../mockData/mock-team';

@Injectable()
export class TeamService {

  getPlayers(teamID:number):Player[]{
    return TEAMS[teamID].players;
  }
  
  getTeam(id:number):Team{
    return TEAMS[id];
  }

  loadAllTeams(): Team[]{
      return TEAMS;
  }

  addPlayer(teamID:number, newPlayer:Player){
    TEAMS[teamID].players.push(newPlayer);
  }

  editTeam(teamID:number, modifiedTeam:Team){
    TEAMS[teamID] = modifiedTeam;
  }

}