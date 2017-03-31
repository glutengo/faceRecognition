import { Injectable } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AuthService {

  private token: string;
  private _user: BehaviorSubject<any>;
  private dataStore;
  user: Observable<any>;


  constructor(private storage: LocalStorageService, private router: Router){
    this.init();
  }

  private init() {
    // create observable and subject
    this.dataStore = { user: {}};
    this._user = <BehaviorSubject<any>>new BehaviorSubject({});
    this.user = this._user.asObservable();
    this.setToken(''+this.storage.get('token'));
    this.setUser(this.storage.get('user'));
  }

  setToken(token: string) {
    this.token = token;
    this.storage.set('token', token);
  }

  getToken(): string {
    return this.token;
  }

  setUser(user) {
    this.dataStore.user = user;
    this._user.next(Object.assign({}, this.dataStore).user);
    this.storage.set('user', user);
  }

  getUser() {
    return this.dataStore.user;
  }

  logout() {
    this.setUser(undefined);
    this.storage.remove('token');
    this.storage.remove('user');
    this.router.navigate(['login']);
  }

}
