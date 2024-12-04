import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import { environment } from 'src/environments/environment';
import { formatDate } from '@angular/common';
import { DatePipe } from '@angular/common';
import { ManufactureSchemeService } from '../service-api/manufacture-scheme.service';

@Component({
  selector: 'app-manufacture-preview',
  templateUrl: './manufacture-preview.component.html',
  styleUrls: ['./manufacture-preview.component.css'],
  providers: [DatePipe]
})

export class ManufacturePreviewComponent {
  schemeId: any;
  onlineSrvId: any;
  profileId: any;
  loading = false;
  respSts: any;
  respList: any;
  manufactureDetails: any;
  manufactureDoc: any;
  gstValidity: any;
  dicValidity: any;
  txtTurnOver: any;
  documentUrl: any;
  manufactureOtherDoc: any;
  manufacturedProduct: any;
  procuredProduct: any;
  isTechnicalStaff: any;
  technicalStaff: any;
  isPerformanceReport: any;
  performanceReportDtls: any;
  isTestingReport: any;
  testingReport: any;
  type: any;
  vchApplicantName: any;
  vchEmail: any;
  vchGSTIN: any;
  vchCompanyRegNo: any;
  vchComanyHead: any;
  vchMobileNo: any;
  vchReferenceNo: any;
  vchAddressLn1: any;
  intComponentId: any;
  constructor(private router: Router, private route: ActivatedRoute, private encDec: EncryptDecryptService, private objSchm: ManufactureSchemeService,) { }
  ngOnInit(): void {
    let encSchemeId = this.route.snapshot.paramMap.get('id');
    let schemeStr = this.encDec.decText(encSchemeId);
    let schemeArr = schemeStr.split(':');
    this.schemeId = schemeArr[0];
    this.onlineSrvId = schemeArr[1];
    this.profileId = schemeArr[2];
    this.type = schemeArr[3];
    let manufactureParam = {
      "profileId": this.profileId,
      "schemeId": this.schemeId,
      "onlineServiceId": this.onlineSrvId,
      "type": this.type 
    };
    this.getManufactureDetails(manufactureParam);
  }

  getManufactureDetails(params: any) {
    this.loading = true;
    this.objSchm.getManufactureDetails(params).subscribe(res => {
      //console.log(res.result);
      this.respSts = res.status;
      if (this.respSts == 1) {
        
        this.respList = res.result;
        this.documentUrl = res.result.documentUrl;
        this.manufactureDetails = this.respList.manufactureDetails[0];
        this.vchApplicantName = this.manufactureDetails.vchApplicantName;
        this.vchEmail = this.manufactureDetails.vchEmail;
        this.vchCompanyRegNo = this.manufactureDetails.vchCompanyRegNo;
        this.vchGSTIN = this.manufactureDetails.vchGSTIN;
        this.vchMobileNo = this.manufactureDetails.vchMobileNo;
        this.vchComanyHead = this.manufactureDetails.vchComanyHead;
        this.vchReferenceNo = this.manufactureDetails.vchReferenceNo;
        this.vchAddressLn1 = this.manufactureDetails.vchAddressLn1;
        this.manufactureDoc = JSON.parse(this.manufactureDetails.vchDocumentDetail);
        this.gstValidity = JSON.parse(this.manufactureDetails.vchGSTValidity);
        this.dicValidity = JSON.parse(this.manufactureDetails.vchDICValidity);
        this.txtTurnOver = JSON.parse(this.manufactureDetails.txtTurnOver);

        //Other Document
        this.manufactureOtherDoc = this.respList.manufactureOtherDoc[0];
        this.intComponentId = this.manufactureOtherDoc.intComponentId;
        this.manufacturedProduct = JSON.parse(this.manufactureOtherDoc.txtManufactured);
        this.procuredProduct = JSON.parse(this.manufactureOtherDoc.txtProcured);
        this.isTechnicalStaff = this.manufactureOtherDoc.isTechnicalStaff;
        if (this.isTechnicalStaff == 1) {
          this.technicalStaff = JSON.parse(this.manufactureOtherDoc.txtTechnicalStaff);
        }
        this.isPerformanceReport = this.manufactureOtherDoc.isPerformanceReport;
        if (this.isPerformanceReport == 1) {
          this.performanceReportDtls = JSON.parse(this.manufactureOtherDoc.txtPerformanceReportDtls);
        }
        this.isTestingReport = this.manufactureOtherDoc.isTestingReport;
        if (this.isTestingReport == 1) {
          this.testingReport = JSON.parse(this.manufactureOtherDoc.txtTestingReport);
        }
        
        this.loading = false;
      } else {
        this.loading = false;
      }
    });
  }
  printPage() {
    window.print();
  }
  goBack() {
    window.history.back();
  }
  convertToValidDateFormat(dateString: string): Date | null {
    // Split the '27/08/2024' format into parts
    const [day, month, year] = dateString.split('/');

    // Return a new Date object in the 'yyyy-MM-dd' format
    return new Date(`${year}-${month}-${day}`);
  }
}


