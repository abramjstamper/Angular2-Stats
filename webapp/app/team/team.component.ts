import { Component } from '@angular/core';
import { Team } from '../shared/team';
import { RosterService } from '../roster/roster.service';

@Component({
  moduleId: module.id,
  selector: 'team',
  templateUrl: 'team.html',
  providers: [
    RosterService
  ]
})
export class TeamComponent {

  currentTeam: Team;

      constructor(
        private rosterService: RosterService
      ){}

      ngOnInit() {
        this.currentTeam = this.rosterService.getTeam();
      }

}
