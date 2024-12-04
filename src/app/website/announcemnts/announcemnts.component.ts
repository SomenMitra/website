import { Component, OnInit } from '@angular/core';
import { WebsiteApiService } from '../website-api.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { EncryptDecryptService } from '../../encrypt-decrypt.service';

@Component({
  selector: 'app-announcemnts',
  templateUrl: './announcemnts.component.html',
  styleUrls: ['./announcemnts.component.css']
})
export class AnnouncemntsComponent implements OnInit {

  siteURL = environment.siteURL;
  fileUrl = environment.cmsdomainUrl+"getfile/";
  public loading = false;
  
  respSts:any;
  announcementitems:any;
  isAnnouncementFlag = false;


  constructor( private router:Router,
    private encDec: EncryptDecryptService,
    private servicesList:WebsiteApiService) { }

  ngOnInit(): void {
    this.getAnnouncements();
  }
  getAnnouncements()
  {
    let params = {
      "nType": "2",
      "isPaging": "false",
      "startRec": "0",
      "endRec": "100",
      "lang": localStorage.getItem('locale')
    };
    this.loading = true;
    this.servicesList.announcements(params).subscribe(res=>{
      if(res['status']=='200'){
  
        this.respSts  = res.status;
        this.announcementitems = res.result;
        this.isAnnouncementFlag = true
        this.loading = false;
        
        //console.log(res.result);
  
      }else{
        this.isAnnouncementFlag = false;
        this.loading = false;
      }
      
      
    });
  }
}
