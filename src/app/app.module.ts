import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from './modules/shared/shared.module';

import { JwtInterceptor } from './core/interceptors/jwt.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,     // Required for HttpClient in all services
    AppRoutingModule,
    SharedModule          // Gives AppComponent access to NotificationComponent
  ],
  providers: [
    // Register JwtInterceptor globally — runs on every HttpClient request
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true           // multi:true allows multiple interceptors to coexist
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
