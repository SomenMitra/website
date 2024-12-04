import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchemeApplyComponent } from '../apicol/scheme-apply/scheme-apply.component';
import { CitizenAuthGuardGuard } from '../citizen-auth-guard.guard';
import { SchemeDocumentComponent } from '../apicol/scheme-document/scheme-document.component';
import { AppliedSchemeDetailsComponent } from '../apicol/applied-scheme-details/applied-scheme-details.component';
import { UpdateschemestatusComponent } from './updateschemestatus/updateschemestatus.component';
import { SchemePreviewComponent } from '../apicol/scheme-preview/scheme-preview.component';
import { SuccessComponent } from '../apicol/success/success.component';
import { ProfileUpdateComponent } from '../apicol/profile-update/profile-update.component';
import { SchemeQueryReplyComponent } from '../apicol/scheme-query-reply/scheme-query-reply.component';
import { AnnexureApplyComponent } from './annexure-apply/annexure-apply.component';

const routes: Routes = [
  { path: 'scheme-apply/:id', component: SchemeApplyComponent,canActivate: [CitizenAuthGuardGuard] },
  { path: 'annexure-apply/:id', component: AnnexureApplyComponent,canActivate: [CitizenAuthGuardGuard] },
  { path: 'updateSchemestatus/:id', component: UpdateschemestatusComponent,canActivate: [CitizenAuthGuardGuard] },
  { path: 'scheme-applied/:id', component: AppliedSchemeDetailsComponent,canActivate: [CitizenAuthGuardGuard] },
  { path: 'scheme-document/:id', component: SchemeDocumentComponent,canActivate: [CitizenAuthGuardGuard] },
  { path: 'scheme-preview/:id', component: SchemePreviewComponent,canActivate: [CitizenAuthGuardGuard] },
  { path: 'success/:id', component: SuccessComponent,canActivate: [CitizenAuthGuardGuard] },
  { path: 'profile-update/:id', component: ProfileUpdateComponent,canActivate: [CitizenAuthGuardGuard] },
  { path: 'scheme-query-reply/:id', component: SchemeQueryReplyComponent,canActivate: [CitizenAuthGuardGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApicolRoutingModule { }
