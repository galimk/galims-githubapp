import { Component } from '@angular/core';
import { GithubService} from "../services/github.service";
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  public authForm = new FormGroup({
    token: new FormControl('', Validators.required)
  });

  public login: string = null;
  public errorState: string = null;

  constructor(private service: GithubService) { }

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

  public logOut() {
    this.login = null;
    this.service.logOut();
  }
}

