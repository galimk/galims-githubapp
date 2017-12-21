import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AuthComponent} from './auth/auth.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {RepoDetailsComponent} from './repo-details/repo-details.component';
import {GithubService} from './services/github.service';
import {RoutingModule} from './app.routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

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
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    GithubService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
