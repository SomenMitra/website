import { Component, OnInit } from '@angular/core';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidatorchklistService } from 'src/app/validatorchklist.service';
import { CitizenAuthService } from '../service-api/citizen-auth.service';
//import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-changeforgotpassword',
  templateUrl: './changeforgotpassword.component.html',
  styleUrls: ['./changeforgotpassword.component.css']
})
export class ChangeforgotpasswordComponent implements OnInit {

  encStr;
  newPassword='';
  confirmPassword='';
  loading = false;
  constructor(private encDec: EncryptDecryptService,private route:ActivatedRoute,public vldChkLst: ValidatorchklistService,public authService: CitizenAuthService,private router: Router) { }
  ngOnInit(): void {
    let encMobileNo  = this.route.snapshot.paramMap.get('id');
    this.encStr = this.encDec.decText(encMobileNo);
    console.log(this.encStr);

    
  }
  updFPassword(){
    let newPassword = this.newPassword;
    let confirmPassword = this.confirmPassword;
   
    let vSts = true;
    if (newPassword == '' || typeof (newPassword) == undefined || newPassword == null) {

      Swal.fire({
        icon: 'error',
        text: 'Enter Password'
      }).then(function(){
        window.setTimeout(function () { 
        document.getElementById('txtNewPassword').focus();
        }, 500); 
    });
      vSts = false;
    }
    else if (!this.vldChkLst.validPassword(newPassword,'txtNewPassword')) {
      vSts = false;
    }

    else if (confirmPassword == '' || typeof (confirmPassword) == undefined || confirmPassword == null) {
      Swal.fire({
        icon: 'error',
        text: 'Enter Confirm Password'
      }).then(function(){
        window.setTimeout(function () { 
        document.getElementById('txtConfirmPassword').focus();
        }, 500); 
    });
      vSts = false;

    }
    else if (newPassword != confirmPassword) {
      Swal.fire({
        icon: 'error',
        text: 'Password and Confirm password are not matching'
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
      let regParam={
        "mobileNo":this.encStr,
        "newPassword":newPassword,
        "confirmPassword":confirmPassword,
        "chngType":2
      };
      this.loading = true;
      this.authService.changePasswordUpdate(regParam).subscribe(res => {
        if (res.status == 1) {
          let result = res.result;
          if(result.Status==0){
            this.loading = false;
            Swal.fire({
              text: 'Password reset successfully',
              showDenyButton: false,
              //showCancelButton: true,
            }).then((result) => {
              /* Read more about isConfirmed, isDenied below */
              this.router.navigateByUrl('/citizen-portal/login');
            })
            
            
          }else{
            Swal.fire({
              icon: 'error',
              text: result.msg
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
