import {Component, AfterViewInit, OnDestroy} from '@angular/core';
import {GithubService} from "../services/github.service";
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'repo-details',
  templateUrl: './repo-details.component.html',
  styleUrls: ['./repo-details.component.scss']
})
export class RepoDetailsComponent implements AfterViewInit, OnDestroy {
  private routerSub: any;
  public description: string;
  public name: string;
  public issuesCount: number;
  public starGazers = [];

  constructor(private service: GithubService, private router: Router, private activatedRoute: ActivatedRoute) {

  }

  ngAfterViewInit() {
    this.routerSub = this.activatedRoute.params.subscribe(params => {
      setTimeout(() => {
        this.loadDetails(params['ownerName'], params['repoName']);
      }, 100);
    });

  }

  loadDetails(owner, repo) {
    this.service.getRepoInfo(owner, repo).subscribe((repo) => {
      this.description = repo.description;
      this.issuesCount = repo.open_issues_count;
      this.name = repo.name;
    });

    this.service.getRepoStargazers(owner, repo).subscribe((data) => {
      this.starGazers = [];

      console.log(data);
      for (let startGazer of data) {
        if (this.starGazers.length == 3)
          break;
        this.starGazers.push(startGazer);
      }

      console.log(this.starGazers);
    });
  }


  ngOnDestroy() {
    this.routerSub.unsubscribe();
  }

  goBack() {
    window.history.back();
  }
}


