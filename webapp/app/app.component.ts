import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'core-app',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  title = "Stats";

  period = 1;
  homeScore = 0;
  visitorScore = 0;


}
