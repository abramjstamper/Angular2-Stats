import { Component, ViewChild } from '@angular/core';

import { TimerComponent } from '../../timer/timer';
import { RosterComponent } from '../../roster/roster';

import { TimerService } from '../../shared/service/timer.service';
import { TeamService } from '../../shared/service/team.service';

import { Event } from '../../shared/interface/event';

@Component({
  moduleId: module.id,
  selector: 'event',
  templateUrl: 'event.html'
})
export class EventComponent {

}
