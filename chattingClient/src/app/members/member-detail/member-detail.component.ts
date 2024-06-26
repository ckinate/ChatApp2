
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { MessageService } from 'src/app/_services/message.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit,OnDestroy {

  @ViewChild('memberTabs',{static:true}) memberTabs!:TabsetComponent

  member: Member = {
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
  };
  
  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];
  activeTab!: TabDirective;
  messages: Message[] = [];
  user:User = new User();

  constructor(private memberService: MembersService, private route: ActivatedRoute, private messageService: MessageService,
    public presenceService: PresenceService, private accountService: AccountService, private router: Router
  ) { 
    accountService.currentUser$.pipe(take(1)).subscribe({
      next: user =>{
        if(user){
          this.user = user;
        }
      }
    })
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }
  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.member = data['member'];
    });
    //this.loadMember();
    this.route.queryParams.subscribe(params => {
      params['tab'] ? this.selectTab(params['tab']) : this.selectTab(0);
    });
    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview:false
      }
    ]

    this.galleryImages = this.getImages();

   
  }

  getImages():NgxGalleryImage[] {
    const imageUrls = [];
    for (const photo of this.member.photos!){
      imageUrls.push({
        small: photo?.url,
        medium: photo?.url,
        big:photo?.url
      })
    }
    return imageUrls as any;
  }
  // loadMember() {
  //   this.memberService.getMember(this.route.snapshot.paramMap.get('username') as any).subscribe(member => {
  //     this.member = member;
    
  //   })
  // }
  loadMessages() {
    this.messageService.getMessageThread(this.member.username).subscribe(response => {
      this.messages = response;
    })
  }
  selectTab(tabId:number) {
    this.memberTabs.tabs[tabId].active = true;
  }
  onTabActivated(data:TabDirective) {
    this.activeTab = data;

    if (this.activeTab.heading === 'Meessages' && this.messages.length === 0) {
      // this.loadMessages();
      this.messageService.createHubConnection(this.user, this.member.username);
    }
    else {
      this.messageService.stopHubConnection();
    }
  }

}
