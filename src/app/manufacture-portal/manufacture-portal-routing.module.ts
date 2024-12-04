import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManufactureDashboardComponent } from './manufacture-dashboard/manufacture-dashboard.component';
import { CitizenLoginComponent } from './citizen-login/citizen-login.component';

import { OdishaoneComponent } from './odishaone/odishaone.component';
import { OdishaonelogoutComponent } from './odishaonelogout/odishaonelogout.component';

import { ManufactureAuthGuardGuard } from './manufacture-auth-guard.guard';
import { ManufacturePortalComponent } from './manufacture-portal.component';
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
import { ItemPriceComponent } from './item-price/item-price.component';
import { MasterItemPriceComponent } from './master-item-price/master-item-price.component';
import { UpdateBoqComponent } from './update-boq/update-boq.component';
import { ManufacturePriceComponent } from './manufacture-price/manufacture-price.component';
import { MIDashboardComponent } from './mi-dashboard/mi-dashboard.component';
import { MiBlockdetailsComponent } from './mi-blockdetails/mi-blockdetails.component';
import { ReferenceNumberLoginComponent } from './reference-number-login/reference-number-login.component';
import { ManufactureDocumentUploadComponent } from './manufacture-document-upload/manufacture-document-upload.component';
import { ManufactureApplyComponent } from './manufacture-apply/manufacture-apply.component';
import { ManufacturePreviewComponent } from './manufacture-preview/manufacture-preview.component';
import { ManufactureReapplyComponent } from './manufacture-reapply/manufacture-reapply.component';

const routes: Routes = [

  {
    path: '', component: ManufacturePortalComponent,
    children: [
      { path: '', component: CitizenLoginComponent },
      { path: 'login', component: CitizenLoginComponent },
      { path: 'odishaone/:id', component: OdishaoneComponent },
      { path: 'odishaonelogout/:id', component: OdishaonelogoutComponent },
      { path: 'registration', component: RegistrationComponent },
      { path: 'registration-confirmation/:id', component: RegistrationConfirmationComponent },
      { path: 'mi-dashboard/:id', component: ManufactureDashboardComponent,canActivate: [ManufactureAuthGuardGuard] },
      { path: 'profile-update/:id', component: ProfileUpdateComponent,canActivate: [ManufactureAuthGuardGuard] },
      { path: 'scheme-directorate', component: SchemeDirectorateComponent,canActivate: [ManufactureAuthGuardGuard] },
      { path: 'service-directorate', component: ServicesDirectorateComponent,canActivate: [ManufactureAuthGuardGuard] },
      { path: 'scheme-list/:id', component: SchemeListComponent,canActivate: [ManufactureAuthGuardGuard] },
      { path: 'scheme-apply/:id', component: SchemeApplyComponent,canActivate: [ManufactureAuthGuardGuard] },
      { path: 'scheme-document/:id', component: SchemeDocumentComponent,canActivate: [ManufactureAuthGuardGuard] },
      { path: 'scheme-preview/:id', component: SchemePreviewComponent,canActivate: [ManufactureAuthGuardGuard] },
      { path: 'success/:id', component: SuccessComponent,canActivate: [ManufactureAuthGuardGuard] },
      { path: 'trackstatus', component: TrackstatusComponent,canActivate: [ManufactureAuthGuardGuard] },
      { path: 'changepassword', component: ChangepasswordComponent,canActivate: [ManufactureAuthGuardGuard]},
      { path: 'changeforgotpassword/:id', component: ChangeforgotpasswordComponent },
      { path: 'scheme-applied/:id', component: AppliedSchemeDetailsComponent,canActivate: [ManufactureAuthGuardGuard] },
      { path: 'updateSchemestatus/:id', component: UpdateschemestatusComponent,canActivate: [ManufactureAuthGuardGuard] },

      { path: 'upload-payment-receipt/:id', component: UploadPaymentReceiptComponent,canActivate: [ManufactureAuthGuardGuard] },

      { path: 'AllActivities/:id', component: AllActivitiesComponent,canActivate: [ManufactureAuthGuardGuard] },
      { path: 'services-list/:id', component: ServicesListComponent,canActivate: [ManufactureAuthGuardGuard] },
      { path: 'getifscCode', component: GetifscCodeComponent },
      { path: 'demoUpload', component: DemoUploadComponent },

      { path: 'scheme-query-reply/:id', component: SchemeQueryReplyComponent,canActivate: [ManufactureAuthGuardGuard] },
      { path: 'forgotpassword', component: ForgotPasswordComponent },
      { path: 'mobilepage', component: MobilePageComponent },
      { path: 'failure', component: FailureComponent },
      { path: 'seed-apply/:id', component: SeedDbtApplyComponent,canActivate: [ManufactureAuthGuardGuard] },
      { path: 'scheme-apply-apicol/:id', component: SchemeApplyApicolComponent,canActivate: [ManufactureAuthGuardGuard] },
      { path: 'scheme-document-apicol/:id', component: SchemeDocumentApicolComponent,canActivate: [ManufactureAuthGuardGuard] },
      { path: 'scheme-preview-apicol/:id', component: SchemePreviewApicolComponent,canActivate: [ManufactureAuthGuardGuard] },
      { path: 'item-price', component: ItemPriceComponent,canActivate: [ManufactureAuthGuardGuard] },
      { path: 'master-item-price', component: MasterItemPriceComponent,canActivate: [ManufactureAuthGuardGuard] },
      { path: 'update-boq/:id', component: UpdateBoqComponent,canActivate: [ManufactureAuthGuardGuard] },
      { path: 'manufacture-price', component: ManufacturePriceComponent,canActivate: [ManufactureAuthGuardGuard] },
      { path: 'mi-dashboard', component: MIDashboardComponent,canActivate: [ManufactureAuthGuardGuard]},
      { path: 'mi-blockdetails/:id', component: MiBlockdetailsComponent, canActivate: [ManufactureAuthGuardGuard] },
      { path: 'manufacture-re-register', component: ManufactureReapplyComponent, canActivate: [ManufactureAuthGuardGuard] },
      { path: 'reference-login', component: ReferenceNumberLoginComponent},
      { path: 'manufacture-doc-upload/:id', component: ManufactureDocumentUploadComponent },
      { path: 'manufacture-applied/:id', component: ManufactureApplyComponent },
      { path: 'manufacture-preview/:id', component: ManufacturePreviewComponent },
      
      
      {
        path: 'apicol',
        loadChildren: () => import('./apicol/apicol.module').then(m => m.ApicolModule)
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
export class ManufacturePortalRoutingModule { }
