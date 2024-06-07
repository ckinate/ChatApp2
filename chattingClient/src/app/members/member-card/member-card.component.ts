import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css'],

})
export class MemberCardComponent implements OnInit {

  constructor(private memberService: MembersService, private toastr: ToastrService,
    public presenceService: PresenceService
  ) { 

  }

  @Input() member: Member = {
    id: 0,
    username: '',
    photoUrl: null,
    age: 0,
    knownAs: null,
    created: new Date(),
    lastActive: new Date(),
    gender: null,
    introduction: null,
    lookingFor: null,
    interests: null,
    city: null,
    country: null,
    photos: null,
  } ;

  ngOnInit(): void {
  }

  addLike(member:Member) {
    this.memberService.addLike(member.username).subscribe(() => {
      this.toastr.success(`You have liked  ${member.knownAs}`);
    })
  }

}
