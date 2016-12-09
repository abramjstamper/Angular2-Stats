import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MaterializeDirective } from "angular2-materialize";

import { AppComponent }  from './app.component';

@NgModule({
  imports:      [ BrowserModule ],
  declarations: [
    AppComponent,
    MaterializeDirective
    ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
