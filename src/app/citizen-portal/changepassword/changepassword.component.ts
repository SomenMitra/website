import { Component, OnInit } from '@angular/core';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidatorchklistService } from 'src/app/validatorchklist.service';
import { CitizenAuthService } from '../service-api/citizen-auth.service';
//import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit {

 
  passwordFieldType: string = 'password';
  passwordToggleImage: string = 'assets/images/hide.png';
  passwordFieldType2: string = 'password';
  passwordToggleImage2: string = 'assets/images/hide.png';
  passwordFieldType3: string = 'password';
  passwordToggleImage3: string = 'assets/images/hide.png';

  togglePasswordVisibility(typeId:any) {
    let tId=typeId;
    if(tId==1){
      if (this.passwordFieldType === 'password') {
        this.passwordFieldType = 'text';
        this.passwordToggleImage = 'assets/images/view.png';
      } else {
        this.passwordFieldType = 'password';
        this.passwordToggleImage = 'assets/images/hide.png';
      }
    }else if(tId==2){
      if (this.passwordFieldType2 === 'password') {
        this.passwordFieldType2 = 'text';
        this.passwordToggleImage2 = 'assets/images/view.png';
      } else {
        this.passwordFieldType2 = 'password';
        this.passwordToggleImage2 = 'assets/images/hide.png';
      }
    }else if(tId==3){
      if (this.passwordFieldType3 === 'password') {
        this.passwordFieldType3 = 'text';
        this.passwordToggleImage3 = 'assets/images/view.png';
      } else {
        this.passwordFieldType3 = 'password';
        this.passwordToggleImage3 = 'assets/images/hide.png';
      }
    }
    
  }

  siteURL=environment.siteURL;
  oldPassword='';
  newPassword='';
  confirmPassword='';
  loading = false;
  constructor(private encDec: EncryptDecryptService,private route:ActivatedRoute,public vldChkLst: ValidatorchklistService,public authService: CitizenAuthService,private router: Router) { }

  ngOnInit(): void {
    
  }
 
  updPassword(){
    let oldPassword=this.oldPassword;
    let newPassword = this.newPassword;
    let confirmPassword = this.confirmPassword;
   
    let vSts = true;
    if (oldPassword == '' || typeof (oldPassword) == undefined || oldPassword == null) {

      Swal.fire({
        icon: 'error',
        text: 'Enter Current Password'
      });
      vSts = false;
    }
    else if (newPassword == '' || typeof (newPassword) == undefined || newPassword == null) {

      Swal.fire({
        icon: 'error',
        text: 'Enter New Password'
      });
      vSts = false;
    }
    else if (!this.vldChkLst.validPassword(newPassword)) {
      vSts = false;
    }
    else if (oldPassword == newPassword) {
      Swal.fire({
        icon: 'error',
        text: 'Old Password and New password cannot be same'
      });
      vSts = false;
    }

    else if (confirmPassword == '' || typeof (confirmPassword) == undefined || confirmPassword == null) {
      Swal.fire({
        icon: 'error',
        text: 'Enter Confirm Password'
      });
      vSts = false;

    }
    else if (newPassword != confirmPassword) {
      Swal.fire({
        icon: 'error',
        text: 'New Password and Confirm password are not matching'
      });
      vSts = false;
    }

    else {
      vSts = true;
    }


    if (!vSts) {
      return vSts;
    }
    else {
      let userSesnInfo  = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
      let userId   = userSesnInfo.USER_ID;
      
      let regParam={
        "oldPassword":oldPassword,
        "newPassword":newPassword,
        "confirmPassword":confirmPassword,
        "chngType":1,
        "profileId":userId
      };
      this.loading = true;
      this.authService.changePasswordUpdate(regParam).subscribe(res => {
        if (res.status == 1) {
          let result = res.result;
          if (result.Status == 0) {
            Swal.fire({
                icon: 'success',
                text: result.Msg,
                allowOutsideClick: false, // Prevent closing when clicking outside
                allowEscapeKey: false, // Optional: Prevent closing with the escape key
                allowEnterKey: false // Optional: Prevent closing with the enter key
            }).then((result) => {
                this.loading = false;
                if (result.isConfirmed) {
                  this.router.navigateByUrl('/citizen-portal/login');
                }
              });
          }else{
            Swal.fire({
              icon: 'error',
              text: result.Msg
            });
            this.loading = false;
          }
          this.loading = false;
        }
        else {
          this.loading = false;
       
        }
      });
    }
    
  }
  }


