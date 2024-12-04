import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { CitizenSchemeService } from 'src/app/citizen-portal/service-api/citizen-scheme.service';
import { ApiService } from 'src/app/website/seed-dbt-apply/api.service';
@Component({
  selector: 'app-success-seeddbt',
  templateUrl: './success-seeddbt.component.html',
  styleUrls: ['./success-seeddbt.component.css'],
  providers: [DatePipe]
})
export class SuccessSeeddbtComponent implements OnInit {

  constructor(private route:ActivatedRoute,private router: Router, private objSchm:CitizenSchemeService,private encDec: EncryptDecryptService,private objSeedService:ApiService) { }
  
  seedDBT = environment.seedDBT;
  seedDBTPre = environment.seedDBTPre;
  applicantId:any;
  schemeId:any;
  applctnId: any;
  applctnNo:any;
  applctnNm:any;
  receiptUrl:any;
  loading = false;
  intApplicationStatus:number;
  voucherDetails:any[]=[];

  ngOnInit(): void {
    
    if(this.route.snapshot.paramMap.get('id').includes(':1:DBT')){
      let schemeStr = this.route.snapshot.paramMap.get('id');
      let schemeArr = schemeStr.split(':');
      this.schemeId = schemeArr[0];
      this.applctnId = schemeArr[1];
      let encAppCtnId = this.encDec.encText((this.schemeId + ':' + this.applctnId).toString());
      // console.log(encAppCtnId); 
      // return;
      this.router.navigate(['/home/seed-preview', encAppCtnId]).then(() => {
        window.location.reload();
      });;
    }

    // let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    // this.applicantId = farmerInfo.USER_ID;
    let encSchemeId  = this.route.snapshot.paramMap.get('id');
    let schemeStr    = this.encDec.decText(encSchemeId);
    // console.log(schemeStr);
    let schemeArr    = schemeStr.split(':');
    this.schemeId    = schemeArr[0];
    this.applctnId   = schemeArr[1]; 
    
    let params = {
      "schemeId":this.schemeId,
      "profId":0,
      "applctnId":this.applctnId  
    }; 
    this.getAppldSchmLst(params);  

     let params1 = {
      "schemeId":this.schemeId,
      "profileId": 0,
      "applicationId": this.applctnId,
      "intVoucherId" : 0
    }; 
    this.getVoucherDetails(params1);
  }



  getAppldSchmLst(params:any)
  {
    this.loading = true;
    this.objSeedService.getSeedPreviewApplication(params).subscribe(res => {
      if (res.status == 1) {
        this.loading = false;
        let respList = res.result;
        this.applctnNo = respList['vchApplicationNo'];   
        this.applctnNm = respList['processname'];
        this.receiptUrl = respList['receiptUrl'];
      }
      else {
        Swal.fire({
          icon: 'error',
          text: res.msg
        });
        this.loading = false;
      }
    },
    error => {
      this.loading = false;
      Swal.fire({
        icon: 'error',
        text: environment.errorMsg
      });
    });
  }

 
  getVoucherDetails(params)
  {
  this.objSeedService.getVoucherDetails(params).subscribe(res => {
    
    if(res.status == 200)
    {
      this.voucherDetails = res.result;
    }

  });

  }

}
