import { Component, Input } from '@angular/core';
import { Team } from '../shared/Team';
import { Player } from '../shared/Player';

import { TimerService } from '../shared/timer.service';

@Component({
    selector: 'roster',
    //from root web server directory, not roster's component directory
    templateUrl: './app/roster/roster.html'
})
export class RosterComponent {

    runTimer: boolean;
    setClickedRow : Function;

    team: Team;
    playersInGame: number[] = [];

    constructor(private timerService: TimerService) {
        timerService.runTimer$.subscribe(
            runTimer => {
                this.runTimer = runTimer;
            });
        this.setClickedRow = function(player: Player, index:number){
            if(this.playersInGame.hasOwnProperty(index)){
                delete this.playersInGame[index];
            } else {
                this.playersInGame[index] = player;
            }
        }
    }

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
        ]

        for (let i of dbPlayers) {
            this.team.players.push(i);
        }
    }  
    
    trackPlayer(index:number, item:Player) {
        console.log(item);
        return item ? item.id : undefined;
    }
}