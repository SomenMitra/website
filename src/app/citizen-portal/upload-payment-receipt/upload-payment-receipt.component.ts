import { Component, OnInit, NgModule } from '@angular/core';
import * as $ from 'jquery';
import { Router, ActivatedRoute } from '@angular/router';
import { EncryptDecryptService } from '../../encrypt-decrypt.service';
import { Location } from '@angular/common';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormArray } from '@angular/forms'
import { CitizenSchemeService } from '../service-api/citizen-scheme.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-upload-payment-receipt',
  templateUrl: './upload-payment-receipt.component.html',
  styleUrls: ['./upload-payment-receipt.component.css']
})
export class UploadPaymentReceiptComponent implements OnInit {

  constructor(private router: Router,
    private route: ActivatedRoute,
    private encDec: EncryptDecryptService,
    private location: Location,
    private uf: UntypedFormBuilder,
    private schemeApi: CitizenSchemeService
  ) {

  }
  schemeId: any;
  schemeStr: any;
  applicantId: any;
  public loading = false;
  submitted = false;
  updateForm: UntypedFormGroup;



  ngOnInit(): void {
    let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    this.applicantId = farmerInfo.USER_ID;
    let encSchemeId = this.route.snapshot.paramMap.get('id');


    this.schemeStr = this.encDec.decText(encSchemeId);
    let schemeArr = this.schemeStr.split(':');
    this.schemeId = schemeArr[1];
  }

  backClicked() {
    this.location.back();
  }

  onSubmit() {
    //this.submitted = false;
    const formData = new FormData();

    let intmnFileName = 'intmnFile';
    let selectedintmnFileList = (<HTMLInputElement>document.getElementById(intmnFileName));
    let intmnFile: any = selectedintmnFileList.files.item(0);
    const intmnExtension = selectedintmnFileList.value.split('.').pop();
    if (intmnFile) {
      let intmnFileType = 'pdf';
      let intmnFileSize = 1;
      let uploadedIntmnFileSize = intmnFile.size;

      let UploadIntmnFileConvesion = Math.round((uploadedIntmnFileSize / 1024));
      let acceptableIntmnTypes = intmnFileType.split(',');
      const accepteableIntmnLowercase = acceptableIntmnTypes.map(acceptableIntmnTypes => acceptableIntmnTypes.toLowerCase());
      if (accepteableIntmnLowercase.includes(intmnExtension.toLowerCase()) == false) {
        Swal.fire({
          icon: 'error',
          text: 'Upload only ' + intmnFileType + ' files '
        });

        return false;
      }

      else if (UploadIntmnFileConvesion > intmnFileSize * 1024) {
        Swal.fire({
          icon: 'error',
          text: 'Upload document should be < ' + intmnFileSize + ' MB'
        });

        return false;
      }
      else {
        intmnFile = (intmnFile) ? intmnFile : '';
        formData.append('intmnFile', intmnFile);
        formData.append('schemeId', this.schemeId);
        formData.append('profId', this.applicantId);
        this.loading = true;

        this.schemeApi.updatePaymentReceipt(formData).subscribe(res => {

          let upSts = res.status;
          let upMsg = res.msg;
          // start after uploaded
          if (upSts == 1) {
            this.loading = false;
            let encSchemeStr = this.encDec.encText(this.schemeStr.toString());
            this.router.navigate(['/citizen-portal/scheme-applied', encSchemeStr]);
          }
          else {
            this.loading = false;
            Swal.fire({
              icon: 'error',
              text: upMsg
            });
          }
          // end after uploaded
        });
      }
    }
    else {
      Swal.fire({
        icon: 'error',
        text: 'Upload Payment Receipt'
      });
      return false;
    }



  }
  onReset() {
    this.submitted = false;
    this.updateForm.reset();
  }


}
