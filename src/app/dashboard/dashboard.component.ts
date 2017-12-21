import {Component} from '@angular/core';
import {GithubService} from "../services/github.service";

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  public isAuthenticated: boolean = false;
  // I would probably separate organizations, members, repositories in separate components
  // maybe would even create one generic component, since they are similar

  public lastSeenOrgId: null;
  public lastSeenRepoId: null;

  public organizations = [];
  public members = [];
  public repositories = [];
  public selectedOrg = null;

  constructor(private service: GithubService) {
    this.isAuthenticatedChanged = this.isAuthenticatedChanged.bind(this);
    service.$authStatusChange.subscribe(this.isAuthenticatedChanged);
  }

  isAuthenticatedChanged() {
    console.log('event emmited!');
    this.isAuthenticated = this.service.isAuthenticated();
    if (this.isAuthenticated) {
      this.loadOrganizations();
    } else {
      this.clearData();
    }
  }

  clearData() {
    this.organizations = [];
    this.selectedOrg = null;
    this.lastSeenOrgId = null;
    this.clearDependentItems();
  }

  clearDependentItems() {
    this.members = [];
    this.repositories = [];
    this.lastSeenRepoId = null;
  }

  loadOrganizations() {
    this.service.listOrganizations(this.lastSeenId).subscribe((data) => {
      for (let item of data) {
        this.organizations.push(item);
      }

      if (data.length > 0)
        this.lastSeenId = data[data.length - 1].id;
    })
  }

  viewOrganizationDetails(orgDetails) {
    this.selectedOrg = orgDetails;
    this.clearDependentItems();
    this.loadRepositories();
    this.loadMembers();
  }

  loadRepositories() {
    this.service.listRepositories(this.lastSeenRepoId, this.selectedOrg).subscribe((data) => {
      for (let repo of data) {
        this.repositories.push(repo);
      }

      if (data.length > 0)
        this.lastSeenRepoId = data[data.length - 1].id;
    });
  }

  loadMembers() {

  }
}


