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

        });
      }, () => {
        observer.next({
          isSuccess: false
        })
      }, () => {
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
    return Observable.create(observer => {
      let request = this.http.get(lastSeenId == null ? `${this.baseUri}organizations`
        : `${this.baseUri}organizations?since=${lastSeenId}`);

      request.subscribe(function (data) {
        observer.next(data);
      });
    });
  }
}


/*


 "https://api.github.com/authorizations"
 code_search_url
 :
 "https://api.github.com/search/code?q={query}{&page,per_page,sort,order}"
 commit_search_url
 :
 "https://api.github.com/search/commits?q={query}{&page,per_page,sort,order}"
 current_user_authorizations_html_url
 :
 "https://github.com/settings/connections/applications{/client_id}"
 current_user_repositories_url
 :
 "https://api.github.com/user/repos{?type,page,per_page,sort}"
 current_user_url
 :
 "https://api.github.com/user"
 emails_url
 :
 "https://api.github.com/user/emails"
 emojis_url
 :
 "https://api.github.com/emojis"
 events_url
 :
 "https://api.github.com/events"
 feeds_url
 :
 "https://api.github.com/feeds"
 followers_url
 :
 "https://api.github.com/user/followers"
 following_url
 :
 "https://api.github.com/user/following{/target}"
 gists_url
 :
 "https://api.github.com/gists{/gist_id}"
 hub_url
 :
 "https://api.github.com/hub"
 issue_search_url
 :
 "https://api.github.com/search/issues?q={query}{&page,per_page,sort,order}"
 issues_url
 :
 "https://api.github.com/issues"
 keys_url
 :
 "https://api.github.com/user/keys"
 notifications_url
 :
 "https://api.github.com/notifications"
 organization_repositories_url
 :
 "https://api.github.com/orgs/{org}/repos{?type,page,per_page,sort}"
 organization_url
 :
 "https://api.github.com/orgs/{org}"
 public_gists_url
 :
 "https://api.github.com/gists/public"
 rate_limit_url
 :
 "https://api.github.com/rate_limit"
 repository_search_url
 :
 "https://api.github.com/search/repositories?q={query}{&page,per_page,sort,order}"
 repository_url
 :
 "https://api.github.com/repos/{owner}/{repo}"
 starred_gists_url
 :
 "https://api.github.com/gists/starred"
 starred_url
 :
 "https://api.github.com/user/starred{/owner}{/repo}"
 team_url
 :
 "https://api.github.com/teams"
 user_organizations_url
 :
 "https://api.github.com/user/orgs"
 user_repositories_url
 :
 "https://api.github.com/users/{user}/repos{?type,page,per_page,sort}"
 user_search_url
 :
 "https://api.github.com/search/users?q={query}{&page,per_page,sort,order}"
 user_url
 :
 "https://api.github.com/users/{user}"


 */


