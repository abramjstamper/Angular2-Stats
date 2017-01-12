import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Player } from '../../shared/interface/player';
import { Team } from '../../shared/interface/team';

import { EventService } from '../../shared/service/event.service';
import { TeamService } from '../../shared/service/team.service';
import { TimerService } from '../../shared/service/timer.service';

@Component({
    selector: 'roster',
    //from root web server directory, not roster's component directory
    templateUrl: './app/game/roster/roster.html'
})
export class RosterComponent {

    @Input() team: Team;
    @Output() playerIDClicked = new EventEmitter();

    runTimer: boolean;
    setClickedRow : Function;

    playersInGame: number[] = [];

    constructor(
        private eventService: EventService,
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
    
    playerClicked(player:Player){
        this.eventService.player.next(player);
    }
}