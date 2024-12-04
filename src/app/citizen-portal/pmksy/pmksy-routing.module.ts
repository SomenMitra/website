import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchemeApplyComponent } from '../pmksy/scheme-apply/scheme-apply.component';
import { CitizenAuthGuardGuard } from '../citizen-auth-guard.guard';
import { SchemeDocumentComponent } from '../pmksy/scheme-document/scheme-document.component';
import { AppliedSchemeDetailsComponent } from '../pmksy/applied-scheme-details/applied-scheme-details.component';
import { UpdateschemestatusComponent } from './updateschemestatus/updateschemestatus.component';
import { SchemePreviewComponent } from '../pmksy/scheme-preview/scheme-preview.component';
import { SuccessComponent } from '../pmksy/success/success.component';
import { ProfileUpdateComponent } from '../pmksy/profile-update/profile-update.component';
import { SchemeQueryReplyComponent } from '../pmksy/scheme-query-reply/scheme-query-reply.component';

const routes: Routes = [
  { path: 'scheme-apply/:id', component: SchemeApplyComponent,canActivate: [CitizenAuthGuardGuard] },
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
export class PmksyRoutingModule { }
