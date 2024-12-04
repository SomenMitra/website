import { Component, OnInit } from '@angular/core';
import { WebsiteApiService } from '../website-api.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { EncryptDecryptService } from '../../encrypt-decrypt.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  siteURL = environment.siteURL;
  fileUrl = environment.cmsdomainUrl+"getfile/";;
  public loading = false;
  
  respSts:any;
  notificationitems:any;
  isnotificationFlag = false;


  constructor( private router:Router,
    private encDec: EncryptDecryptService,
    private servicesList:WebsiteApiService) { }

  ngOnInit(): void {
    this.getNotifications();
  }
  getNotifications()
  {
    let params = {
      "nType": "1",
      "isPaging": "false",
      "startRec": "0",
      "endRec": "10",
      "lang": localStorage.getItem('locale')
    };
    this.loading = true;
    this.servicesList.notifications(params).subscribe(res=>{
      if(res['status']=='200'){
  
        this.respSts  = res.status;
        this.notificationitems = res.result;
         this.isnotificationFlag = true
        this.loading = false;
        
        //console.log(res.result);
  
      }else{
         this.isnotificationFlag = false;
        this.loading = false;
      }
      
      
    });
  }
  
}
