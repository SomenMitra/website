import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { WebsiteApiService } from '../website-api.service';
import { EncryptDecryptService } from '../../encrypt-decrypt.service';
import { Router, ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-announcemnt-details',
  templateUrl: './announcemnt-details.component.html',
  styleUrls: ['./announcemnt-details.component.css']
})
export class AnnouncemntDetailsComponent implements OnInit {
  
  siteURL = environment.siteURL;
  fileUrl = environment.cmsdomainUrl+"getfile/";
  
  public loading = false;
 
  
  respSts:any;
  announcementitems:any;
  isAnnouncementFlag = false;

  announcementDetails: any[] = [];

  isFailed: any = 0;
  error: any;
  bodyData: any;
  curPage: any = "";
 
  navigationSubscription:any;
  announcementid: any;
  typeid: any;
public pagetitle;
 
  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private encDec: EncryptDecryptService,
    private servicesList:WebsiteApiService
  ) { 

    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
        this.announcementid = this.route.snapshot.params['id'];
        this.typeid = this.route.snapshot.params['id2'];
      
        this.callannouncementDetails();
    });
  }

  ngOnInit(): void {
    this.callannouncementDetails();
    if(this.typeid==1){
      this.pagetitle="Notification Details"
    }
    else{
      this.pagetitle="Announcement Details"
    }
  }
  callannouncementDetails() {
    //alert( this.announcementid);
    let params = {
      "nType": this.typeid,
      "newsId": this.announcementid,
      "lang": localStorage.getItem('locale')
    }
    this.loading=true;
    this.servicesList.newsDetails(params).subscribe(res=>{
         
          if(res['status']=='200'){
            this.announcementDetails = res.result;
            this.loading = false;
          }
          else{
           
            this.loading = false;
          }



        },
        error => {
          this.error = error
          this.announcementDetails = []
        }

      );
  }
}
