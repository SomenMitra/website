import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClient,HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDateCustomParserFormatter} from './../profile-update/profile-update.component';
import { SchemeApplyComponent } from './scheme-apply/scheme-apply.component';
import { NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

import { environment } from '../../../environments/environment';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {NgxPaginationModule} from 'ngx-pagination';
import { NgOtpInputModule } from 'ng-otp-input';
import { ApicolRoutingModule } from './apicol-routing.module';
import { UpdateschemestatusComponent } from './updateschemestatus/updateschemestatus.component';
import { AppliedSchemeDetailsComponent } from './applied-scheme-details/applied-scheme-details.component';
import { SchemeDocumentComponent } from './scheme-document/scheme-document.component';
import { SchemePreviewComponent } from './scheme-preview/scheme-preview.component';
import { SuccessComponent } from './success/success.component';
import { ProfileUpdateComponent } from '../apicol/profile-update/profile-update.component';
import { SchemeQueryReplyComponent } from '../apicol/scheme-query-reply/scheme-query-reply.component';
import { AnnexureApplyComponent } from './annexure-apply/annexure-apply.component';
import { NoSpecialCharacterAtFirstDirective } from './no-special-character-at-first.directive';



export const HttpLoaderFactory= (http:HttpClient) =>{
  let siteURL= environment.siteURL;
  return new TranslateHttpLoader(http,siteURL+'assets/i18n/','.json')
}



@NgModule({
  declarations: [SchemeApplyComponent, UpdateschemestatusComponent, AppliedSchemeDetailsComponent, SchemeDocumentComponent, SchemePreviewComponent, SuccessComponent, ProfileUpdateComponent, SchemeQueryReplyComponent,AnnexureApplyComponent, NoSpecialCharacterAtFirstDirective],
  imports: [
    CommonModule,
    HttpClientModule,
    ApicolRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
    NgxPaginationModule,
    NgOtpInputModule,
    
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}
   ]
})
export class ApicolModule {


}
