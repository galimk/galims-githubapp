import {Component, OnInit, OnDestroy, ViewChild, AfterViewInit} from '@angular/core';
import {GithubService} from "../services/github.service";
import {Router, ActivatedRoute} from '@angular/router';
import {GithubListComponent} from './github-list/github-list.component';
import {FormControl, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  public isAuthenticated: boolean = false;

  public orgName: any;

  public routerSub: any;

  public notFound: boolean;

  @ViewChild('repositories')
  public repositories: GithubListComponent;

  @ViewChild('members')
  public members: GithubListComponent;

  public orgSearchForm = new FormGroup({
    orgName: new FormControl('', Validators.required)
  });


  constructor(private service: GithubService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.setIsAuthenticatedChanged = this.setIsAuthenticatedChanged.bind(this);
    this.organizationSelected = this.organizationSelected.bind(this);
    this.repoSelected = this.repoSelected.bind(this);
    this.activatedRoute = activatedRoute;
    this.service.$authStatusChange.subscribe(this.setIsAuthenticatedChanged);
    this.isAuthenticated = this.service.isAuthenticated();
  }

  setIsAuthenticatedChanged(isAuthenticated) {
    this.isAuthenticated = isAuthenticated;
    if (isAuthenticated) {
      // this timeout to account for when components get initialized and they are not yet bound through viewChild
      setTimeout(() => {
        if (this.orgName != null)
          this.loadMembersAndRepos();
      }, 100);
    }
  }

  organizationSelected(org) {
    this.router.navigate([`/${org.login}`])
  }

  searchOrg(model) {

    let fn = (resp) => {
      if (resp.found) {
        this.orgName = resp.org.login;
        this.notFound = false;
        this.router.navigate([`/${resp.org.login}`])
      } else {
        this.notFound = true;
      }
    };

    fn = fn.bind(this);

    this.service.getOrganization(model.value.orgName).subscribe(fn)
  }

  ngAfterViewInit() {
    this.routerSub = this.activatedRoute.params.subscribe(params => {
      setTimeout(() => {
        // this timeout to avoid angular exception. Did not have enough time to research enough, why it is happening.
        this.orgName = params['org'];
        setTimeout(() => {
          // this timeout to account for when components get initialized and they are not yet bound through viewChild
          this.loadMembersAndRepos();
        }, 100);
      }, 100);
    });

    this.loadMembersAndRepos();
  }

  loadMembersAndRepos() {
    if (this.members && this.repositories) {
      this.members.clearItems();
      this.repositories.clearItems();
      this.members.loadItems(this.orgName);
      this.repositories.loadItems(this.orgName);
    }
  }


  repoSelected(repo) {
    this.router.navigate([`/repo-details/${repo.name}/${repo.owner.login}`])
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
  }
}


