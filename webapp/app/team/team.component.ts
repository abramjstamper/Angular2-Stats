import { Component } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';

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
  ) { } // form builder simplify form initialization

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

    // this.subcribeToFormChanges();
  }

  loadTeamIntoForm(team:Team){
    for(let i in team.players){
      this.addPlayer();
    }
    (<FormGroup>this.myForm)
            .patchValue(team, {});
  }

  initPlayer() {
    // initialize our address
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
    // add address to the list
    const control = <FormArray>this.myForm.controls['players'];
    control.push(this.initPlayer());
  }

  removePlayer(i: number) {
    // remove address from the list
    const control = <FormArray>this.myForm.controls['players'];
    control.removeAt(i);
  }

  save(model: Team, isValid: boolean) {
    this.submitted = true; // set form submit to true

    // check if model is valid
    // if valid, call API to save customer
    console.log(model, isValid);
  }

  subcribeToFormChanges() {
    // initialize stream
    const myFormValueChanges$ = this.myForm.valueChanges;

    // subscribe to the stream 
    myFormValueChanges$.subscribe(x => this.events
      .push({ event: `STATUS CHANGED`, object: x }));
  }
}
