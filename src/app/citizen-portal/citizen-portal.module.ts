import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CitizenPortalRoutingModule } from './citizen-portal-routing.module';
import { CitizenLoginComponent } from './citizen-login/citizen-login.component';
import { CitizenCommonLoginComponent } from './citizen-common-login/citizen-common-login.component';
import { CitizenDashboardComponent } from './citizen-dashboard/citizen-dashboard.component';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CitizenHeaderComponent } from './citizen-header/citizen-header.component';
import { CitizenFooterComponent } from './citizen-footer/citizen-footer.component';

import { CitizenPortalComponent } from './citizen-portal.component';
import { ProfileUpdateComponent,NgbDateCustomParserFormatter} from './profile-update/profile-update.component';
import { RegistrationComponent } from './registration/registration.component';
import { RegistrationConfirmationComponent } from './registration-confirmation/registration-confirmation.component';



import { SchemeListComponent } from './scheme-list/scheme-list.component';
import { SchemeApplyComponent } from './scheme-apply/scheme-apply.component';
import { SchemePreviewComponent } from './scheme-preview/scheme-preview.component';
import { SuccessComponent } from './success/success.component';
import { TrackstatusComponent } from './trackstatus/trackstatus.component';
import { SchemeDocumentComponent } from './scheme-document/scheme-document.component';
import { SchemeTabComponent } from './scheme-tab/scheme-tab.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { AppliedSchemeDetailsComponent } from './applied-scheme-details/applied-scheme-details.component';

import { UpdateschemestatusComponent } from './updateschemestatus/updateschemestatus.component';
import { ServicesListComponent } from './services-list/services-list.component';
import { GetifscCodeComponent } from './getifsc-code/getifsc-code.component';
import { NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DemoUploadComponent } from './demo-upload/demo-upload.component';

import { environment } from '../../environments/environment';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {NgxPaginationModule} from 'ngx-pagination';
import { BlockCopyPasteDirective } from './directive-validations/block-copy-paste.directive';
import { SchemeQueryReplyComponent } from './scheme-query-reply/scheme-query-reply.component';
import { AllActivitiesComponent } from './all-activities/all-activities.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { MobilePageComponent } from './mobile-page/mobile-page.component';
import { UploadPaymentReceiptComponent } from './upload-payment-receipt/upload-payment-receipt.component';
import { SchemeDirectorateComponent } from './scheme-directorate/scheme-directorate.component';
import { ServicesDirectorateComponent } from './services-directorate/services-directorate.component';
import { FailureComponent} from './failure/failure.component';
import { ChangeforgotpasswordComponent } from './changeforgotpassword/changeforgotpassword.component';
import { SeedDbtApplyComponent } from './seed-dbt-apply/seed-dbt-apply.component';
import { SchemeApplyApicolComponent } from './scheme-apply-apicol/scheme-apply-apicol.component';
import { SchemePreviewApicolComponent } from './scheme-preview-apicol/scheme-preview-apicol.component';
import { SchemeDocumentApicolComponent } from './scheme-document-apicol/scheme-document-apicol.component';
import { OdishaoneComponent } from './odishaone/odishaone.component';
import { OdishaonelogoutComponent } from './odishaonelogout/odishaonelogout.component';
import { NoSpecialCharAtFirstDirective } from '../no-special-char-at-first.directive';




export const HttpLoaderFactory= (http:HttpClient) =>{
  let siteURL= environment.siteURL;
  return new TranslateHttpLoader(http,siteURL+'assets/i18n/','.json')
}



@NgModule({
  declarations: [CitizenLoginComponent, CitizenCommonLoginComponent, CitizenDashboardComponent, CitizenHeaderComponent, CitizenFooterComponent,  CitizenPortalComponent, ProfileUpdateComponent, RegistrationComponent, RegistrationConfirmationComponent,
    SchemeListComponent,SchemeApplyComponent, SchemePreviewComponent, SuccessComponent, TrackstatusComponent, SchemeDocumentComponent, SchemeTabComponent, ChangepasswordComponent, AppliedSchemeDetailsComponent,  UpdateschemestatusComponent, ServicesListComponent, GetifscCodeComponent, DemoUploadComponent, BlockCopyPasteDirective, AllActivitiesComponent, SchemeQueryReplyComponent, ForgotPasswordComponent, MobilePageComponent, UploadPaymentReceiptComponent, SchemeDirectorateComponent, ServicesDirectorateComponent, FailureComponent, ChangeforgotpasswordComponent, SeedDbtApplyComponent, SchemeApplyApicolComponent, SchemePreviewApicolComponent, SchemeDocumentApicolComponent, OdishaoneComponent, OdishaonelogoutComponent,
    NoSpecialCharAtFirstDirective],
  imports: [
    CommonModule,
    HttpClientModule,
    CitizenPortalRoutingModule,
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
export class CitizenPortalModule {


}
