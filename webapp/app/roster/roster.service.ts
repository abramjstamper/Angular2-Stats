import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

import { Player } from '../shared/player';
import { Team } from '../shared/team';

@Injectable()
export class RosterService {

  private dbPlayers = [
            <Player>{
                id: 0,
                firstName: 'Sam',
                lastName: 'Moore',
                homeNumber: 0,
                awayNumber: 0,
                isActive: true,
                heightInInches: 60,
                weightInPounds: 200
            },
            <Player>{
                id: 1,
                firstName: 'Abram',
                lastName: 'Stamper',
                homeNumber: 1,
                awayNumber: 1,
                isActive: true,
                heightInInches: 60,
                weightInPounds: 200
            },
            <Player>{
                id: 2,
                firstName: 'Lilly',
                lastName: 'Burton',
                homeNumber: 2,
                awayNumber: 2,
                isActive: true,
                heightInInches: 60,
                weightInPounds: 200
            },
            <Player>{
                id: 3,
                firstName: 'Sam',
                lastName: 'Moore',
                homeNumber: 3,
                awayNumber: 3,
                isActive: true,
                heightInInches: 60,
                weightInPounds: 200
            },
            <Player>{
                id: 4,
                firstName: 'Sam',
                lastName: 'Moore',
                homeNumber: 4,
                awayNumber: 4,
                isActive: true,
                heightInInches: 60,
                weightInPounds: 200
            }
        ];

  private team:Team = {
            id: 0,
            name: 'Kokomo High School',
            hometown: 'Kokomo, IN',
            coachName: 'Matt Moore',
            mascot: 'Wildkats',
            displayName: 'Kokomo',
            gender: 'm',
            textColor: 'red-text',
            bgColor: 'blue darken-4',
            assistantCoach1: 'Assistant',
            assistantCoach2: 'Assistant 2',
            trainer: 'Trainer',
            athleticDirector: 'Jason Snyder',
            players: this.dbPlayers
        }

  getPlayers(){
    return this.team.players;
  }
  
  getTeam(){
    return this.team;
  }

  loadAllTeams(){
      let t = [];
      t.push(this.team);
      return t;
  }

  addPlayer(newPlayer:Player){
    this.team.players.push(newPlayer);
  }

  editTeam(modifiedTeam:Team){
    this.team = modifiedTeam;
  }

}