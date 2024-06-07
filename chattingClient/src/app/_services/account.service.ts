import { Injectable } from '@angular/core';
import { ReplaySubject, map } from 'rxjs';
import { User } from '../_models/user';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject< User|null>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private _presence:PresenceService) { }
  
  login(model:any){
    return this.http.post(this.baseUrl + 'Account/login',model).pipe(
      map((response:any)=>{
        const user = response as User;
        if (user) {
          this.setCurrentUser(user);
          this._presence.createHubConnection(user);
        }
      })
    )

  }

 
  
  setCurrentUser(user: User) {
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    localStorage.setItem('user',JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this._presence.stopHubConnection();
  }
 
  register(model:any) {
    return this.http.post(this.baseUrl + 'Account/register', model).pipe(
      map((response:any) => {
        const user = response as User;
        if (user) {
          this.setCurrentUser(user);
          this._presence.createHubConnection(user);
         
        }
       
     })
   )
  }
  getDecodedToken(token:any) {
    return JSON.parse(atob(token.split('.')[1]));
  }
}
