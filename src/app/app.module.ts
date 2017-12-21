import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AuthComponent} from './auth/auth.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {RepoDetailsComponent} from './repo-details/repo-details.component';
import {GithubService} from './services/github.service';
import {AuthTokenService} from './services/auth-token.service';
import {RoutingModule} from './app.routing.module';


import {AppComponent} from './app.component';


@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    DashboardComponent,
    RepoDetailsComponent
  ],
  imports: [
    RoutingModule,
    BrowserModule,

  ],
  providers: [
    GithubService,
    AuthTokenService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
