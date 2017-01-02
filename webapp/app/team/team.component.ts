import { Component } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
declare var Materialize:any;

import { Team } from '../shared/team';
import { Player } from '../shared/player';
import { PlayerComponent } from './player/player';
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

  public genders = [
    { value: 'F', display: 'Female' },
    { value: 'M', display: 'Male' }
  ];

  public myForm: FormGroup; // our model driven form
  public submitted: boolean; // keep track on whether form is submitted
  public events: any[] = []; // use later to display form changes
  public teams: Team[];

  constructor(
    private _fb: FormBuilder,
    private rosterService: RosterService
  ) { }

  ngOnInit() {

    this.teams = this.rosterService.loadAllTeams();

    this.myForm = this._fb.group({
      id: [''],
      name: ['Team Name', [<any>Validators.required, <any>Validators.minLength(3)]],
      hometown: [''],
      coachName: [''],
      mascot: [''],
      displayName: ['Abbv', [<any>Validators.required, <any>Validators.maxLength(6)]],
      gender: ['M'],
      textColor: [''],
      bgColor: [''],
      assistantCoach1: [''],
      assistantCoach2: [''],
      trainer: [''],
      athleticDirector: [''],
      players: this._fb.array([
        this.initPlayer(),
      ])
    });
  }

  loadTeamIntoForm(team:Team){
    for(let i in team.players.slice(0, team.players.length - 1)){
      this.addPlayer();
    }
    (<FormGroup>this.myForm)
            .patchValue(team, {});
  }

  initPlayer() {
    return this._fb.group({
      id: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      homeNumber: ['', Validators.required],
      awayNumber: ['', Validators.required],
      isActive: ['true'],
      heightInInches: [''],
      weightInPounds: ['']
    });
  }

  addPlayer() {
    const control = <FormArray>this.myForm.controls['players'];
    control.push(this.initPlayer());
  }

  removePlayer(i: number) {
    const control = <FormArray>this.myForm.controls['players'];
    control.removeAt(i);
  }

  save(model: Team, isValid: boolean) {
    this.submitted = true;
    if(isValid){
      var toastContent = `<span><b>${model.name} saved successfully!</b></span>`;
      Materialize.toast(toastContent, 5000, 'green');
      this.rosterService.editTeam(model);
    } else {
      var toastContent = `<span><b>Saving ${model.name} was unsuccessful!</b></span>`;
      Materialize.toast(toastContent, 5000, 'red');
    }

    // check if model is valid
    // if valid, call API to save customer
    console.log(model, isValid);
  }
}
