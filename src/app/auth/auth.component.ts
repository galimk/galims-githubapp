import { Component, AfterViewInit } from '@angular/core';
import { GithubService} from "../services/github.service";
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
@Component({
  selector: 'auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements AfterViewInit{
  public authForm = new FormGroup({
    token: new FormControl('', Validators.required)
  });

  public login: string = null;
  public errorState: string = null;

  constructor(private service: GithubService, private router: Router) { }

  public authenticate (authModel) {
    this.service.authenticate(authModel.value.token).subscribe(resp => {
      if (resp.isSuccess) {
        this.login = resp.login;
        this.errorState = null;
      } else {
        this.errorState = 'Invalid Token!';
      }
    });
  }

  public ngAfterViewInit() {
    setTimeout(() => {
      if (this.login == null && this.service.isAuthenticated()) {
        this.login = this.service.getCurrentLogin();
      }
    }, 100);
  }

  public logOut() {
    this.login = null;
    this.service.logOut();
    this.router.navigate(['']);
  }
}

