import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';

import { MaterializeDirective } from "angular2-materialize";
import { DataTableModule } from "angular2-datatable";
import { DataFilterPipe } from './shared/data-filter.pipe';
import { AppRoutingModule } from './app-routing.module';

import { PlayerComponent } from './team/player/player';
import { TimerComponent } from './timer/timer';
import { TeamComponent } from './team/team.component';
import { RosterComponent } from './roster/roster';
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
