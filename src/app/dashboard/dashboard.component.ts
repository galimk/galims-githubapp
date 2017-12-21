import {Component, OnInit, OnDestroy} from '@angular/core';
import {GithubService} from "../services/github.service";
import {Router, ActivatedRoute} from '@angular/router';


@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  public isAuthenticated: boolean = false;

  public orgName: any;

  public routerSub: null;

  constructor(private service: GithubService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.isAuthenticatedChanged = this.isAuthenticatedChanged.bind(this);
    this.organizationSelected = this.organizationSelected.bind(this);
    this.activatedRoute = activatedRoute;
    service.$authStatusChange.subscribe(this.isAuthenticatedChanged);
  }

  isAuthenticatedChanged() {
    this.isAuthenticated = this.service.isAuthenticated();
  }

  organizationSelected(org) {
    this.router.navigate([`/${org.login}`])
  }

  ngOnInit() {
    this.routerSub = this.activatedRoute.params.subscribe(params => {
      console.log(params);
      this.orgName = params['org'];
      console.log(this.orgName);
      this.isAuthenticatedChanged();
    });
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
  }
}


