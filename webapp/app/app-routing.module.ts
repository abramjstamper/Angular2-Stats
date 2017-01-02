import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameModuleComponent } from './gameModule/gameModule.component';
import { TeamComponent } from './team/team.component';

const routes: Routes = [
  { path: 'game',  component: GameModuleComponent },
  { path: 'team', component: TeamComponent },
  { path: '', redirectTo: '/game', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}