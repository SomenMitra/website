import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { EncryptDecryptService } from '../../encrypt-decrypt.service';
import { CitizenSchemeService } from '../service-api/citizen-scheme.service';

@Component({
  selector: 'app-all-activities',
  templateUrl: './all-activities.component.html',
  styleUrls: ['./all-activities.component.css']
})
export class AllActivitiesComponent implements OnInit {

  submitted = false;

  options: any;
  activityList: any;

  schemeStr:any;
  schemeId: any;
  applicantId: any;
  applicationId: any;
  public loading = false;
  resDocSts: any;
  resDocList: any;
  applctnSts: any;
  updStatus: any;
  subsidyCtr:any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private encDec: EncryptDecryptService,
    private location: Location,
    private schemeApi: CitizenSchemeService) { }

  ngOnInit(): void {

    this.options = "true";

    let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    this.applicantId = farmerInfo.USER_ID;


    let encSchemeId = this.route.snapshot.paramMap.get('id');
    this.schemeStr = this.encDec.decText(encSchemeId);
    let schemeArr = this.schemeStr.split(':');
    this.schemeId = schemeArr[0];
    this.applicationId = schemeArr[1];
    this.updStatus = schemeArr[2];

console.log(schemeArr)
this.getDynmDocs();
  }
  backClicked() {
    this.location.back(); 
  }


  getDynmDocs() {
    let params = {
      "applctnId": this.applicationId,
      "schemeId": this.schemeId,
      "profId": this.applicantId,
      "updStatusFarmer":'',
      "subsidyCtr": '',
    };
    this.loading = true;
    this.schemeApi.getApplicationActivityStatus(params).subscribe(res => {
      this.resDocSts = res.status;
      this.resDocList = res.result;

      console.log(this.resDocList)
 
    });
  }
}
