import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from './_models/user';
import { AccountService } from './_services/account.service';
import { PresenceService } from './_services/presence.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private http:HttpClient, private _accountService:AccountService, private _presence:PresenceService) {
    
  }
  ngOnInit() {
    this.getUsers();
    this.setCurrentUser();
   
  }
  title = 'chattingClient';

  setCurrentUser() {
    const user: User = JSON.parse(localStorage.getItem('user') as any);
    if (user) {
      this._accountService.setCurrentUser(user);
      this._presence.createHubConnection(user);
    }
   
  }

  getUsers() {
    this.http.get("http://localhost:5251/Users").subscribe({
      next: (res) => {
        console.log(JSON.stringify(res));
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        // Optional: Handle completion logic if needed
      }
    });
  }
}
