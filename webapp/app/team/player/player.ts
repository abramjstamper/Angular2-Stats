import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Player } from '../../shared/interface/player';

@Component({
  moduleId: module.id,
  selector: 'player',
  templateUrl: 'player.html'
})
export class PlayerComponent {
  @Input('group')
  public playerForm: FormGroup;
}
