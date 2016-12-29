import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MaterializeDirective } from "angular2-materialize";
import { TimerComponent } from './timer/timer';
import { RosterComponent } from './roster/roster';

import { AppComponent }  from './app.component';

@NgModule({
  imports:      [ BrowserModule ],
  declarations: [
    AppComponent,
    MaterializeDirective,
    TimerComponent,
    RosterComponent
    ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
