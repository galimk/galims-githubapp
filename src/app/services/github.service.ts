import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EventEmitter} from '@angular/core';

interface IGithubUser {
  login: string,
}

@Injectable()
export class GithubService {
  baseUri = "https://api.github.com/";
  token: string;
  $authStatusChange: EventEmitter<any> = new EventEmitter();


  constructor(private http: HttpClient) {
    this.token = window.localStorage.getItem('token');
  }

  authenticate(token: string) {
    return Observable.create(observer => {
      let request = this.http.get(`${this.baseUri}?access_token=${token}`);
      return request.subscribe((data: any) => {
        let userRequest = this.http.get(`https://api.github.com/user?access_token=${token}`);
        userRequest.subscribe((userData: any) => {
          observer.next(<IGithubUser>{
            login: userData.login,
            isSuccess: true
          });

          this.token = token;
          this.$authStatusChange.emit({isLoggedIn: true});
          window.localStorage.setItem('token', this.token)
          window.localStorage.setItem('login', userData.login);

        }, () => {
          debugger;
          observer.next({
            isSuccess: false
          })
        });
      }, error => {
        observer.next({
          isSuccess: false
        })
      });
    });
  }

  isAuthenticated() {
    return this.token != null;
  }

  getCurrentLogin() {
    return window.localStorage.getItem('login');
  }

  logOut() {
    this.token = null;
    this.$authStatusChange.emit({isLoggedIn: false});
    window.localStorage.removeItem('token');
  }

  listOrganizations(lastSeenId: null) {
    return this.listGithub(this.http.get(lastSeenId == null ?
      `${this.baseUri}organizations` :
      `${this.baseUri}organizations?since=${lastSeenId}`));
  }

  listRepositories(page: number, orgName) {
    return this.listGithub(this.http.get(page == null ?
      `${this.baseUri}orgs/${orgName}/repos` :
      `${this.baseUri}orgs/${orgName}/repos?page=${page}`));
  }

  listMembers(page: number, orgName) {
    return this.listGithub(this.http.get(page == null ?
      `${this.baseUri}orgs/${orgName}/members` :
      `${this.baseUri}orgs/${orgName}/members?page=${page}`));
  }

  getRepoInfo(owner, repoName) {
    return this.listGithub(this.http.get(`${this.baseUri}repos/${owner}/${repoName}`));
  }

  getRepoStargazers(owner, repoName) {
    return this.listGithub(this.http.get(`${this.baseUri}repos/${owner}/${repoName}/stargazers`));
  }

  listGithub(request) {
    return Observable.create(observer => {
      request.subscribe(function (data) {
        observer.next(data);
      });
    });
  }

  getOrganization(org) {
    return Observable.create(observer => {
      let request = this.http.get(`${this.baseUri}orgs/${org}`);
      request.subscribe(function (data) {
        observer.next({
          found: true,
          org: data
        });
      }, () => {
        observer.next({
          found: false
        });
      });
    });
  }
}


