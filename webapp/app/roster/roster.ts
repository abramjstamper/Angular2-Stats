import { Component, Input } from '@angular/core';
import { Team } from '../shared/Team';
import { Player } from '../shared/Player';

import { TimerService } from '../shared/timer.service';
import { RosterService } from './roster.service';

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

    constructor(
        private timerService: TimerService,
        private rosterService: RosterService
    ) {
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
        this.team = this.rosterService.getTeam();
    }
    
    trackPlayer(index:number, item:Player) {
        console.log(item);
        return item ? item.id : undefined;
    }
}