import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';

import { MaterializeDirective } from "angular2-materialize";
import { DataTableModule } from "angular2-datatable";
import { DataFilterPipe } from './shared/pipes/data-filter.pipe';
import { SecondsAsDigitalClockPipe } from './shared/pipes/print-time.pipe';
import { EventTypePipe } from './shared/pipes/event-type.pipe';
import { CapitalizePipe } from './shared/pipes/capitalize.pipe';
import { AppRoutingModule } from './app-routing.module';

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
    EventTypePipe,
    CapitalizePipe,
    GameComponent,
    TimerComponent,
    RosterComponent,
    TeamComponent,
    PlayerComponent,
    EventComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
