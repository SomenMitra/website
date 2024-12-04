import { Component, OnInit,ViewChild,ElementRef} from '@angular/core';
import {FormArray,FormBuilder, FormControlName,FormGroup,FormControl} from '@angular/forms';
import { ManufactureSchemeService } from 'src/app/manufacture-portal/service-api/manufacture-scheme.service';
import { environment } from 'src/environments/environment';
import { ValidatorchklistService } from 'src/app/validatorchklist.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import Swal from 'sweetalert2';
import { CitizenMasterService } from 'src/app/citizen-portal/service-api/citizen-master.service';
@Component({
  selector: 'app-grievance',
  templateUrl: './grievance.component.html',
  styleUrls: ['./grievance.component.css']
})
export class GrievanceComponent implements OnInit {
  @ViewChild('selBlock') selBlock: ElementRef;
  @ViewChild('schemeId') schemeIdElement: ElementRef;
  grivancearray=environment.formlist;
  selectedGrievance: string;
  manage_designation : FormGroup;
  // selBlock : any =0;
  public loading = false;
  schemeid:any;
  respSts: any;
  schemeItem: any;
  processName:any;
  intServiceId: any;
  maxLghMob: 10;
  minLghMob:10;
  farmerInfo: any;
  applicantMob: string;
  applicantName: string;
  applicantUserId: 0;
 // applicantEmail: string;
  districtList: any[] = [];
  districtId: any;
  params: any;
  directorateId: any;
  paramSchemeId: any;
  grievanceURL= environment.GRIEVANCE_URL;
constructor(private fb: FormBuilder, private manufactureService:ManufactureSchemeService,private api:ManufactureSchemeService,public vldChkLst : ValidatorchklistService,private encDec: EncryptDecryptService,private router: Router, private route:ActivatedRoute, private objMstr: CitizenMasterService) { 
    this.manage_designation = this.fb.group({
      txtDesignationName : '',
      txtEmail : '',
      txtMobile : '',
      districtId : 0,
      txtDirectorate : 0,
      txtSchemeName : 0,
      txtDocument : '',
      txtMessage : '',
      txtUserProfileId:'',
      });
  }
  goBack() {
    window.history.back();
  }
  ngOnInit(): void {
    let params  = this.route.snapshot.paramMap.get('id');
    this.params = this.encDec.decText(params);
    let schemeArr = this.params.split(':');
    this.directorateId = schemeArr[0];
    this.paramSchemeId = schemeArr[1];
    let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    this.applicantMob     = (farmerInfo)  ? farmerInfo.USER_MOBILE :'';
    this.applicantName     = (farmerInfo) ? farmerInfo.USER_FULL_NAME:'';
    this.applicantUserId = (farmerInfo) ? farmerInfo.USER_ID : 0;
    this.getDistList();
    if (this.applicantName) {
      this.manage_designation.get('txtDesignationName').disable();
    }
    if (this.applicantMob) {
      this.manage_designation.get('txtMobile').disable();
    }
    setTimeout(() => {
    this.setDirectorate();
  }, 1000);
  }

  setDirectorate() {
  if (this.directorateId) {
    const selectElement = this.selBlock.nativeElement;
    // Find the option that matches the directorateId
    const matchingOption = Array.from(selectElement.options).find((option: any) => option.value === this.directorateId);
    if (matchingOption) {
      // Set the value of the select element
      selectElement.value = this.directorateId;
      this.manage_designation.get('txtDirectorate')?.setValue(this.directorateId);
      // Manually trigger the change event
      this.getScheme(this.directorateId);
    }
  }
}
getDistList() {
    let param = {
      "parentId": 1,
      "subLevelId": 1
    }
    this.objMstr.grapCalHirarchy(param).subscribe(res => {
      if (res.status == 1) {
        this.districtList = res.result;
        }
    },
      error => {
        this.districtList = [];
      });
  }

  // get farmer  basic info
  getFarmrInfo() {
    let params = {
      "profileId": this.farmerInfo.USER_ID
    };
    this.loading = true;
  }
  //siri ::  receive the value of (change)='getScheme(selBlock.value)'//getScheme(siri:any)
  // getScheme(directorate:any){
  //   let params = {
  //     directorateId : directorate
  //   };
  // this.loading = true;
  // this.api.getSchemeList(params).subscribe(res=>{
  // this.loading = false;
  //   if(res['status']==200){
  //      this.respSts  = res.result;
  //      var element =' <option value="">-- Select --</option>';
  //      for (var i = 0; i < this.respSts.length; i++) {
  //       var schemeid = this.respSts[i].intProcessId;
  //       var processName =  this.respSts[i].vchProcessName;
  //       element += '<option value="' + processName + '" schemeid="' + schemeid + '">' + processName + '</option>';
  //      // element += '<option value="' + processName + '" >' + processName + '</option>';
  //     }
  //     $('select[name="scheme"]').html(element);
  //     this.loading = false;
  //   }
  //   else{
  //     this.loading = true;
  //   }

  // });
  // }
 
  // Automatic bind the Process name
  getScheme(directorate: any) {
    let params = {
      directorateId: directorate
    };
    this.loading = true;
    this.api.getSchemeList(params).subscribe(res => {
      this.loading = false;
      if (res['status'] == 200) {
        this.respSts = res.result;
        let element = '<option value="0">-- Select --</option>';
        let schemeSelectElement = this.schemeIdElement.nativeElement as HTMLSelectElement;

        for (let i = 0; i < this.respSts.length; i++) {
          let schemeid = this.respSts[i].intProcessId;
          let processName = this.respSts[i].vchProcessName;
          element += `<option value="${processName}" schemeid="${schemeid}">${processName}</option>`;
        }

        schemeSelectElement.innerHTML = element;

        // Check if schemeId is defined and select the matching option
        if (this.paramSchemeId) {
          const matchingSchemeOption = Array.from(schemeSelectElement.options).find((option: HTMLOptionElement) => option.getAttribute('schemeid') == this.paramSchemeId);
          if (matchingSchemeOption) {
            schemeSelectElement.value = matchingSchemeOption.value;
            this.manage_designation.get('txtSchemeName')?.setValue(matchingSchemeOption.value);
            this.manage_designation.get('txtDirectorate').disable();
            this.manage_designation.get('txtSchemeName').disable();
          }
        }
      } else {
        this.loading = true;
      }
    });
  }

  submitForm(){
    let errFlag = 0;
    let disabledName = (document.getElementById('name') as HTMLInputElement).value;
    let disabledMobileno = (document.getElementById('mobileno') as HTMLInputElement).value;
    let disabledDirectorate = (document.getElementById('directorate') as HTMLInputElement).value;
    let disabledSchemeName = (document.getElementById('schemeId') as HTMLInputElement).value;
    
    let txtDesignationName = this.manage_designation.value.txtDesignationName != undefined ? this.manage_designation.value.txtDesignationName : disabledName;
    let txtEmail = this.manage_designation.value.txtEmail;
    let txtMobile = this.manage_designation.value.txtMobile != undefined ?  this.manage_designation.value.txtMobile : disabledMobileno;
    let districtId = this.manage_designation.value.districtId;
    let txtDirectorate = this.manage_designation.value.txtDirectorate != undefined ? this.manage_designation.value.txtDirectorate : disabledDirectorate;
    let txtSchemeName = this.manage_designation.value.txtSchemeName != undefined ? this.manage_designation.value.txtSchemeName : disabledSchemeName;
    let txtDocument = this.manage_designation.value.txtDocument;
    let txtMessage = this.manage_designation.value.txtMessage;
    let txtUserProfileId = this.manage_designation.value.txtUserProfileId ? this.manage_designation.value.txtUserProfileId : 0;


    if((errFlag == 0) && (!this.vldChkLst.blankCheck(txtDesignationName, `Name`,"name"))){
      errFlag = 1;  
      }
    // if((errFlag == 0) && (!this.vldChkLst.blankCheck(txtEmail, `Email Cannot be Blank!`,"email"))){
    //     errFlag = 1; 
    //     }
    if (!this.vldChkLst.validEmail(txtEmail)) {
        errFlag = 1;
    }
    
    if((errFlag == 0) && (!this.vldChkLst.blankCheck(txtMobile, `Mobile`,"mobileno"))){
        errFlag = 1; 
      }
    if (!this.vldChkLst.validMob(txtMobile)) {
      errFlag = 1;
    }
    if (!this.vldChkLst.maxLength(txtMobile, this.maxLghMob, "mobileno")) {
        errFlag = 1;
    }
    if (!this.vldChkLst.minLength(txtMobile, this.minLghMob, "mobileno")) {
        errFlag = 1;
    }
    if((errFlag == 0) && (!this.vldChkLst.selectDropdown(districtId, `District`,"districtId"))){
          errFlag = 1;    
        }
    if((errFlag == 0) && (!this.vldChkLst.selectDropdown(txtDirectorate, `Directorate`,"directorate"))){
          errFlag = 1;    
        }
    if((errFlag == 0) && (!this.vldChkLst.selectDropdown(txtSchemeName, `Scheme`,"scheme"))){
          errFlag = 1;    
        }
    if((errFlag == 0) && (!this.vldChkLst.blankCheck(txtMessage, `Message`,"message"))){
        errFlag = 1;         
        }

        if (errFlag === 0) {
          Swal.fire({
            title: 'Are you sure?',
            text: "You want to submit this record",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
          }).then((result:any) => {
            if (result.isConfirmed) {
              let param={
                txtDesignationName:txtDesignationName,
                txtEmail:txtEmail,
                txtMobile:txtMobile,
                districtId:districtId,
                txtDirectorate:txtDirectorate,
                txtSchemeName:txtSchemeName,
                txtMessage:txtMessage,
                txtUserProfileId:txtUserProfileId,
              }
              this.manufactureService.grievance(param).subscribe((response:any)=>{
                if(response.flag==1){
                  let intServiceId = response.result.serviceId
                  let encSchemeStr = this.encDec.encText(intServiceId.toString());
                  this.router.navigate(['/home/grievanceacknowledge',encSchemeStr]);
                } else {
                  console.log("something happens");
                }
                let respData = response.RESPONSE_DATA;
                let respToken = response.RESPONSE_TOKEN;
              });
            }
          });
        }     
        
  }
  onMessageInput() {
    let messageControl = this.manage_designation.get('txtMessage');
    let value = messageControl.value;

    if (value.startsWith(' ')) {
      messageControl.setValue(value.trimStart(), { emitEvent: false });
    }
  }
}
