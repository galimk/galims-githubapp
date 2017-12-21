import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { DashboardComponent } from './dashboard/dashboard.component';
import { RepoDetailsComponent } from './repo-details/repo-details.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: ':org', component: DashboardComponent },
  { path: 'repo-details/:repoName', component: RepoDetailsComponent }
];



@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class RoutingModule {}
