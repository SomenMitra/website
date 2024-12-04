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
  selector: 'app-apply-feedback',
  templateUrl: './apply-feedback.component.html',
  styleUrls: ['./apply-feedback.component.css']
})
export class ApplyFeedbackComponent {
@ViewChild('selBlock') selBlock: ElementRef;
  @ViewChild('schemeId') schemeIdElement: ElementRef;
  grivancearray=environment.formlist;
  selectedGrievance: string;
  feedbackForm : FormGroup;
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
  directorateId: 0;
  paramSchemeId: any;
  selectedProcessId: any;
  questionList: any;
constructor(private fb: FormBuilder, private manufactureService:ManufactureSchemeService,private api:ManufactureSchemeService,public vldChkLst : ValidatorchklistService,private encDec: EncryptDecryptService,private router: Router, private route:ActivatedRoute, private objMstr: CitizenMasterService) { 
    this.feedbackForm = this.fb.group({
      txtApplicantName : '',
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
    this.getQuestion(this.paramSchemeId);
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
      this.feedbackForm.get('txtDirectorate')?.setValue(this.directorateId);
      // Manually trigger the change event
      this.getScheme(this.directorateId);
    }
  }
  }
  goBack() {
    window.history.back();
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
    this.feedbackForm.get('txtSchemeName')?.patchValue('');
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
            this.selectedProcessId = matchingSchemeOption.getAttribute('schemeid');
            this.feedbackForm.get('txtSchemeName')?.setValue(matchingSchemeOption.value);
          }
        }
              // Add an event listener to handle the selection change
          schemeSelectElement.addEventListener('change', (event: Event) => {
            const selectedOption = event.target as HTMLSelectElement;
            const selectedSchemeId = selectedOption.options[selectedOption.selectedIndex].getAttribute('schemeid');
            this.selectedProcessId = selectedSchemeId;
            this.feedbackForm.get('txtSchemeName')?.setValue(selectedOption.value);
            this.selectedProcessId = selectedSchemeId;
          });
      } else {
        this.loading = true;
      }
    });
  }

  getQuestion(processId: number) {
    let params = {
      "intProcessId": processId
    };

    this.manufactureService.getFeedbackQuestion(params).subscribe((response: any) => {
      if (response.status === 200) {
        this.questionList = response.result.map((question: any) => {
          return {
            ...question,
            rating: 1 // Default rating
          };
        });
      } else {
        console.log("Some Error Happens!!");
      }
    });
  }

  rateQuestion(index: number, rating: number) {
    this.questionList[index].rating = rating;
  }
  submitForm(){
    let errFlag = 0;
    let txtApplicantName = this.feedbackForm.value.txtApplicantName;
    let txtEmail = this.feedbackForm.value.txtEmail;
    let txtMobile = this.feedbackForm.value.txtMobile;
    let districtId = this.feedbackForm.value.districtId;
    let txtDirectorate = this.feedbackForm.value.txtDirectorate;
    let txtSchemeName = this.feedbackForm.value.txtSchemeName;
    let txtDocument = this.feedbackForm.value.txtDocument;
    let txtMessage = this.feedbackForm.value.txtMessage;
    let txtUserProfileId = this.feedbackForm.value.txtUserProfileId ? this.feedbackForm.value.txtUserProfileId : 0;
    let selectedProcessId  = this.selectedProcessId  ? this.selectedProcessId : 0;
    if((errFlag == 0) && (!this.vldChkLst.blankCheck(txtApplicantName, `Name Cannot be Blank!`,"name"))){
      errFlag = 1;  
      }
    // if((errFlag == 0) && (!this.vldChkLst.blankCheck(txtEmail, `Email Cannot be Blank!`,"email"))){
    //     errFlag = 1; 
    //     }
    if (!this.vldChkLst.validEmail(txtEmail)) {
        errFlag = 1;
      }
    if((errFlag == 0) && (!this.vldChkLst.blankCheck(txtMobile, `Mobile Cannot be Blank!`,"mobileno"))){
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
                txtApplicantName:txtApplicantName,
                txtEmail:txtEmail,
                txtMobile:txtMobile,
                districtId:districtId,
                txtDirectorate:txtDirectorate,
                txtSchemeName:txtSchemeName,
                txtUserProfileId:txtUserProfileId,
                selectedProcessId: selectedProcessId,
                ratings: this.questionList.map(q => ({ question: q.intId, rating: q.rating }))
              }
              this.manufactureService.submitFeedback(param).subscribe((response:any)=>{
                if (response.status == 200) {
                  let profileId = response.result.profileId
                  if (profileId > 0) {
                    Swal.fire({
                      title: 'Your Feedback Submitted Successfully',
                      icon: 'success',
                      confirmButtonColor: '#3085d6',
                      confirmButtonText: 'Ok',
                      allowOutsideClick: false,
                      allowEscapeKey: false
                    }).then((result:any) => {
                      if (result.isConfirmed) {
                        this.router.navigate(['/citizen-portal/dashboard']);
                      }
                    });
                  } else {
                    Swal.fire({
                      title: 'Your Feedback Submitted Successfully',
                      icon: 'success',
                      confirmButtonColor: '#3085d6',
                      confirmButtonText: 'Ok',
                      allowOutsideClick: false,
                      allowEscapeKey: false
                    }).then((result:any) => {
                      if (result.isConfirmed) {
                        this.router.navigate(['/website/home']);
                      }
                    });
                  }
                } else {
                  console.log("something happens");
                }
              });
            }
          });
        }     
        
    }
    
}
