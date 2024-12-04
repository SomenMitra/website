import { Component, OnInit, ElementRef } from '@angular/core';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CitizenProfileService } from '../service-api/citizen-profile.service';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
import { CitizenSchemeService } from '../service-api/citizen-scheme.service';

@Component({
  selector: 'app-citizen-dashboard',
  templateUrl: './citizen-dashboard.component.html',
  styleUrls: ['./citizen-dashboard.component.css']
})
export class CitizenDashboardComponent implements OnInit {



  loginSts: any;
  responseSts: any;
  loading = false;

  schemeId: any;
  applicantId: any;
  applctnId: any;
  farmerInfo: any;
  cateStatus = false;
  applicantName = '';
  emailId = '';
  mobileNo = '';
  gender = '';
  castCatg = '';
  fatherNm = '';
  districtId = 0;
  blockId = 0;
  gpId = 0;
  villageId = 0;
  address = '';
  dobV = '';
  aadhaarNo = '';
  applicationDetails: any;
  subsidyDetails: any;
  tinApprovalStatus:any;
  vchApplicationNo:any;
  releaseAmount:any;
  public innerWidth: any;
  currentPage: number = 1;
  totalPages: number = 1;
  perPage: number = environment.PERPAGEDATA;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private encDec: EncryptDecryptService,
    private objProf: CitizenProfileService,
    private objSchm: CitizenSchemeService,
    private el: ElementRef,
   
  ) { }


  ngOnInit(): void {

   
    this.innerWidth = window.innerWidth;
    this.farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    let encSchemeId = this.route.snapshot.paramMap.get('id');
    this.schemeId = this.encDec.decText(encSchemeId);
    //console.log(this.schemeId);

    this.getFarmrInfo();
    this.getApplicationDetails()
  }
  onPageChange(page: number) {
    this.currentPage = page;
    this.getFarmrInfo();
    this.getApplicationDetails()
    
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
  getSerialNumber(index: number): number {
    return (this.currentPage - 1) * this.perPage + index + 1;
  }
  // get farmer  basic info
  getFarmrInfo() {
    let params = {
      "profileId": this.farmerInfo.USER_ID
    };
    this.loading = true;


    this.objProf.profileBuild(params).subscribe(res => {
      this.responseSts = res.status;
      if (res.status > 0) {

        let resProfInfo = res.result['profileInfo'];
        this.applicantId = resProfInfo['applicantId'];
        this.applicantName = resProfInfo['applicantName'];
        this.emailId = resProfInfo['emailId'];
        this.mobileNo = resProfInfo['mobileNo'];
        this.fatherNm = resProfInfo['fatherNm'];
        this.gender = resProfInfo['genderNm'];
        this.castCatg = resProfInfo['castCatg'];
        let aadhaarNoP = resProfInfo['aadhaarNo'];

        this.aadhaarNo = '';
        if (aadhaarNoP != '') {
          this.aadhaarNo = "X".repeat(8) + aadhaarNoP.substr(8, 4);
        }

        this.dobV = resProfInfo['dob'];
        this.loading = false;
      }
    },
      error => {
        Swal.fire({
          icon: 'error',
          text: environment.errorMsg
        });
        this.loading = false;
      });
  }

  doSchemePreview(schemeStr: any,processId:any) {
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    
    if(environment.APICOL_SCHEME_IDS.includes(processId.toString())){
      this.router.navigate(['/citizen-portal/apicol/scheme-applied', encSchemeStr]);
    }else if(environment.PMKSY_SCHEME.includes(processId.toString())){
      this.router.navigate(['/citizen-portal/pmksy/scheme-applied', encSchemeStr]);
    }else{
      this.router.navigate(['/citizen-portal/scheme-applied', encSchemeStr]);
    }
  }

  updateScheme(schemeStr: any) {
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/citizen-portal/updateSchemestatus', encSchemeStr]);
  }

  getApplicationDetails() {
   
    let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    let params = {
      "applicationId": '',
      "profId": this.farmerInfo.USER_ID,
      "aadhaarNo":farmerInfo['USER_AADHAAR'] != '' ? farmerInfo['USER_AADHAAR'] : '',
      'currentPage':this.currentPage,
      'itesmPerPage':this.perPage
    };
    this.loading = true;


    this.objSchm.getTrackApplication(params).subscribe(res => {
      this.responseSts = res.status;
      if (res.status > 0) {
        this.applicationDetails = res.result;
        this.subsidyDetails = res.subsidy;
        this.tinApprovalStatus = res.subsidy.tinApprovalStatus;
        this.vchApplicationNo = res.subsidy.vchApplicationNo;
        this.releaseAmount = res.subsidy.releaseAmount;
        //console.log(this.applicationDetails)
        //apprvSts
        this.totalPages = Math.ceil(parseInt(res.allCount)/environment.PERPAGEDATA);
        this.getPageNumbers();
        this.loading = false;
        if(this.tinApprovalStatus==2){
          Swal.fire({
            icon: 'success',
            text: 'The subsidy of ₹ '+this.releaseAmount+ ' has been successfully released for your application number '+this.vchApplicationNo
          });
        }
      }
    },
      error => {
        Swal.fire({
          icon: 'error',
          text: environment.errorMsg
        });
        this.loading = false;
      });
  }
}
