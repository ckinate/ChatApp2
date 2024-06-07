import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  members: Member[] = [];
  pagination: Pagination = {
    currentPage: 1,
    itemsPerPage: 5,
    totalItems: 0,
    totalPages: 0

  }
  userParams!: UserParams;
  user: User = new User();
  genderList = [{value:'female',display:'Males'},{value:'male', display:'Females'}]
  

  constructor(private memberService: MembersService, private toast: ToastrService) {
    this.userParams = this.memberService.getUserParams();
   }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    this.memberService.setUserParams(this.userParams);
    this.memberService.getMembers(this.userParams).subscribe({
      next:(value)=> {
        this.members = value.result; 
        this.pagination = value.pagination;
        console.log(JSON.stringify(value));
      },
      error: (error) => {
        this.toast.error(error);
        console.log(`The error is ${JSON.stringify(error)}`);
      }
    })
  }

  pageChanged(event:any) {
    this.userParams.pageNumber = event.page;
    this.memberService.setUserParams(this.userParams);
    this.loadMembers();
  }
  resetFilters() {
    // this.userParams = new UserParams(this.user);
    this.userParams = this.memberService.resetUserParams();
    this.loadMembers();
  }

}
