import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import { CitizenAuthService } from '../service-api/citizen-auth.service';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { ValidatorchklistService } from 'src/app/validatorchklist.service';
import { TranslateService } from '@ngx-translate/core';
import { OdishaoneRedirectService } from '../../odishaoneredirect.service';

@Component({
  selector: 'app-odishaonelogout',
  //templateUrl: './odishaonelogout.component.html',
  template: '<ul><ng-content></ng-content></ul>',
  styleUrls: ['./odishaonelogout.component.css'],
  providers: [CitizenAuthService]
})
export class OdishaonelogoutComponent implements OnInit {

  constructor(public authService: CitizenAuthService,
    private route: ActivatedRoute,
    private encDec: EncryptDecryptService,
    private router: Router,
    public vldChkLst: ValidatorchklistService,
    public translate: TranslateService,
    private objRedirectOdishaone: OdishaoneRedirectService
  ) { }

  ngOnInit(): void {
    let userId   = this.route.snapshot.paramMap.get('id');
    let jsonData =  JSON.parse(atob(userId));
    console.log(jsonData);
    let odishaone_encData = jsonData.ODISHAONE_encData;
    let CANCELURL = jsonData.CANCELURL;
    console.log(CANCELURL);
    this.objRedirectOdishaone.post(odishaone_encData,CANCELURL);


  }

}
