import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Observable, ReplaySubject } from 'rxjs';
import { User } from '../_models/user';
import { Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};

 

  constructor(public _accountService: AccountService, private _router: Router, private _toastr: ToastrService) { }

  ngOnInit(): void {
    
  }

  login() {
    console.log(`The Login Details is ${JSON.stringify(this.model)}`);
    this._accountService.login(this.model).subscribe({
      next: (res) => {
        console.log(JSON.stringify(res));
        this._router.navigateByUrl('/members');
      
      },
      error: (error) => {
        console.log(error);
      //  this._toastr.error(error.error);
      },
      complete: () => {
        
      }
    })
    
  }
  logOut() {
    this._accountService.logout();
    this._router.navigateByUrl('/');
  
  }
 

}
