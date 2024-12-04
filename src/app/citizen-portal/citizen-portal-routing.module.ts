import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CitizenDashboardComponent } from './citizen-dashboard/citizen-dashboard.component';
import { CitizenLoginComponent } from './citizen-login/citizen-login.component';
import { CitizenCommonLoginComponent } from './citizen-common-login/citizen-common-login.component';;

import { OdishaoneComponent } from './odishaone/odishaone.component';
import { OdishaonelogoutComponent } from './odishaonelogout/odishaonelogout.component';

import { CitizenAuthGuardGuard } from './citizen-auth-guard.guard';
import { CitizenPortalComponent } from './citizen-portal.component';
import { ProfileUpdateComponent } from './profile-update/profile-update.component';
import { RegistrationComponent } from './registration/registration.component';
import { RegistrationConfirmationComponent } from './registration-confirmation/registration-confirmation.component';
import { SchemeListComponent } from './scheme-list/scheme-list.component';
import { SchemeApplyComponent } from './scheme-apply/scheme-apply.component';
import { SchemePreviewComponent } from './scheme-preview/scheme-preview.component';
import { SuccessComponent } from './success/success.component';
import { TrackstatusComponent } from './trackstatus/trackstatus.component';
import { SchemeDocumentComponent } from './scheme-document/scheme-document.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { ChangeforgotpasswordComponent } from './changeforgotpassword/changeforgotpassword.component';
import { AppliedSchemeDetailsComponent } from './applied-scheme-details/applied-scheme-details.component';
import { UpdateschemestatusComponent } from './updateschemestatus/updateschemestatus.component';
import { UploadPaymentReceiptComponent } from './upload-payment-receipt/upload-payment-receipt.component';
import { ErrorComponent } from '../error/error.component';
import { ServicesListComponent } from './services-list/services-list.component';
import { GetifscCodeComponent } from './getifsc-code/getifsc-code.component';
import { DemoUploadComponent } from './demo-upload/demo-upload.component';
import { SchemeQueryReplyComponent } from './scheme-query-reply/scheme-query-reply.component';
import { AllActivitiesComponent } from './all-activities/all-activities.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { MobilePageComponent } from './mobile-page/mobile-page.component';
import { SchemeDirectorateComponent } from './scheme-directorate/scheme-directorate.component';
import { ServicesDirectorateComponent } from './services-directorate/services-directorate.component';
import { FailureComponent } from './failure/failure.component';
import { SeedDbtApplyComponent } from './seed-dbt-apply/seed-dbt-apply.component';
import { SchemeApplyApicolComponent } from './scheme-apply-apicol/scheme-apply-apicol.component';
import { SchemePreviewApicolComponent } from './scheme-preview-apicol/scheme-preview-apicol.component';
import { SchemeDocumentApicolComponent } from './scheme-document-apicol/scheme-document-apicol.component';

const routes: Routes = [

  {
    path: '', component: CitizenPortalComponent,
    children: [
      { path: '', component: CitizenLoginComponent },
      { path: 'login', component:CitizenLoginComponent },
      { path: 'commonlogin', component:CitizenCommonLoginComponent },
      { path: 'odishaone/:id', component: OdishaoneComponent },
      { path: 'odishaonelogout/:id', component: OdishaonelogoutComponent },
      { path: 'registration', component: RegistrationComponent },
      { path: 'registration-confirmation/:id', component: RegistrationConfirmationComponent },
      { path: 'dashboard', component: CitizenDashboardComponent,canActivate: [CitizenAuthGuardGuard] },
      { path: 'profile-update/:id', component: ProfileUpdateComponent,canActivate: [CitizenAuthGuardGuard] },
      { path: 'scheme-directorate', component: SchemeDirectorateComponent,canActivate: [CitizenAuthGuardGuard] },
      { path: 'service-directorate', component: ServicesDirectorateComponent,canActivate: [CitizenAuthGuardGuard] },
      { path: 'scheme-list/:id', component: SchemeListComponent,canActivate: [CitizenAuthGuardGuard] },
      { path: 'scheme-apply/:id', component: SchemeApplyComponent,canActivate: [CitizenAuthGuardGuard] },
      { path: 'scheme-document/:id', component: SchemeDocumentComponent,canActivate: [CitizenAuthGuardGuard] },
      { path: 'scheme-preview/:id', component: SchemePreviewComponent,canActivate: [CitizenAuthGuardGuard] },
      { path: 'success/:id', component: SuccessComponent,canActivate: [CitizenAuthGuardGuard] },
      { path: 'trackstatus', component: TrackstatusComponent,canActivate: [CitizenAuthGuardGuard] },
      { path: 'changepassword', component: ChangepasswordComponent,canActivate: [CitizenAuthGuardGuard]},
      { path: 'changeforgotpassword/:id', component: ChangeforgotpasswordComponent },
      { path: 'scheme-applied/:id', component: AppliedSchemeDetailsComponent,canActivate: [CitizenAuthGuardGuard] },
      { path: 'updateSchemestatus/:id', component: UpdateschemestatusComponent,canActivate: [CitizenAuthGuardGuard] },

      { path: 'upload-payment-receipt/:id', component: UploadPaymentReceiptComponent,canActivate: [CitizenAuthGuardGuard] },

      { path: 'AllActivities/:id', component: AllActivitiesComponent,canActivate: [CitizenAuthGuardGuard] },
      { path: 'services-list/:id', component: ServicesListComponent,canActivate: [CitizenAuthGuardGuard] },
      { path: 'getifscCode', component: GetifscCodeComponent },
      { path: 'demoUpload', component: DemoUploadComponent },

      { path: 'scheme-query-reply/:id', component: SchemeQueryReplyComponent,canActivate: [CitizenAuthGuardGuard] },
      { path: 'forgotpassword', component: ForgotPasswordComponent },
      { path: 'mobilepage', component: MobilePageComponent },
      { path: 'failure', component: FailureComponent },
      { path: 'seed-apply/:id', component: SeedDbtApplyComponent,canActivate: [CitizenAuthGuardGuard] },
      { path: 'scheme-apply-apicol/:id', component: SchemeApplyApicolComponent,canActivate: [CitizenAuthGuardGuard] },
      { path: 'scheme-document-apicol/:id', component: SchemeDocumentApicolComponent,canActivate: [CitizenAuthGuardGuard] },
      { path: 'scheme-preview-apicol/:id', component: SchemePreviewApicolComponent,canActivate: [CitizenAuthGuardGuard] },
      {
        path: 'apicol',
        loadChildren: () => import('./apicol/apicol.module').then(m => m.ApicolModule)
      },
	  {
        path: 'pmksy',
        loadChildren: () => import('./pmksy/pmksy.module').then(m => m.PmksyModule)
      }
    ]
  },
  {
    path:'**',component:ErrorComponent
  }
  // ,canActivate: [CitizenAuthGuardGuard]
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CitizenPortalRoutingModule { }
