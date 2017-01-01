import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MaterializeDirective } from "angular2-materialize";
import { DataTableModule } from "angular2-datatable";
import { DataFilterPipe }   from './shared/data-filter.pipe';

import { TimerComponent } from './timer/timer';
import { RosterComponent } from './roster/roster';

import { AppComponent }  from './app.component';

@NgModule({
  imports:      [ 
    BrowserModule,
    DataTableModule
    ],
  declarations: [
    AppComponent,
    MaterializeDirective,
    DataFilterPipe,
    TimerComponent,
    RosterComponent
    ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
