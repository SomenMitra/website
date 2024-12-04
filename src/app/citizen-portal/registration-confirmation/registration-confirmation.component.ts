import { Component, OnInit } from '@angular/core';
import { CitizenProfileService } from '../service-api/citizen-profile.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';

@Component({
  selector: 'app-registration-confirmation',
  templateUrl: './registration-confirmation.component.html',
  styleUrls: ['./registration-confirmation.component.css']
})
export class RegistrationConfirmationComponent implements OnInit {
  applicantId:any;
  applicantName:any;
  emailId:any;
  mobileNo:any;
  uniqueId:any;
  constructor(
    private citzSrv:CitizenProfileService,private router:Router, private route:ActivatedRoute,private encDec:EncryptDecryptService,
 ) { }


  ngOnInit(): void {
    let encId        = this.route.snapshot.paramMap.get('id');
    let profId       = this.encDec.decText(encId);
    let params = {
      "profileId":profId
    };
    this.citzSrv.profileBuild(params).subscribe(res=>{
      if(res.status>0)
      {
        let responseInfo   = res.result['profileInfo'];
        // get profile info
        this.applicantId   = responseInfo['applicantId'];
        this.applicantName = responseInfo['applicantName'];
        this.emailId       = responseInfo['emailId'];
        this.mobileNo      = responseInfo['mobileNo'];
        this.uniqueId      = responseInfo['uniqueId'];
      }
    });
  }

}
