import { Component, OnInit } from '@angular/core';
import { CitizenSchemeService } from '../service-api/citizen-scheme.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import { environment } from 'src/environments/environment';
import { AbstractControl, FormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-scheme-list',
  templateUrl: './scheme-list.component.html',
  styleUrls: ['./scheme-list.component.css']
})
export class SchemeListComponent implements OnInit {
  applicantId: any;
  respSts: any;
  respList: any;
  siteURL = environment.siteURL;
  closeResult = '';
  isFlag = true;
  public loading = false;
  tab: any = 'tab1';
  p: number = 1;
  schemeStr;
  groupedDirectorate:any;
  directorateId:any;
  directorateName:any;
  otherDirectorate:any;
  public innerWidth: any;
  sectoragency = '';
  searchForm: any;
  dirType:any;
  mixDirectorate:any=[];
  language;
  seedDBTProcessId = environment.seedDBT;
  currentPage: number = 1;
  totalPages: number = 1;
  perPage: number = environment.PERPAGEDATA;
  grievanceURL= environment.GRIEVANCE_URL;
  constructor(private router: Router, private route:ActivatedRoute, private objSchm: CitizenSchemeService, private encDec: EncryptDecryptService) {

  }
  ngOnInit(): void {

    this.language=localStorage.getItem('locale')

    this.innerWidth = window.innerWidth;

    sessionStorage.removeItem('FFS_SESSION_SCHEME');
    let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    this.applicantId = farmerInfo.USER_ID;
    let encDirectorateId  = this.route.snapshot.paramMap.get('id');
    this.schemeStr = this.encDec.decText(encDirectorateId);
    let schemeArr = this.schemeStr.split(':');
    this.directorateId = schemeArr[0];

    this.dirType = schemeArr[1];
    
    this.getDirectorates();
    if(this.directorateId === ''){

      this.getSchemeList(1);
    }
    else{
      this.getSchemeList(this.directorateId);


    }

    this.searchForm = new UntypedFormGroup({
      'vchSector': new UntypedFormControl('', []),
      'vchType': new UntypedFormControl('',  [] ),
      'vchScmText': new UntypedFormControl('',  [] )
    });

  }
  onPageChange(page: number) {
    this.currentPage = page;
    if (this.directorateId === '') {
      this.getSchemeList(0);

    } else {
      this.getSchemeList(this.directorateId);
    }
    
  }
  getPageNumbers(): (number | string)[] {
    const pageNumbers: (number | string)[] = [];
    const totalShownPages = environment.PERPAGEDATA;
    const halfShownPages = Math.ceil(totalShownPages / 2);
    
    if (this.totalPages <= totalShownPages) {
      // If total pages are less than or equal to the pages we want to show
      for (let i = 1; i <= this.totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // If there are more pages than we want to show
      if (this.currentPage <= halfShownPages) {
        // If the current page is near the start
        for (let i = 1; i <= totalShownPages - 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(this.totalPages);
      } else if (this.currentPage > this.totalPages - halfShownPages) {
        // If the current page is near the end
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = this.totalPages - (totalShownPages - 2); i <= this.totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // If the current page is in the middle
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = this.currentPage - halfShownPages + 1; i <= this.currentPage + halfShownPages - 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(this.totalPages);
      }
    }
    return pageNumbers;
  }
  doSchemeApply(schemeStr: any, scheme: any) { 
     
    let schmSesnArr = {};
    let schemeName = scheme.vchProcessName;
    let ProcessId=scheme.intProcessId;
    let schemeSrvName = scheme.strSchmServNm;
    let schemeSvrId = scheme.intSchmServType;
    let intSPDPSts = scheme.intSPDPStatus;
    schmSesnArr["FFS_APPLY_SCHEME_NAME"]    = schemeName;
    schmSesnArr["FFS_APPLY_SCHEME_TYPE"]    = schemeSrvName;
    schmSesnArr["FFS_APPLY_SCHEME_TYPE_ID"] = schemeSvrId;
    schmSesnArr["FFS_APPLY_SPDP"]           = intSPDPSts;
    //schmSesnArr["FFS_APPLY_SCHEME_MODE"] = scModeType;
    sessionStorage.setItem('FFS_SESSION_SCHEME', JSON.stringify(schmSesnArr));
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    if(scheme.vchMaintainance!=''){
      let vchMaintainance=JSON.parse(scheme.vchMaintainance);
      let fromdate=vchMaintainance.fromdate;
      let todate=vchMaintainance.todate;
      let description=vchMaintainance.description;
      let isMaintainance=vchMaintainance.isMaintainance;
      let pagetitle=vchMaintainance.pagetitle;
      if(isMaintainance==1 && (new Date()>new Date(fromdate) && new Date()<new Date(todate))){
        Swal.fire({
          icon: 'error',
          text: description
        });
         return false;
      }
    }
    else{
      if(environment.PMKSY_SCHEME.includes(ProcessId.toString())){
        this.router.navigate(['/citizen-portal/pmksy/profile-update', encSchemeStr]);
      }
      else if(ProcessId==44){
        this.router.navigate(['/citizen-portal/apicol/profile-update', encSchemeStr]);
      }
      else{
        this.router.navigate(['/citizen-portal/profile-update', encSchemeStr]);
      }
    
    }
  }

  doSeedDBTApply(schmeID :any){
    this.router.navigate(['/home/seed-apply']);
  }
  doGrievanceApply(params: any) {
    let encSchemeStr = this.encDec.encText(params.toString());
    this.router.navigate([this.grievanceURL+'/home/grievance',encSchemeStr]);
  }
  doFeedbackApply(params: any) {
    let encSchemeStr = this.encDec.encText(params.toString());
    this.router.navigate([this.grievanceURL+'/home/feedbacks',encSchemeStr]);
  }
  viewAppliedScheme(schemeStr: any) {
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
      if(environment.PMKSY_SCHEME.includes(schemeStr.toString())){
        this.router.navigate(['/citizen-portal/pmksy/scheme-applied', encSchemeStr]);
    }
    else if(environment.APICOL_SCHEME_IDS.includes(schemeStr.toString())){
      this.router.navigate(['/citizen-portal/apicol/scheme-applied', encSchemeStr]);
  }
    else{
      this.router.navigate(['/citizen-portal/scheme-applied', encSchemeStr]);
    }
    
  }

  getSchemeList(dirctType: any) {
    let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    let params = {
      "schemeId": 0,
      "schmSerType": this.dirType,
      "dirctType": dirctType,
      "planType": 0,
      "schmYear": 0,
      "profileId": this.applicantId,
      "schemeServiceName":'',
      'currentPage':this.currentPage,
      'itesmPerPage':this.perPage,
      "aadhaarNo":farmerInfo['USER_AADHAAR'] != '' ? farmerInfo['USER_AADHAAR'] : '',

    };
    this.loading = true;
    this.objSchm.schemeList(params).subscribe(res => {
     
      if (res['status'] == '1') {
       
        this.loading = false;
        this.respSts = res.status;
        this.respList = res.result;
       
        this.isFlag = true;
        this.totalPages = Math.ceil(parseInt(res.allCount)/environment.PERPAGEDATA);
        this.getPageNumbers();
      }
      else {
        this.isFlag = false;
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


      this.respSts  = res.status;
      this.groupedDirectorate =res.result['schemService'];
      let other = res.result['other'];
   this.mixDirectorate =this.groupedDirectorate
    // this.groupedDirectorate.push(this.otherDirectorate)
    for(var i=0; i<other.length; ++i) {
      this.groupedDirectorate.push(other[i])
    }
    this.searchForm.patchValue({'vchSector':this.directorateId});
      this.loading = false;
    


      }
      else{
        this.loading = true;
      }

    });
   }

   searchSchemeList(){

    let params = {
      "schemeId":0,
      "schmSerType":this.searchForm.value.vchType,
      "dirctType":this.searchForm.value.vchSector,
      "planType":0,
      "schmYear":0,
      "profileId":this.applicantId,
      "schemeServiceName":this.searchForm.value.vchScmText,
      'currentPage':this.currentPage,
      'itesmPerPage':this.perPage

      //distName:this.searchForm.value.vchScmText,
    }
    this.loading = true;
    this.objSchm.schemeList(params).subscribe(res=>{
   
      if(res['status']=='1' && res.result.length > 0 ){
          this.loading = false;
          this.respSts  = res.status;
          this.respList = res.result;
          this.isFlag=true;
          this.totalPages = Math.ceil(parseInt(res.allCount)/environment.PERPAGEDATA);
        this.getPageNumbers();

        }
        else{
          this.loading = false;
          this.isFlag=false;
        }

    });
   }
}
