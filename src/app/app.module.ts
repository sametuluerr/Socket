import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { NavComponent } from './nav/nav.component';

import { SocketService } from './services/socket.service';

@NgModule({
  declarations: [AppComponent, MainComponent, NavComponent],
  imports: [BrowserModule, AppRoutingModule, NgbModule, NgxJsonViewerModule],
  providers: [SocketService],
  bootstrap: [AppComponent],
})
export class AppModule { }
