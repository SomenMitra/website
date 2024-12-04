import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { DatePickerComponent } from './date-picker/date-picker.component';
import { HomePageComponent } from './home-page/home-page.component';
import { SchemeListComponent } from './scheme-list/scheme-list.component';
import { WebsiteComponent } from './website.component';
import { ContentComponent } from './content/content.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { ErrorComponent } from '../error/error.component';
import { SearchComponent } from './search/search.component';
import { AnnouncemntsComponent } from './announcemnts/announcemnts.component';
import { AnnouncemntDetailsComponent } from './announcemnt-details/announcemnt-details.component';
import { ServicesComponent } from './services/services.component';
import { HowToApplyComponent } from './how-to-apply/how-to-apply.component';
import { KnowYourStatusComponent } from './know-your-status/know-your-status.component';
import { BlankComponent } from './blank/blank.component';
import { FaqComponent } from './faq/faq.component';
import { HowToUseComponent } from './how-to-use/how-to-use.component';
import { SeedDbtDemoComponent } from './seed-dbt-demo/seed-dbt-demo.component';
import { SeedDbtApplyComponent } from './seed-dbt-apply/seed-dbt-apply.component';
import { SuccessSeeddbtComponent } from './success-seeddbt/success-seeddbt.component';
import { SchemeApplyApicolComponent } from '../citizen-portal/scheme-apply-apicol/scheme-apply-apicol.component';
import { SchemePreviewApicolComponent } from '../citizen-portal/scheme-preview-apicol/scheme-preview-apicol.component';
import { FailureComponent } from './failure/failure.component';
import { FupComponent } from './fup/fup.component'; 
import { GrievanceComponent } from './grievance/grievance.component';
import { GrievanceacknowledgeComponent } from './grievanceacknowledge/grievanceacknowledge.component';
import { GrievancetrackstatusComponent } from './grievancetrackstatus/grievancetrackstatus.component';
import { GrievancedashboardComponent } from './grievancedashboard/grievancedashboard.component';
import { ApplyFeedbackComponent } from './apply-feedback/apply-feedback.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { HelplineComponent } from './helpline/helpline.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { HomeNewComponent } from '../home-new/home-new.component';
import { AboutNewComponent } from '../about-new/about-new.component';
import { ScreenReaderComponent } from '../screen-reader/screen-reader.component';


const routes: Routes = [
  {
    // path: '', pathMatch: 'full', component: HomePageComponent,
    path: '', pathMatch: 'full', component: HomeNewComponent
  },
  {
    path: '', component: WebsiteComponent,
    children: [
      // { path: 'home-new', component: HomeNewComponent },
      { path: 'about', component: AboutNewComponent },
      { path: 'screen-reader', component: ScreenReaderComponent },
      { path: 'scheme-list', component: SchemeListComponent },
      { path: 'scheme-list/:id', component: SchemeListComponent },
      { path: 'services', component: ServicesComponent },
      { path: 'services/:id', component: ServicesComponent },
      { path: 'content/:id', component: ContentComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'feedback', component: FeedbackComponent },
      { path: 'faq', component: FaqComponent },
      { path: 'search', component: SearchComponent },
       { path: 'announcemnts', component: AnnouncemntsComponent },
       { path: 'announcementdetails/:id/:id2', component: AnnouncemntDetailsComponent },
       { path: 'howtoapply', component: HowToApplyComponent },
       { path: 'knowyourstatus', component: KnowYourStatusComponent },
       { path: 'blank', component: BlankComponent },
       { path: 'how-to-use', component: HowToUseComponent },
       { path:  'seed-dbt-demo/:id', component: SeedDbtDemoComponent },
       { path: 'seed-apply/:id', component: SeedDbtApplyComponent },
       { path: 'seed-preview/:id', component: SuccessSeeddbtComponent },
       { path: 'seed-failed/:id', component: FailureComponent },
       { path: 'fup', component: FupComponent },
       {path: 'token_expired',component:ErrorComponent},
       { path: 'grievance', component: GrievanceComponent },
       { path: 'grievance/:id', component: GrievanceComponent },
       { path: 'grievanceacknowledge/:id', component: GrievanceacknowledgeComponent },
       { path: 'grievancetrackstatus', component: GrievancetrackstatusComponent },
       { path: 'grievancetrackstatus/:id', component: GrievancetrackstatusComponent },
       { path: 'grievancedashboard', component: GrievancedashboardComponent },
       { path: 'feedbacks', component: ApplyFeedbackComponent },
       { path: 'feedbacks/:id', component: ApplyFeedbackComponent },
       { path: 'about-us', component: AboutUsComponent },
       { path: 'helpline', component: HelplineComponent },
       { path: 'contact-us', component: ContactUsComponent },
    ]
  },
  {
    path:'**',component:ErrorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebsiteRoutingModule { }
