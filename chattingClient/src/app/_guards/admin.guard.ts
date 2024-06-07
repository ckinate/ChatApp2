import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private accountServoce: AccountService, private toastr: ToastrService) {
    
  }
  canActivate(): Observable<boolean >  {
    return this.accountServoce.currentUser$.pipe(
      map(user => {
        if (user?.roles.includes("Admin" || user.roles.includes('Moderator'))) {
          return true;
        }
        else {
          this.toastr.error('You can not enter this area');
          return false;
        }
        
      })
    );
  }
  
}
