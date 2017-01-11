import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';

import { MaterializeDirective } from "angular2-materialize";
import { DataTableModule } from "angular2-datatable";
import { DataFilterPipe } from './shared/data-filter.pipe';
import { SecondsAsDigitalClockPipe } from './shared/print-time.pipe';
import { AppRoutingModule } from './app-routing.module';

import { StoreModule } from '@ngrx/store';
import { events } from './shared/reducer/event';

import { PlayerComponent } from './team/player/player';
import { TimerComponent } from './game/timer/timer';
import { TeamComponent } from './team/team.component';
import { RosterComponent } from './game/roster/roster';
import { GameComponent } from './game/game.component';
import { EventComponent } from './game/event/event.component';

@NgModule({
  imports: [
    BrowserModule,
    DataTableModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    AppComponent,
    MaterializeDirective,
    DataFilterPipe,
    SecondsAsDigitalClockPipe,
    GameComponent,
    TimerComponent,
    RosterComponent,
    TeamComponent,
    PlayerComponent,
    EventComponent
  ],
  providers: [
    { provide: 'EventsStore', useValue: events }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
