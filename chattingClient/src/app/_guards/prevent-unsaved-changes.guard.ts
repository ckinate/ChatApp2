import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';
import { ConfirmService } from '../_services/confirm.service';

@Injectable({
  providedIn: 'root'
})
export class PreventUnsavedChangesGuard implements CanDeactivate<unknown> {
  constructor(private confirmService: ConfirmService){}
  canDeactivate(
    component: MemberEditComponent):Observable<boolean>| boolean  {
    if (component.editForm.dirty) {
      this.confirmService.confirm();
     // return confirm('Are you sure you want to continue? any unsaved changes will be lost')
    }
    return true;
  }
  
}
