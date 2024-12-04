import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { EncryptDecryptService } from '../../encrypt-decrypt.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CitizenSchemeService } from '../../citizen-portal/service-api/citizen-scheme.service';
import { CitizenAuthService } from '../../citizen-portal/service-api/citizen-auth.service';
import { WebsiteApiService } from '../website-api.service';


@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {

  applicantId:any;
  respSts:any;
  respList:any;
  siteURL = environment.siteURL;
  closeResult = '';
  loginSts  = false;
  isFlag = true;
  public loading = false;
  tab: any = 'tab1';
  p: number = 1;
  filterText='';
  schemeStr;
  groupedDirectorate:any;
  directorateId:any;
  constructor(private router:Router, 
    private route:ActivatedRoute,
    private objSchm:CitizenSchemeService,
    private encDec: EncryptDecryptService,
    public authService:CitizenAuthService,
    private servicesList:WebsiteApiService) {

  }
 
  ngOnInit(): void {
    
    this.loginSts = this.authService.isLoggedIn();
    if(this.loginSts)
    {
      let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
      this.applicantId = farmerInfo.USER_ID;
    }
    let encDirectorateId  = this.route.snapshot.paramMap.get('id');
   
    
    this.schemeStr = this.encDec.decText(encDirectorateId);
    let schemeArr = this.schemeStr.split(':');
    this.directorateId = schemeArr[0];

   
    if(this.directorateId === ''){
     
      this.getSchemeList(1); 
    }
    else{
      this.getSchemeList(this.directorateId); 
      
     
    }
    this.getDirectorates();  
  }

  doServiceApply(schemeStr : any, schemeName: any)
  {
    let schmSesnArr = {};
    schmSesnArr["FFS_APPLY_SCHEME_NAME"]    = schemeName;
    schmSesnArr["FFS_APPLY_SCHEME_TYPE"]    = 'Service';
    schmSesnArr["FFS_APPLY_SCHEME_TYPE_ID"] = environment.constService;
    sessionStorage.setItem('FFS_SESSION_SCHEME', JSON.stringify(schmSesnArr));
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/citizen-portal/profile-update',encSchemeStr]);
  }

  viewAppliedScheme(schemeStr : any)
  {
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/citizen-portal/scheme-applied',encSchemeStr]);
  }

  getDirectorates(){
    let params = {
     
    };
    this.loading = true;
    this.servicesList.getDirectorates(params).subscribe(res=>{
      if(res['status']==200){
  
      this.respSts  = res.status;
    
   
  this.groupedDirectorate = res.result;
      this.loading = false;
    //console.log(this.groupedDirectorate);
    
   
      }
      else{
        this.loading = true;
      }
      
    });
   }


  getSchemeList(dirctType:any)
  {

    if (dirctType == 1 || dirctType == '') {
      this.tab = 'tab1';
    } 
    else if (dirctType ==  2) {
      this.tab = 'tab2';
    } 
     else if (dirctType ==  3) {
      this.tab = 'tab3';
    }
    else if (dirctType ==  4) {
      this.tab = 'tab4';
    }
    else if (dirctType ==  5) {
      this.tab = 'tab5';
    }
    else if (dirctType ==  6) {
      this.tab = 'tab6';
    }
    else if (dirctType ==  7) {
      this.tab = 'tab7';
    }
    else if (dirctType ==  8) {
      this.tab = 'tab8';
    }
    else if (dirctType ==  9) {
      this.tab = 'tab9';
    }
    else if (dirctType ==  10) {
      this.tab = 'tab10';
    }
    else if (dirctType ==  11) {
      this.tab = 'tab11';
    }
    else {
      this.tab = 'tab12';
    }

    let params = {
      "schemeId":0,
      "schmSerType":environment.constService,
      "dirctType":dirctType,
      "planType":0,
      "schmYear":0,
      "profileId":this.applicantId
    };
    this.objSchm.schemeList(params).subscribe(res=>{
      if(res['status']=='1'  && res.result.length > 0){
     
        this.loading = false;
        this.respSts  = res.status;
        this.respList = res.result;
        this.isFlag=true;
        }
        else{
          this.isFlag=false;
          this.loading = false;
        }
     
    });
  }

}
