import { Component, OnInit } from '@angular/core';
import { CitizenSchemeService } from '../service-api/citizen-scheme.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.css']
})
export class ServicesListComponent implements OnInit {

  applicantId:any;
  respSts:any;
  respList:any;
  siteURL = environment.siteURL;
  closeResult = '';
  isServiceFlag = true;
  public loading = false;
  schemeStr;
  groupedDirectorate:any;
  directorateId:any;
  directorateName:any;
  tab: any = 'tab1';
  p: number = 1;
  public innerWidth: any;

  constructor(private router:Router,private route:ActivatedRoute, private objSchm:CitizenSchemeService,private encDec: EncryptDecryptService) { }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    sessionStorage.removeItem('FFS_SESSION_SCHEME');
    let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    this.applicantId = farmerInfo.USER_ID;

    let encDirectorateId  = this.route.snapshot.paramMap.get('id');
    this.schemeStr = this.encDec.decText(encDirectorateId);
    let schemeArr = this.schemeStr.split(':');
    this.directorateId = schemeArr[0];
    this.directorateName = schemeArr[1];

    if(this.directorateId === ''){
     
      this.getServiceList(1); 
    }
    else{
      this.getServiceList(this.directorateId); 
      
     
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

  viewAppliedService(schemeStr : any)
  {
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/citizen-portal/scheme-applied',encSchemeStr]);
  }

  getServiceList(dirctType:any)
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
    this.loading = true;
    this.objSchm.schemeList(params).subscribe(res=>{

      if(res['status']=='1'){
      this.loading = false;
      this.respSts  = res.status;
      this.respList = res.result;
      this.isServiceFlag=true;
      }
      else{
        this.isServiceFlag=false;
      }
    });
  }

  getDirectorates(){
    let params = {
     
    };
    this.loading = true;
    this.objSchm.getDirectorates(params).subscribe(res=>{
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

}
