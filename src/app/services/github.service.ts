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

  logOut() {
    this.token = null;
    this.$authStatusChange.emit({isLoggedIn: false});
  }

  listOrganizations(lastSeenId: null) {
    return this.listGithub(this.http.get(lastSeenId == null ?
      `${this.baseUri}organizations` :
      `${this.baseUri}organizations?since=${lastSeenId}`));
  }

  listRepositories(lastSeenId: null, org) {
    return this.listGithub(this.http.get(lastSeenId == null ?
      `${this.baseUri}orgs/${org.login}/repos` :
      `${this.baseUri}orgs/${org.login}/repos?since=${lastSeenId}`));
  }

  listMembers(lastSeenId: null, org) {
    return this.listGithub(this.http.get(lastSeenId == null ?
      `${this.baseUri}orgs/${org.login}/members` :
      `${this.baseUri}orgs/${org.login}/members?since=${lastSeenId}`));
  }

  listGithub(request) {
    return Observable.create(observer => {
      request.subscribe(function (data) {
        observer.next(data);
      });
    });
  }
}


