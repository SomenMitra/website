import { Component, OnInit } from '@angular/core';
import {AbstractControl, UntypedFormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import { WebsiteApiService } from '../website-api.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ValidatorchklistService } from '../../validatorchklist.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  public loading = false;
  successMsg:any ='';
 


  txtName = '';
  emailId = '';
  mobileNo = '';
  message = '';
 
  maxLghNm = 100;
  minLghNm = 5;
  maxLghEmail = 50;
  minLghEmail = 10;
  maxLghMob = 10;
  minLghMob = 10;
  maxLghPwd = 15;
  minLghPwd = 8;

  constructor(private formBuilder: UntypedFormBuilder,
    private feedbackApi: WebsiteApiService,
    private router: Router,
    public vldChkLst:ValidatorchklistService
  ) { }

  ngOnInit(): void {
   
  }

 


  userFeedback(){
   
    // console.log(this.feedbackForm);
    let namePrfx = '';
    let txtName = this.txtName;
    let emailId = this.emailId;
    let mobileNo = this.mobileNo;
    let message  = this.message;
  
    let vSts = true;
    if (txtName == '' || typeof (txtName) == undefined || txtName == null) {
     
      Swal.fire({
        icon: 'error',
        text: 'Enter Your Name'
      });
    }
    else if(!this.vldChkLst.maxLength(txtName,this.maxLghNm,"Enter Name"))
    {
      vSts = false;
    }
    else if(!this.vldChkLst.minLength(txtName,this.minLghNm,"Enter Name"))
    {
      vSts = false;
    }
    else if (emailId == '' || typeof (emailId) == undefined || emailId == null) {
     
      Swal.fire({
        icon: 'error',
        text: 'Enter Your Email ID'
      });
    }
    else if(!this.vldChkLst.validEmail(emailId))
      {
        vSts = false;
      } 
      else if(!this.vldChkLst.maxLength(emailId,this.maxLghNm,"Email Id"))
      {
        vSts = false;
      }
      else if(!this.vldChkLst.minLength(emailId,this.minLghNm,"Email Id"))
      {
        vSts = false;
      }
      else if(!this.vldChkLst.blankCheck(mobileNo,"Mobile Number"))
      {
        vSts = false;
      }
      else if(!this.vldChkLst.validMob(mobileNo))
      {
        vSts = false;
      } 
      else if(!this.vldChkLst.maxLength(mobileNo,this.maxLghMob,"Mobile Number"))
      {
        vSts = false;
      }
      else if(!this.vldChkLst.minLength(mobileNo,this.minLghMob,"Mobile Number"))
      {
        vSts = false;
      }  
    else if (message == '' || typeof (message) == undefined || message == null) {
      Swal.fire({
        icon: 'error',
        text: 'Enter Message '
      });
    
    }
else{
 let params = {
    "txtName":txtName,
    "txtEmail": emailId,
    "txtMobileno": mobileNo,
    "txtMessage": message,
    };
    this.loading = true;
  this.feedbackApi.submitFeedback(params).subscribe(res=>{
      //console.log(data);
      if (res['status']=='200') {
        this.loading = false;
           this.successMsg ='Thank you for your Feedback/Complaint. We Will get back to you Soon';
          Swal.fire({
           
            icon: 'success',
            text: this.successMsg,
           
            
          })
          this.txtName = '';
          this.emailId = '';
          this.mobileNo = '';
          this.message = '';
         
       }
     else{
        this.loading = false;
        this.successMsg='Some error occured. Please try later.';
        Swal.fire({
           
          icon: 'error',
          text: this.successMsg,
         
          
        })
     }
     });
    }  

  }
}
