import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule ,HttpClientXsrfModule} from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ErrorComponent } from './error/error.component';
import { NgOtpInputModule } from  'ng-otp-input';
import { ManufacturePortaComponent } from './manufacture-porta/manufacture-porta.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
// import { ScreenReaderComponent } from './screen-reader/screen-reader.component';



@NgModule({
  declarations: [
   AppComponent,
   ErrorComponent,
   ManufacturePortaComponent,
   PrivacyPolicyComponent,
  //  ScreenReaderComponent
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientXsrfModule,
    NgbModule,
    BrowserAnimationsModule,
    NgOtpInputModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
