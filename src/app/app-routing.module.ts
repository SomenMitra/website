import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErrorComponent } from './error/error.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';


const routes: Routes = [
  {
    path: '', pathMatch: 'full', redirectTo: '/home'
  }, {
    path: 'home',
    loadChildren: () => import('./website/website.module').then(m => m.WebsiteModule)
  },
  {
    path: 'policy',component:PrivacyPolicyComponent,
  },
  {
    path: 'citizen-portal',
    loadChildren: () => import('./citizen-portal/citizen-portal.module').then(m => m.CitizenPortalModule)
  },
  {
    path: 'manufacture-portal',
    loadChildren: () => import('./manufacture-portal/manufacture-portal.module').then(m => m.ManufacturePortalModule)
  },
  {path:'**',component:ErrorComponent}
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
