import { Component, Input } from '@angular/core';
import { Team } from '../shared/Team';
import { Player } from '../shared/Player';

import { TimerComponent } from '../timer/timer';

@Component({
    selector: 'roster',
    //from root web server directory, not roster's component directory
    templateUrl: './app/roster/roster.html'
})
export class RosterComponent {
    constructor() { }

    team: Team;
    playersInGame: Player[];

    ngOnInit() {
        this.team = <Team>{
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
            players: []
        }
        this.initRoster();
    }

    initRoster() {
        //get players from db
        let dbPlayers = [
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
                firstName: 'Sam',
                lastName: 'Moore',
                homeNumber: 1,
                awayNumber: 1,
                isActive: true,
                heightInInches: 60,
                weightInPounds: 200
            },
            <Player>{
                id: 2,
                firstName: 'Sam',
                lastName: 'Moore',
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
        ]

        for (let i of dbPlayers) {
            this.team.players.push(i);
        }
    }
}