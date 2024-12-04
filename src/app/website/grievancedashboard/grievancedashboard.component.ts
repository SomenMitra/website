import { Component, OnInit } from '@angular/core';
import { ManufactureSchemeService } from 'src/app/manufacture-portal/service-api/manufacture-scheme.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-grievancedashboard',
  templateUrl: './grievancedashboard.component.html',
  styleUrls: ['./grievancedashboard.component.css']
})
export class GrievancedashboardComponent implements OnInit {
  farmerInfo: any;
  applicantMob: any;
  applicantUserId: any;
  respSts:any;
  applicationId:any;
  trackappId:any;
  grievanceURL= environment.GRIEVANCE_URL;

  constructor(private api:ManufactureSchemeService,private encDec: EncryptDecryptService,private router: Router, private route:ActivatedRoute,) { }

  ngOnInit(): void {
    let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    this.applicantMob     = farmerInfo.USER_MOBILE;
    this.applicantUserId     = farmerInfo.USER_ID;
    this.fetchDashboardData();
  }
  fetchDashboardData(){
    let params = {
      applicationId: this.applicantUserId,
      applicantMob: this.applicantMob,
    };
    this.api.getDashboardData(params).subscribe(res=> { 
    if(res.flag==1){
      this.respSts  = res.result;
    }
    });
  }
  doGrievancePreview(trackappId:any){
    let encSchemeStr = this.encDec.encText(trackappId.toString());
    this.router.navigate(['/home/grievancetrackstatus',encSchemeStr]);
  } 

}
