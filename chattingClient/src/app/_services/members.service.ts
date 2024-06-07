import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { map, of, take } from 'rxjs';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';
import { User } from '../_models/user';
import { getPaginatedResult, getPaginationHeaders } from './paginatedHelper';

// const userString = localStorage.getItem('user');
// const userToken = userString ? JSON.parse(userString).token : '';

// const httpOptions = {
//   headers: new HttpHeaders({
//     Authorization: 'Bearer ' + userToken
//   })
// }

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  memberCache = new Map();
  userParams!: UserParams;
  user: User = new User();


  constructor(private http: HttpClient, private accountService: AccountService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user!;
      this.userParams = new UserParams(user!);
      
    })
  }

  getUserParams() {
    return this.userParams;
  }
  setUserParams(params:UserParams) {
    this.userParams = params;
  }
  resetUserParams() {
    this.userParams = new UserParams(this.user);

    return this.userParams;
  }

  getMembers(userParams: UserParams) {

    // check if there is members in the cache and get it using the key
    var response = this.memberCache.get(Object.values(userParams).join('-'));
    if (response) {
      return of(response);
    }
    // go to the server to get the members if it is not in cache
    let params = getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);
   
    return getPaginatedResult<Member[]>(this.baseUrl + 'Users', params, this.http).pipe(map(response => {
      //using pipe to transform the response so as to store it in the member cache
      this.memberCache.set(Object.values(userParams).join('-'), response);

      return response;
    }));
  }

 
  getMember(username: string) {
    
    // to get the member from cache if it is there
    const member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((member: Member) => member.username == username);
    if (member) {
      return of(member);
    }
    
    return this.http.get<Member>(this.baseUrl + 'Users/' + username);
    
  }
  updateMember(member: Member) {
    
    return this.http.put(this.baseUrl + 'Users',member);
  }
  setMainPhoto(photoId:number) {
    
    return this.http.put(this.baseUrl + 'Users/set-main-photo/' + photoId, {});
  }
  deletePhoto(photoId:number) {
    return this.http.delete(this.baseUrl + 'Users/delete-photo/' + photoId);
  }

  addLike(username: string) {
    return this.http.post(this.baseUrl + 'Likes/' + username, {});
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number) {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('predicate', predicate);

    return getPaginatedResult<Partial<Member[]>>(this.baseUrl + 'Likes', params, this.http);
   
  }


 
}
