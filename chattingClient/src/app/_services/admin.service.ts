import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { Photo } from '../_models/member';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUserWithRoles(){
    return this.http.get<User[]>(this.baseUrl+"Admin/users-with-roles");
  }
  updateUserRoles(username: string, roles: string[]){
    return this.http.post<string[]>(this.baseUrl+'Admin/edit-roles/'+username+'?roles='+roles,{});
  }

  getPhotoForApproval(){
    return this.http.get<Photo[]>(this.baseUrl+'Admin/photos-to-moderate');
  }

  approvePhoto(photoId: number){
    return this.http.post(this.baseUrl+'Admin/approve-photo/'+photoId, {});
  }
  
  rejectPhoto(photoId: number){
    return this.http.post(this.baseUrl+'admin/reject-photo/'+photoId, {});
  }
}
