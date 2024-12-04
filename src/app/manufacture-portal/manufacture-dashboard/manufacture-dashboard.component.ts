import { Component, OnInit, ElementRef } from '@angular/core';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CitizenProfileService } from '../service-api/citizen-profile.service';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
import { CitizenSchemeService } from '../service-api/citizen-scheme.service';
import { ManufactureSchemeService } from '../service-api/manufacture-scheme.service';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators, AbstractControl, FormArray } from '@angular/forms';


@Component({
  selector: 'app-manufacture-dashboard',
  templateUrl: './manufacture-dashboard.component.html',
  styleUrls: ['./manufacture-dashboard.component.css']
})
export class ManufactureDashboardComponent implements OnInit {



  loginSts: any;
  public loading = false;
  responseSts: any;
  statusform =new UntypedFormGroup({});
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
  gpId = 0;
  villageId = 0;
  address = '';
  dobV = '';
  aadhaarNo = '';
  applicationDetails: any;
  public innerWidth: any;
  manufactureInfo:any;
  respStass: any;
  schemeItem: any;
  respSts: any;
  distlist: any;
  resp : any;
  blocklist: any;
  isDataFlagprice=false;
  selscheme:any=0;
  selFinancialYear:any;
  distId:any;
  financialYear:any;
  blockId:any;
  applicationSts:any;
  applicationStatus:any=0;
  IS_PRE_POST=environment.IS_PRE_POST;

 constructor(
    private router: Router,
    private route: ActivatedRoute,
    private encDec: EncryptDecryptService,
    private objProf: CitizenProfileService,
    private objSchm: ManufactureSchemeService,
    private el: ElementRef,
    private api: ManufactureSchemeService,

  ) { }

  ngOnInit(): void {

    this.loading = true;
    this.innerWidth = window.innerWidth;
    this.farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    this.manufactureInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    let encSchemeId = this.route.snapshot.paramMap.get('id');
    let schemeStr = this.encDec.decText(encSchemeId);
    let schemeArr = schemeStr.split(':');
    this.financialYear = schemeArr[0];
    this.schemeId = schemeArr[1];
    this.distId = schemeArr[2];
    this.blockId = schemeArr[3];
    this.applicationStatus = schemeArr[4];
    this.getFinancialYear(this.financialYear);
    this.getPMKSYScheme(this.schemeId,this.manufactureInfo.USER_ID);
    this.getAllDist(this.distId);    
    this.getBlocks(this.distId,this.blockId);
    if(this.IS_PRE_POST==1){
      this.getApplicationDetails(this.financialYear,this.schemeId,this.distId,this.blockId,this.applicationStatus)
    }else{
      this.getApplicationDetailsNotPrePost(this.financialYear,this.schemeId,this.distId,this.blockId,this.applicationStatus)
    }
    
    this.getFarmrInfo();
   
  }
  //get financial year
  getFinancialYear(financialYear){
    var current_year = new Date().getFullYear()
    var amount_of_years = 1
    var next = current_year+1;
   
     for (var i = 0; i < amount_of_years+1; i++) {
       var year = (current_year-i).toString();
       var next = (current_year-i)+1;
       var vyear = (current_year-i) + '-' + next.toString().slice(-2);
       var selected=(financialYear == year)?"selected=selected":'';
       var element = '<option '+selected+' value="' + year + '">' + vyear + '</option>';
       $('select[name="financial_year"]').append(element)
     }
   }
  //get scheme

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
        // if (aadhaarNoP != '') {
        //   this.aadhaarNo = "X".repeat(8) + aadhaarNoP.substr(8, 4);
        // }

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
      this.router.navigate(['/manufacture-portal/scheme-applied',encSchemeStr]);
  }

  updateScheme(schemeStr: any) {
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/manufacture-portal/updateSchemestatus', encSchemeStr]);
  }

  getApplicationDetails(financialYear:string,schemeId:string,distId:string,blockId:string,applicationSts:string) {
    //alert(financialYear);
    let params = {
      "applicationId": '',
      "profId": this.farmerInfo.USER_ID,
      "financialYear": financialYear,
      "schemeId":schemeId,
      "distId":distId,
      "blockId":blockId,
      "srcTypeId":1,
      "applicationSts":applicationSts
    };
    this.loading = true;
    this.objSchm.getTrackMApplication(params).subscribe(res => {
      this.responseSts = res.status;
      if (res.status > 0) {

        this.applicationDetails = res.result;
        //apprvSts
        this.loading = false;
        this.isDataFlagprice = true;

      }
    },
      error => {
        Swal.fire({
          icon: 'error',
          text: environment.errorMsg
        });
        this.responseSts='';
        this.isDataFlagprice=false;
      });
  }

  getApplicationDetailsNotPrePost(financialYear:string,schemeId:string,distId:string,blockId:string,applicationSts:string) {
    //alert(financialYear);
    let params = {
      "applicationId": '',
      "profId": this.farmerInfo.USER_ID,
      "financialYear": financialYear,
      "schemeId":schemeId,
      "distId":distId,
      "blockId":blockId,
      "srcTypeId":1,
      "applicationSts":applicationSts
    };
    this.loading = true;
    this.objSchm.getTrackMApplicationNotPrePost(params).subscribe(res => {
      this.responseSts = res.status;
      if (res.status > 0) {

        this.applicationDetails = res.result;
        //apprvSts
        this.loading = false;
        this.isDataFlagprice = true;

      }
    },
      error => {
        Swal.fire({
          icon: 'error',
          text: environment.errorMsg
        });
        this.responseSts='';
        this.isDataFlagprice=false;
      });
  }
  
  
  getPMKSYScheme(schemeId,profileId){
    let params = {
      "miSchemeId": this.manufactureInfo.MI_SCHEME_ID,
      "profileId": this.manufactureInfo.USER_ID
    };
    this.loading = true;
    this.api.getPMKSYScheme(params).subscribe(res=>{
      if(res['status']==200){
        this.respStass  = res.status;
        this.respStass  = res.status;
        this.schemeItem = res.result['schemeId'];
        var element =' <option value="">-- Select --</option>';
        for (var i = 0; i < this.schemeItem.length; i++) {
          // var schemeid = this.schemeItem[i].intProcessId;
          // var schemename =  this.schemeItem[i].vchProcessName;
          // element += '<option value="' + schemeid + '" >' + schemename + '</option>';

            var schemeid = this.schemeItem[i].intProcessId;
            var schemename =  this.schemeItem[i].vchProcessName;
            var selected=(schemeId == schemeid)?"selected=selected":'';
            element += '<option '+selected+' value="'+ schemeid +'">' + schemename + '</option>';
        }
        $('select[name="scheme"]').html(element);
        this.loading = false;
      }
      else{
        this.loading = true;
      }
    });
   }
   
   getAllDist(distId){
    let params = {
      "miSchemeId": this.manufactureInfo.MI_SCHEME_ID
    };
    this.loading = true;
    this.api.getAllDist(params).subscribe(res=>{
      if(res['status']==200){
        this.respSts  = res.status;
        this.respSts  = res.status;
        this.distlist= res.result;
        
        var element =' <option value="">-- Select --</option>';
        for (var i = 0; i < this.distlist.length; i++) {
          var distid = this.distlist[i].intDemoHierarchyValueId;
          var distName =  this.distlist[i].vchDemoHierarchyValue;          
          var selected=(distId == distid)?"selected=selected":'';
          element += '<option '+selected+' value="' + distid + '" >' + distName + '</option>';
        }
        $('select[name="dist"]').html(element);
        this.loading = false;
      }
      else{
        this.loading = true;
      }
   });
   }
   getBlocks(distId:string,blockId:any){
    let params = {
       "distId":distId,
     };
     this.loading = true;
     this.api.getMIBlocks(params).subscribe(res=>{
      if(res['status']==200){
        this.resp  = res.status;
        this.resp  = res.status;
        this.blocklist= res.result;
        
        var element =' <option value="0">-- Select --</option>';
        for (var i = 0; i < this.blocklist.length; i++) {
          var blockid = this.blocklist[i].intDemoHierarchyValueId;
          var blockName =  this.blocklist[i].vchDemoHierarchyValue;
          var selected=(blockId == blockid)?"selected=selected":'';
          element += '<option '+selected+' value="' + blockid + '" >' + blockName + '</option>';
        }
        $('select[name="block"]').html(element);
        this.loading = false;
      }
      else{
        this.loading = true;
      }
      
    });

   }



}
