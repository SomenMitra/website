import { Component, OnInit } from '@angular/core';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidatorchklistService } from 'src/app/validatorchklist.service';
import { CitizenAuthService } from '../service-api/citizen-auth.service';
//import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit {

  oldPassword='';
  newPassword='';
  confirmPassword='';
  loading = false;
  constructor(private encDec: EncryptDecryptService,private route:ActivatedRoute,public vldChkLst: ValidatorchklistService,public authService: CitizenAuthService,private router: Router) { }

  ngOnInit(): void {
    
  }



  changePassword(): void {
    const passwordInput = document.querySelector('.password') as HTMLInputElement;
    const passImg = document.querySelector('.show__password') as HTMLElement;

    if (passwordInput.type === "password") {
      passImg.innerHTML = "<i class='icon-eye' title='Show'></i>";
      passwordInput.type = "text";
    } else {
      passImg.innerHTML = "<i class='icon-eye-slash' title='hide'></i>";
      passwordInput.type = "password";
    }
  }

  changePassword2(): void {
    const passwordInput = document.querySelector('.password2') as HTMLInputElement;
    const passImg = document.querySelector('.show__password2') as HTMLElement;

    if (passwordInput.type === "password") {
      passImg.innerHTML = "<i class='icon-eye' title='Show'></i>";
      passwordInput.type = "text";
    } else {
      passImg.innerHTML = "<i class='icon-eye-slash' title='hide'></i>";
      passwordInput.type = "password";
    }
  }

  changePassword3(): void {
    const passwordInput = document.querySelector('.password3') as HTMLInputElement;
    const passImg = document.querySelector('.show__password3') as HTMLElement;

    if (passwordInput.type === "password") {
      passImg.innerHTML = "<i class='icon-eye' title='Show'></i>";
      passwordInput.type = "text";
    } else {
      passImg.innerHTML = "<i class='icon-eye-slash' title='hide'></i>";
      passwordInput.type = "password";
    }
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

    else if (newPassword == oldPassword) {
      Swal.fire({
        icon: 'error',
        text: 'Current and New Password cannot be same'
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
    else if (newPassword == oldPassword) {
      Swal.fire({
        icon: 'error',
        text: 'Current and New Password cannot be same'
      });
      vSts = false;
    }
    else if (newPassword != confirmPassword) {
      Swal.fire({
        icon: 'error',
        text: 'New Password and Confirm Password are not matching'
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
      this.authService.changePassworManufacture(regParam).subscribe(res => {
        if (res.status == 1) {
          let result = res.result;
          if(result.Status==0){       
             Swal.fire({
                icon: 'success',
                text: result.Msg,
                allowOutsideClick: false, // Prevent closing when clicking outside
                allowEscapeKey: false, // Optional: Prevent closing with the escape key
                allowEnterKey: false // Optional: Prevent closing with the enter key
            }).then((result) => {
                this.loading = false;
                if (result.isConfirmed) {
                  this.router.navigateByUrl('/manufacture-portal/login');
                }
              });     
            this.loading = false;
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


