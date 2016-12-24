import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MaterializeDirective } from "angular2-materialize";
import { TimerComponent } from './timer/timer';

import { AppComponent }  from './app.component';

@NgModule({
  imports:      [ BrowserModule ],
  declarations: [
    AppComponent,
    MaterializeDirective,
    TimerComponent
    ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
