import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators, AbstractControl } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { CitizenSchemeService } from '../service-api/citizen-scheme.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from '@angular/common';
import { ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { EncryptDecryptService } from '../../encrypt-decrypt.service';
import { CitizenMasterService } from '../service-api/citizen-master.service';

@Component({
  selector: 'app-trackstatus',
  templateUrl: './trackstatus.component.html',
  styleUrls: ['./trackstatus.component.css']
})
export class TrackstatusComponent implements OnInit {
 

  @ViewChild('ApplicationModal') ApplicationModal:ElementRef;
  @ViewChild('someSeedDBTVoucherModal') someSeedDBTVoucherModalRef: ElementRef;
  voucherModalDetails :any[]=[];
  seedDBT = environment.seedDBT;
  statusform =new UntypedFormGroup({});
  submitted = false;
  applications: any;
  public loading = false;
  bodyData: any;
  applicationDetails: any;
  isDataFlag = false;
  siteURL = environment.siteURL;
  dtApplication = '--';
  SchemePrev: any;
  error: any;
  applicationNo:any;
  otherDetails:any;
  schemeId:any;
  p: number = 1;
  farmerInfo:any;
  directorateInfo:any[]=[];
  respSts: any;
  groupedDirectorate: any;
  mixDirectorate:any=[];
  constructor(
    private formBuilder:UntypedFormBuilder,
    private api: CitizenSchemeService,
    private modalService: NgbModal,
    private el: ElementRef,
    private router:Router,
    private encDec: EncryptDecryptService,
    private objMstr: CitizenMasterService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.getDirectorates();
 
  }
  getKeyByValue(object:any, value:any) {
    for (var type in object) {
      if(value == type){
        return object[type]; 
      }
    }
  }

  getDirectorates(){
    let params = {
     
    };
    this.loading = true;
    this.api.getDirectorates(params).subscribe(res=>{
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
        // this.searchForm.patchValue({'vchSector':this.directorateId});
        //   this.loading = false;
        //console.log(this.groupedDirectorate);    
        this.loading = false;
      }
      else{
        this.loading = true;
      }
      
    });
   }
  
  private initForm() {
      this.statusform = this.formBuilder.group({
        'selDirectorate': new UntypedFormControl('',
                  [
                    Validators.required,
                  ]
      ),
        'txtapplicationId': new UntypedFormControl('',
                  [
                    Validators.required,
                  ]
      )      
    });
  }


getApplicationDetails(){
    this.submitted=true;
    if (this.statusform.invalid) {
      return;
    }
 
   //console.log(this.statusform.value.txtapplicationId);
  
    this.loading = true;
    this.farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    let params = {
      "applicationId": this.statusform.value.txtapplicationId,
       "profId": this.farmerInfo.USER_ID,
       "directorateId":this.statusform.value.selDirectorate
    };
    console.log(params);
    this.api.getTrackApplication(params)
    .subscribe(
      (res: any)=> {
        //console.log(res.result);
    
         this.applicationDetails = res.result;
        
         if(this.applicationDetails.length > 0){
           this.isDataFlag = true;
           this.loading = false;
         
        
        
         }
         else{
          this.isDataFlag = false;
          this.loading = false;
          this.applicationDetails="";
         }
         //  console.log(res.result[0]);
      

      
     
      
     },
      error => {
        this.error = error
        this.applicationDetails = []
      }

    );
 }



  get f(): { [key: string]: AbstractControl } {
    return this.statusform.controls;
  }

  open(content:any) {
  
    this.modalService.open(content, {size: 'lg',backdrop: 'static',keyboard: false,ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  doSchemePreview(schemeStr : any)
  {
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/citizen-portal/scheme-preview',encSchemeStr]);


  }

  getVoucherDetailsByID(voucherID :any, applicationId :any)
  {
    let params = {
      "profileId": this.farmerInfo.USER_ID,
      "applicationId": applicationId,
      "intVoucherId" : voucherID
    }; 

    this.api.getVoucherDetails(params).subscribe(res => {
        
      if(res.status == 200)
      {
        this.voucherModalDetails =   res.result;
        this.open(this.someSeedDBTVoucherModalRef);
      }
  
    });

    
  }


  printSeedDBTVoucherPage()
  {
    var divToPrint     =   document.getElementById("printSeedDBTVoucher");
    var newWin = window.open('', 'Print-Window');

    newWin.document.open();

    newWin.document.write(`<html>
    <head>
   
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link href="../src/styles.css" rel="stylesheet" />
    </head>    
    <body onload="window.print()">
    <div class="print-header " style="padding-bottom:10px;margin-bottom:15px;border-bottom:1px solid #000">
   <img src="${this.siteURL}assets/images/slogo.png" alt=" Government of Odisha" style="height:40px" class="dark-logo">
</div>
<h5 class="mb-3 text-success">Voucher Details</h5>
    ${divToPrint.innerHTML}</body></html>`);

    newWin.document.close();

    setTimeout(function() {
        newWin.close();
    }, 500);
  }
}
