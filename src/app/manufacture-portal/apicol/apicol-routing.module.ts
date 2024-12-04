import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchemeApplyComponent } from '../apicol/scheme-apply/scheme-apply.component';
import { ManufactureAuthGuardGuard } from '../manufacture-auth-guard.guard';
import { SchemeDocumentComponent } from '../apicol/scheme-document/scheme-document.component';
import { AppliedSchemeDetailsComponent } from '../apicol/applied-scheme-details/applied-scheme-details.component';
import { UpdateschemestatusComponent } from './updateschemestatus/updateschemestatus.component';
import { SchemePreviewComponent } from '../apicol/scheme-preview/scheme-preview.component';
import { SuccessComponent } from '../apicol/success/success.component';
import { ProfileUpdateComponent } from '../apicol/profile-update/profile-update.component';
import { SchemeQueryReplyComponent } from '../apicol/scheme-query-reply/scheme-query-reply.component';

const routes: Routes = [
  { path: 'scheme-apply/:id', component: SchemeApplyComponent,canActivate: [ManufactureAuthGuardGuard] },
  { path: 'updateSchemestatus/:id', component: UpdateschemestatusComponent,canActivate: [ManufactureAuthGuardGuard] },
  { path: 'scheme-applied/:id', component: AppliedSchemeDetailsComponent,canActivate: [ManufactureAuthGuardGuard] },
  { path: 'scheme-document/:id', component: SchemeDocumentComponent,canActivate: [ManufactureAuthGuardGuard] },
  { path: 'scheme-preview/:id', component: SchemePreviewComponent,canActivate: [ManufactureAuthGuardGuard] },
  { path: 'success/:id', component: SuccessComponent,canActivate: [ManufactureAuthGuardGuard] },
  { path: 'profile-update/:id', component: ProfileUpdateComponent,canActivate: [ManufactureAuthGuardGuard] },
  { path: 'scheme-query-reply/:id', component: SchemeQueryReplyComponent,canActivate: [ManufactureAuthGuardGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApicolRoutingModule { }
