import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CitizenSchemeService } from '../service-api/citizen-scheme.service';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-success',
  templateUrl: './failure.component.html',
  styleUrls: ['./failure.component.css']
})
export class FailureComponent implements OnInit {
  

  constructor(private route:ActivatedRoute,private router: Router, private objSchm:CitizenSchemeService,private encDec: EncryptDecryptService) { }
  
  applicantId:any;
  schemeId:any;
  applctnId: any;
  applctnNo:any;
  applctnNm:any;
  loading = false;

  ngOnInit(): void {
   
  }




}
