import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { EncryptDecryptService } from '../../encrypt-decrypt.service';
import { CitizenSchemeService } from '../../citizen-portal/service-api/citizen-scheme.service';
import { WebsiteApiService } from '../website-api.service';
import { CitizenAuthService } from '../../citizen-portal/service-api/citizen-auth.service';
declare var bootstrap: any;
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  siteURL = environment.siteURL;

  fileUrl = environment.fileUrl;
  dirIcons = environment.directoryListicons;
  dateVal:any;
  public loading = false;
  applicantId:any;
  respSts:any;
  respList:any;
  groupedDirectorate:any;
  otherDirectorate:any;
  announcementitems:any;
  notificationitems:any;
  closeResult = '';
  isAnnouncementFlag = false;
  isnotificationFlag = false;
  
  loginSts  = false;
  constructor(
    private router:Router,
    private objSchm:CitizenSchemeService,
    private encDec: EncryptDecryptService,
    private servicesList:WebsiteApiService,
    public authService:CitizenAuthService
    ) { }

  ngOnInit(): void {    
    this.loginSts = this.authService.isLoggedIn();
    if(this.loginSts)
    {
      let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
      this.applicantId = farmerInfo.USER_ID;
    }
   
     //console.log(this.dirIcons[1])

    
    this.getDirectorates()

    this.showModalOnPageLoad();
  }
  showModalOnPageLoad() {
    // Get the modal element
    const modalElement = document.getElementById('exampleModalopen');
    
    if (modalElement) {
      // Initialize the Bootstrap modal
      const modalInstance = new bootstrap.Modal(modalElement);
      
      // Show the modal
      modalInstance.show();
    }
  }


  viewSchemsPage(schemeStr : any,type:any)
  {
    let encSchemeStr = this.encDec.encText(schemeStr.toString()+':'+type.toString());
    this.router.navigate(['/home/scheme-list',encSchemeStr]);
  }



 getDirectorates(){
  let params = {
   
  };
  this.loading = true;
  this.servicesList.getDirectorates(params).subscribe(res=>{
    if(res['status']==200){

    this.respSts  = res.status;
  
 
this.groupedDirectorate = res.result['schemService'];
this.otherDirectorate = res.result['other'];
    this.loading = false;
  //console.log(this.groupedDirectorate);
  
 
    }
    else{
      this.loading = true;
    }
    
  });
 }





  removeTags(str) {
    if ((str===null) || (str===''))
        return false;
    else
        str = str.toString();
      
    return str.replace( /(<([^>]+)>)|&nbsp;/ig, '').substring(0,100);
}
}
