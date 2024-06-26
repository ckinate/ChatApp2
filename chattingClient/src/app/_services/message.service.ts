import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { getPaginatedResult, getPaginationHeaders } from './paginatedHelper';
import { Message } from '../_models/message';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, take } from 'rxjs';
import { User } from '../_models/user';
import { Group } from '../_models/group';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl
  hubUrl = environment.hubUrl;
  private hubConnection?: HubConnection; 
  private messageThreadSource = new BehaviorSubject<Message[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();

  constructor(private http: HttpClient) { }

  createHubConnection(user: User, otherUsername: string) {
    this.hubConnection = new HubConnectionBuilder()
    .withUrl(this.hubUrl+'message?user='+otherUsername,{
      accessTokenFactory: ()=>user.token
    })
    .withAutomaticReconnect()
      .build();
    this.hubConnection.start().catch(error => console.log(error));

    this.hubConnection.on('ReceiveMessageThread', messages =>{
      this.messageThreadSource.next(messages);
    });


    this.hubConnection.on('NewMessage', message=>{
      this.messageThread$.pipe(take(1)).subscribe({
        next: messages =>{
          this.messageThreadSource.next([...messages, message]);
        }
      })
    });

    this.hubConnection.on('UpdateGroup', (group: Group)=>{
      if(group.connections.some(x=>x.username === otherUsername)){
        this.messageThread$.pipe(take(1)).subscribe({
          next: messages => {
            
            messages.forEach(message =>{
              if(!message.dateRead){
                message.dateRead = new Date(Date.now());
              }
            })
            this.messageThreadSource.next([...messages]);
          }
        })
      }
    });
  }

  stopHubConnection(){
    if(this.hubConnection){
      this.hubConnection.stop();
    }
  }
  
  getMessages(pageNumber:any, pageSize:any,container:any) {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('Container', container);

    return getPaginatedResult<Message[]>(this.baseUrl + 'Messages', params, this.http);
  }
  getMessageThread(username: string) {
    return this.http.get<Message[]>(this.baseUrl + 'Messages/thread/' + username)
  }
  async sendMessage(username: string, content: string) {
    return this.hubConnection?.invoke('SendMessage', {recipientUsername:username, content})
    .catch(error => console.log(error));
   // return this.http.post<Message>(this.baseUrl + 'Messages',{recipientUserName:username, content})
  }
  deleteMessage(id: number) {
    return this.http.delete(this.baseUrl + 'Messages/' + id)
  }
}
