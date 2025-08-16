import { Inject, Injectable } from '@angular/core';
import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { TripDataService } from '../services/trip-data';

@Injectable({
  providedIn: 'root'
})


export class Authentication {

  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage,
    private tripDataService: TripDataService
  ) {}

  // variable to handle Authentication responses
  authResp: AuthResponse = new AuthResponse();

  // Get token from storage provider
  // Name of the key for the token = 'travlr-token'
  public getToken(): string {
    let out: any;
    out = this.storage.getItem('travlr-token');
    // return a string even if there is no token
    if (!out) {
      return '';
    }
    return out;
  }

  // Save token to storage provider
  // Name of the key for the token = 'travlr-token'
  public saveToken(token: string): void {
    this.storage.setItem('travlr-token', token);
  }

  // Logout and remove the JWT from Storage
  public logout() : void {
    this.storage.removeItem('travlr-token');
  }

  // Boolean to determine if token is still valid.
  // Must re-authenticate if token has expired.
  public isLoggedIn() : boolean {
    const token: string = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > (Date.now()/1000);
    } else {
      return false;
    }
  }
  // Retrieve current user Only called after calling method is checked to
  // make sure user isLoggedIn.
  public getCurrentUser(): User {
    const token: string = this.getToken();
    const { email, name } = JSON.parse(atob(token.split('.')[1]));
    return { email, name } as User;
  }

  /** Login method leverages the login method in tripDataService
   *  because it returns an observable, we subscribe to the result and only
   *  process when the Observable condition is satisfied.
   */
  public login(user: User, passwd: string): void {
    this.tripDataService.login(user, passwd)
    .subscribe({
      next: (value: any) => {
        if (value) {
          console.log(value);
          this.authResp = value;
          this.saveToken(this.authResp.token);
        }
      },
      error: (error: any) => {
        console.log('Error: ', error);
      }
    })
  }
  // Register the method that leverages the register method in tripDataService
  // Note: this method is nearly identical to the login method because the
  // behavior of the API logs a new user in immediately upon registration.
  public register(user: User, passwd: string): void {
    this.tripDataService.register(user, passwd)
      .subscribe({
        next: (value: any) => {
          if(value) {
            console.log(value);
            this.authResp = value;
            this.saveToken(this.authResp.token);
          }
        },
        error: (error: any) => {
          console.log('Error: ', error);
        }
      })
  }
}
