import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from '../../environments/environment.prod';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private readonly _socketMessages = new BehaviorSubject<any[]>([]);

  readonly socketMessages$ = this._socketMessages.asObservable();

  private controllist: any[] = [];

  private socket;

  get socketMessages(): any[] {
    return this._socketMessages.getValue();
  }
  set socketMessages(val: any[]) {
    this._socketMessages.next(val);
  }

  constructor() { }

  setupSocketConnection() {
    this.socket = io(environment.SOCKET_ENDPOINT, {
      query: {
        token: 'cde',
      },
    });
    this.socket.on('livedata', (data) => {
      let documentData = JSON.stringify(data);
      if (this.controllist.indexOf(documentData) == -1) {
        this.controllist.push(documentData);
        if (data.length == 1) {
          this.socketMessages.pop();
          this.socketMessages.unshift(data[0]);
        }
        else {
          this.socketMessages = this.socketMessages.concat(data);
        }
        data = [];
      }
    });
  }
}
