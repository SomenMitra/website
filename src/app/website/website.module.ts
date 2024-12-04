import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebsiteRoutingModule } from './website-routing.module';
import { HomePageComponent } from './home-page/home-page.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { WebsiteComponent } from './website.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SchemeListComponent } from './scheme-list/scheme-list.component';
import { DataTablesModule } from 'angular-datatables';
import { ContentComponent } from './content/content.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { SearchComponent } from './search/search.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { InternationalizationModule } from '../internationalization/internationalization.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AnnouncemntsComponent } from './announcemnts/announcemnts.component';
import { AnnouncemntDetailsComponent } from './announcemnt-details/announcemnt-details.component';

import { ServicesComponent } from './services/services.component';
import { HowToApplyComponent } from './how-to-apply/how-to-apply.component';
import { KnowYourStatusComponent } from './know-your-status/know-your-status.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { BlankComponent } from './blank/blank.component';
import { FilterPipe } from './filter.pipe';
import { FaqComponent } from './faq/faq.component';
import { HowToUseComponent } from './how-to-use/how-to-use.component';
import { SeedDbtApplyComponent } from './seed-dbt-apply/seed-dbt-apply.component';
import { SuccessSeeddbtComponent } from './success-seeddbt/success-seeddbt.component';
import { FailureComponent } from './failure/failure.component';
import { SeedDbtDemoComponent } from './seed-dbt-demo/seed-dbt-demo.component';
import { FupComponent } from './fup/fup.component';
import { GrievanceComponent } from './grievance/grievance.component';
import { GrievanceacknowledgeComponent } from './grievanceacknowledge/grievanceacknowledge.component';
import { GrievancetrackstatusComponent } from './grievancetrackstatus/grievancetrackstatus.component';
import { GrievancedashboardComponent } from './grievancedashboard/grievancedashboard.component';
import { environment } from 'src/environments/environment';
import { ApplyFeedbackComponent } from './apply-feedback/apply-feedback.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { HelplineComponent } from './helpline/helpline.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { HomeNewComponent } from '../home-new/home-new.component';
import { AboutNewComponent } from '../about-new/about-new.component';
import { AccessibilityFormComponent } from './accessibility-form/accessibility-form.component';
import { ScreenReaderComponent } from '../screen-reader/screen-reader.component';

// export function HttpLoaderFactory(httpClient: HttpClient) {
//   return new TranslateHttpLoader(httpClient);
// }



export const HttpLoaderFactory= (http:HttpClient) =>{
  let siteURL= environment.siteURL;
  return new TranslateHttpLoader(http,siteURL+'assets/i18n/','.json')
}


@NgModule({
  declarations: [HomePageComponent, FooterComponent, HeaderComponent, WebsiteComponent, SchemeListComponent, ContentComponent, NotificationsComponent, FeedbackComponent, SearchComponent, AnnouncemntsComponent, AnnouncemntDetailsComponent, ServicesComponent, HowToApplyComponent, KnowYourStatusComponent, BlankComponent, FilterPipe, FaqComponent, HowToUseComponent,SeedDbtApplyComponent, SuccessSeeddbtComponent, FailureComponent,FupComponent, SeedDbtDemoComponent, GrievanceComponent,GrievanceacknowledgeComponent, GrievancetrackstatusComponent, GrievancedashboardComponent, AboutUsComponent, HelplineComponent, ContactUsComponent, ApplyFeedbackComponent, HomeNewComponent, AboutNewComponent, AccessibilityFormComponent, ScreenReaderComponent],
  imports: [
    CommonModule,
    WebsiteRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    HttpClientModule,
    NgxPaginationModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ]
})
export class WebsiteModule { }
