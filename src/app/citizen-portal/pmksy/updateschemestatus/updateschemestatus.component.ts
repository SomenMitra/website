import { Component, OnInit, NgModule, ElementRef, ViewChild } from '@angular/core';
import * as $ from 'jquery';
import { Router, ActivatedRoute } from '@angular/router';
import { EncryptDecryptService } from '../../../encrypt-decrypt.service';
import { Location } from '@angular/common';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray } from '@angular/forms'
import { CitizenSchemeService } from '../../service-api/citizen-scheme.service';
import Swal from 'sweetalert2';
import { NgbModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-updateschemestatus',
  templateUrl: './updateschemestatus.component.html',
  styleUrls: ['./updateschemestatus.component.css']
})
export class UpdateschemestatusComponent implements OnInit {



  submitted = false;

  options: any;
  activityList: any;
  updateForm = new UntypedFormGroup({});

  arr: UntypedFormArray;
  schemeStr: any;
  schemeId: any;
  applicantId: any;
  applicationId: any;
  public loading = false;
  resDocSts: any;
  resDocList: any;
  lastUpd: any;
  docResFlg: any;
  docResFlNm: any;
  docResUpFlNm: any;
  applctnSts: any;
  updStatus: any;
  fileAttributes: any[] = [];
  ngElements: any[] = [];
  subsidyCtr: any;
  totalfile: number = 2;
  imageURL: any;
  authUpdateSts = false;
  farmerUpdateSts = false;
  subsidyAmt: number;
  subsidySts: any;
  subsidy:any;
  subsidyStsId:number;
  curDate = new Date();
  totalItem :number =0;
  completeItem :number =0;
  previousActivity : any;
  pastActivities : any;
  farmerPastActivities : any;
  timeStampKey:any;
  elementKey: any[] = [];
  pastActivitiesLength: any;
  directorateId: any;
  FMR_ACTIVITY_UPDATE = environment.FMR_ACTIVITY_UPDATE;

  @ViewChild('someModal') someModalRef: ElementRef;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private encDec: EncryptDecryptService,
    private location: Location,
    private uf: UntypedFormBuilder,
    private schemeApi: CitizenSchemeService,
    private modalService: NgbModal
  ) {

  }

  ngOnInit(): void {
    // console.log(this.curDate)
    this.options = "true";

    let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    this.applicantId = farmerInfo.USER_ID;


    let encSchemeId = this.route.snapshot.paramMap.get('id');
    this.schemeStr = this.encDec.decText(encSchemeId);
    let schemeArr = this.schemeStr.split(':');
    this.schemeId = schemeArr[0];
    this.applicationId = schemeArr[1];
    this.subsidyCtr = schemeArr[2];
    this.updStatus = schemeArr[3];


    //this.getDynmDocs();
    let params = {
      "applctnId": this.applicationId,
      "schemeId": this.schemeId,
      "profId": this.applicantId,
      "updStatusFarmer": this.updStatus,
      "subsidyCtr": this.subsidyCtr,
    };
    // console.log(12);
    this.loading = true;
    let curObj = this;
    this.schemeApi.getApplicationActivityStatus(params).subscribe(res => {
      this.resDocSts = res.status;
      this.resDocList = res.result;
      let lastUpdArr = res.lastUpd;
      this.lastUpd = (lastUpdArr.length !== 0)?lastUpdArr:this.resDocList;
      let docRes = res.docRes;
      let subsidy = res.subsidyDetails;
      this.pastActivities = res.previousActivity;
      this.pastActivitiesLength = Object.keys(this.pastActivities).length;
      let curDate = this.curDate;
      let directorate = this.resDocList[0].directorate;
      this.directorateId=directorate ? directorate:0;

      if(subsidy){
        this.subsidyAmt = subsidy.subsidyAmt;
        this.subsidySts = subsidy.subsidySts;
        this.subsidyStsId = subsidy.subsidyStsId;
      }
      if (docRes) {
        this.docResFlg = docRes.intmnDocSts;
        this.docResFlNm = docRes.intmnDoc;
        this.docResUpFlNm = docRes.upIntmnDoc;
      }


      this.loading = false;
      let arr = {};
      let c = 0;
      // console.log(this.resDocList)
      for (let item of this.resDocList) {
        this.totalItem++;
        arr[item.activityActnId] = ['', Validators.required];
        this.fileAttributes[item.activityActnId] = item;
        for (let i = 0; i < this.totalfile; i++) {
          arr[item.activityActnId + '_' + i + '_file'] = ['', Validators.required];
          this.fileAttributes[item.activityActnId + '_' + i + '_file'] = item;
        }
        arr[item.activityActnId + '_date'] = ['', Validators.required];
        this.fileAttributes[item.activityActnId + '_date'] = item;
        arr[item.activityActnId + '_remark'] = ['', Validators.required];
        this.fileAttributes[item.activityActnId + '_remark'] = item;
        this.ngElements[item.activityActnId + '_1'] = true;
        if(item.authUpdate == 1)
        {
          this.authUpdateSts = true;
        }
        if(item.farmerUpdate == 1)
        {
          this.farmerUpdateSts = true;
        }
        c++
      }
      if (c == this.resDocList.length) {
        this.updateForm = this.uf.group(arr);
      }
      
      for(let activity in this.pastActivities){
        this.elementKey.push(activity);
        this.farmerPastActivities = this.pastActivities[activity];
      }

    });
    // console.log(this.authUpdateSts)
    this.loading = true;
    setTimeout(() => {
      this.ischecked();
      this.loading = false;
    }, 4000);

  }





  backClicked() {
    this.location.back();
  }

  chooseAction(activityId, flag) {

    if (flag == 1) {
        const inprog = document.getElementById(activityId + "_inprog") as HTMLInputElement;
        inprog.checked = false;
        const compl = document.getElementById(activityId + "_compl") as HTMLInputElement;
        compl.checked = true;
      //this.completeItem++;
      this.ngElements[activityId + '_1'] = true;
      this.ngElements[activityId + '_2'] = false;
    }else {
      const inprog = document.getElementById(activityId + "_inprog") as HTMLInputElement;
      inprog.checked = true;
      const compl = document.getElementById(activityId + "_compl") as HTMLInputElement;
      compl.checked = false;
      this.ngElements[activityId + '_2'] = true;
      this.ngElements[activityId + '_1'] = false;
    }
    this.completeItem =0;
    for (let item of this.lastUpd) {
        const ele = document.getElementById(item.activityActnId + "_compl") as HTMLInputElement;
       if (ele.checked){
        // console.log(ele.checked);
         this.completeItem++;
       }
  }
    //  console.log(this.completeItem);

  }

  // start get dynamic documents
  getDynmDocs() {

    let params = {
      "applctnId": this.applicationId,
      "schemeId": this.schemeId,
      "profId": this.applicantId,
      "updStatusFarmer": this.updStatus,
      "subsidyCtr": this.subsidyCtr,
    };
    // console.log(12);
    this.loading = true;
    this.schemeApi.getApplicationActivityStatus(params).subscribe(res => {
      this.resDocSts = res.status;
      this.resDocList = res.result;
      let docRes = res.docRes;
      this.previousActivity = res.previousActivity;
      //console.log(docRes);
      // console.log("res.previousActivity");
      if (docRes) {
        this.docResFlg = docRes.intmnDocSts;
        this.docResFlNm = docRes.intmnDoc;
        this.docResUpFlNm = docRes.upIntmnDoc;
      }

      this.loading = false;
      let arr = {};
      let c = 0;

      for (let item of this.resDocList) {

        arr[item.activityActnId] = ['', Validators.required];
        this.fileAttributes[item.activityActnId] = item;
        for (let i = 0; i < this.totalfile; i++) {
          arr[item.activityActnId + '_' + i + '_file'] = ['', Validators.required];
          this.fileAttributes[item.activityActnId + '_' + i + '_file'] = item;
        }
        arr[item.activityActnId + '_date'] = ['', Validators.required];
        this.fileAttributes[item.activityActnId + '_date'] = item;
        arr[item.activityActnId + '_remark'] = ['', Validators.required];
        this.fileAttributes[item.activityActnId + '_remark'] = item;
        this.ngElements[item.activityActnId + '_1'] = true;
        if(item.authUpdate == 1)
        {
          this.authUpdateSts = true;
        }
        c++
      }
      if (c == this.resDocList.length) {
        this.updateForm = this.uf.group(arr);
      }


    });
    // console.log(this.authUpdateSts)

  }

  updateStatus() {
    let arr = this.resDocList;
    // console.log(arr);
    const formData = new FormData();
    let fileNames = '';
    let hdnFile = '';
    let retVal = true;
    let errFlag = true;
    const statusId = [];
    const activityStatusId = [];
    let applctnId = this.applicationId;
    let schemeId = this.schemeId;
    let profId = this.applicantId;
    for (let i = 0; i < arr.length; i++) {
      let activityId = arr[i]['activityActnId'];

      let taskId = this.updateForm.controls[activityId].value;
      // console.log(taskId);
      statusId.push(i);

      if (taskId == '') {
        Swal.fire({
          icon: 'error',
          text: 'Select Activity Status ' + taskId
        });
        return false;

      }
      else if (taskId > 0) {
        formData.append('taskStatus' + i, taskId);
        formData.append('activityId' + i, activityId);
        formData.append('masterItemId' + i, arr[i]['masterItemId']);
        if (taskId == '2') {
          //if (!this.FMR_ACTIVITY_UPDATE.includes(this.directorateId)) {
            for (let j = 0; j < this.totalfile; j++) {
              let fileName = activityId + '_' + j + '_file';
              let selectedFileList = (<HTMLInputElement>document.getElementById(fileName));
              let file: any = selectedFileList.files.item(0);
              const extension = selectedFileList.value.split('.').pop();
              if (file) {
                let fileType = 'png,jpg,jpeg';
                let fileFileSize = 1;
                let uploadedFileType = file.type;
                let uploadedFileSize = file.size;

                let UploadFileConvesion = Math.round((uploadedFileSize / 1024));
                let acceptableTypes = fileType.split(',');
                const accepteableLowercase = acceptableTypes.map(acceptableTypes => acceptableTypes.toLowerCase());
                if (accepteableLowercase.includes(extension.toLowerCase()) == false) {
                  Swal.fire({
                    icon: 'error',
                    text: 'Upload only ' + fileType + ' files '
                  });

                  return false;
                }

                else if (UploadFileConvesion > fileFileSize * 1024) {
                  Swal.fire({
                    icon: 'error',
                    text: 'Upload document should be < ' + fileFileSize + ' MB'
                  });

                  return false;
                }
                else {
                  file = (file) ? file : '';
                  formData.append('fileName_' + i + '_' + j, file);
                  fileNames += fileName + ",";
                }
              }
              // else {
              //   Swal.fire({
              //     icon: 'error',
              //     text: 'Upload file for activity'
              //   });
              //   return false;
              // }
            }
          //}
        }
        else {
          let completeDate = this.updateForm.controls[activityId + '_date'].value;
          formData.append('taskDate' + i, completeDate);
          if (completeDate == '' || completeDate=='30-Nov--0001') {
            Swal.fire({
              icon: 'error',
              text: 'Please select the date'
            });
            return false;
          }
        }
        let selectedremarkList = this.updateForm.controls[activityId + '_remark'].value;
        formData.append('taskRemark' + i, selectedremarkList);
        if (selectedremarkList == '') {
          Swal.fire({
            icon: 'error',
            text: 'Please enter remark'
          });
          return false;
        }
      }
    }

    // Start Intimation Document
    if (this.docResFlg == 1 && this.totalItem == this.completeItem) {
      let intmnFileName = 'intmnFile';
      let selectedintmnFileList = (<HTMLInputElement>document.getElementById(intmnFileName));
      let intmnFile: any = selectedintmnFileList.files.item(0);
      const intmnExtension = selectedintmnFileList.value.split('.').pop();
      if (intmnFile) {
        let intmnFileType = 'jpeg,jpg,gif,pdf,zip';
        let intmnFileSize = 10;
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
        }
      }
      else {
        Swal.fire({
          icon: 'error',
          text: 'Upload file for Intimation Document'
        });
        return false;
      }
    }
    // End Intimation Document

    formData.append('intmnFileSts', this.docResFlg);
    formData.append('statusIds', JSON.stringify(statusId));
    formData.append('applctnId', this.applicationId);
    formData.append('schemeId', this.schemeId);
    formData.append('profId', this.applicantId);
     formData.append('subsidyCtr', this.subsidyCtr);
    // console.log(formData); return false;
    this.updateData(formData);
  }

  // to update data in server
  updateData(formDataObj: FormData) {
    this.loading = true;
    this.schemeApi.updateSchmActivitySts(formDataObj).subscribe(res => {
      let upSts = res.status;
      let upMsg = res.msg;
      // start after uploaded
      if (upSts == 1) {
        this.loading = false;
        let encSchemeStr = this.encDec.encText(this.schemeStr.toString());
        this.loading = false;
        var thisObj = this;
          Swal.fire({
            icon: 'success',
            text: "Activity updated successfully."
          }).then(function() {
            thisObj.router.navigate(['/citizen-portal/scheme-applied', encSchemeStr]);
          });

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


  onSubmit() {
    //console.log(this.updateForm.value)
    this.submitted = true;
    // console.log(this.updateForm);
    // stop here if form is invalid
    if (this.updateForm.invalid) {
      return;
    }
    else {
      // console.log(2);
      this.updateStatus();
    }

    // display form values on success
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.updateForm.value, null, 4));
  }
  get f() { return this.updateForm.controls; }

  onReset() {
    let encSchemeStr = this.encDec.encText(this.schemeStr.toString());
    //this.submitted = false;
    //this.updateForm.reset();
    this.router.navigate(['/citizen-portal/scheme-applied', encSchemeStr]);
  }
  open(content: any) {

    this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false, ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  close(content: any) {

    this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false, ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  getPhoto(imgUlr: any) {
    this.imageURL = imgUlr;
    this.open(this.someModalRef);
  }
  isDisabled() {
    return false
  }
  ischecked() {
    for (let item of this.lastUpd) {
      // console.log(item);
      if (item.farmerActionStatus != null) {
        let actId = item.activityActnId;
        this.updateForm.patchValue({ [actId]: item.farmerActionStatus });
        if (item.farmerActionStatus == 1) {
          const ele = document.getElementById(item.activityActnId + "_inprog") as HTMLInputElement;
          ele.checked = true;
          ele.click();
          const dateFArr = item.farmerUpdateDateN.split("-");
          let farmerUpdateDateN = dateFArr['2'] + '-' + dateFArr['1'] + '-' + dateFArr['0'];
          this.updateForm.patchValue({ [actId + '_date']: farmerUpdateDateN });
        } else if (item.farmerActionStatus == 2) {
          // this.completeItem++;
          const ele = document.getElementById(item.activityActnId + "_compl") as HTMLInputElement;
          ele.checked = true;
          ele.click();
        }

        this.updateForm.patchValue({ [actId + '_remark']: item.farmerRemark });
      } else {
        let actId = item.activityActnId;
        this.updateForm.patchValue({ [actId]: 2 });
        const ele = document.getElementById(item.activityActnId + "_compl") as HTMLInputElement;
        ele.checked = true;
        ele.click();
      }
    }
  }

}
