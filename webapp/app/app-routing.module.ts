import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './game/game.component';
import { TeamComponent } from './team/team.component';

const routes: Routes = [
  { path: 'game',  component: GameComponent },
  { path: 'team', component: TeamComponent },
  { path: '', redirectTo: '/game', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}