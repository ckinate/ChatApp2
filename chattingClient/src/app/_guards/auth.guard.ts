import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private _accountService:AccountService, private _toastr: ToastrService) {
    
  }
  canActivate(): Observable<boolean> {
    
    return this._accountService.currentUser$.pipe(
      map(user => {
        if (user) {
          return true;
        }
        else {
          this._toastr.error("You can not pass");
          return false;
        }
       
        
        
     })
   )
  }
  
}
