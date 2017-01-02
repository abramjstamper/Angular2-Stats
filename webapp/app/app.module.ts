import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

import { MaterializeDirective } from "angular2-materialize";
import { DataTableModule } from "angular2-datatable";
import { DataFilterPipe } from './shared/data-filter.pipe';
import { AppRoutingModule } from './app-routing.module';

import { TimerComponent } from './timer/timer';
import { TeamComponent } from './team/team.component';
import { RosterComponent } from './roster/roster';
import { GameModuleComponent } from './gameModule/gameModule.component';

@NgModule({
  imports: [
    BrowserModule,
    DataTableModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    MaterializeDirective,
    DataFilterPipe,
    GameModuleComponent,
    TimerComponent,
    RosterComponent,
    TeamComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
