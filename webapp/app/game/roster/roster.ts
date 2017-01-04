import { Component, Input } from '@angular/core';
import { Team } from '../../shared/interface/team';
import { Player } from '../../shared/interface/player';

import { TimerService } from '../../shared/service/timer.service';
import { TeamService } from '../../shared/service/team.service';

@Component({
    selector: 'roster',
    //from root web server directory, not roster's component directory
    templateUrl: './app/game/roster/roster.html'
})
export class RosterComponent {

    @Input() team: Team;

    runTimer: boolean;
    setClickedRow : Function;

    playersInGame: number[] = [];

    constructor(
        private timerService: TimerService,
        private teamService: TeamService
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
    }
    
    trackPlayer(index:number, item:Player) {
        console.log(item);
        return item ? item.id : undefined;
    }
}