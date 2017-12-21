import { Component } from '@angular/core';
import {GithubService} from "../services/github.service";

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  public isAuthenticated: boolean = false;
  public lastSeenId: null;
  public organizations = [];

  constructor(private service: GithubService) {

    this.isAuthenticatedChanged = this.isAuthenticatedChanged.bind(this);
    service.$authStatusChange.subscribe(this.isAuthenticatedChanged );

  }


  isAuthenticatedChanged() {
    console.log('event emmited!');
    this.isAuthenticated = this.service.isAuthenticated();

    if (this.isAuthenticated) {

    }
  }

  clearData() {

  }

  loadData() {
    this.service.listOrganizations(this.lastSeenId).subscribe(function() {

    })
  }
}


