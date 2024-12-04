import { Component, OnInit } from '@angular/core';
import {FormArray,FormBuilder, FormControlName,FormGroup,FormControl} from '@angular/forms';
import { ValidatorchklistService } from 'src/app/validatorchklist.service';
import { ManufactureSchemeService } from 'src/app/manufacture-portal/service-api/manufacture-scheme.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';


@Component({
  selector: 'app-grievancetrackstatus',
  templateUrl: './grievancetrackstatus.component.html',
  styleUrls: ['./grievancetrackstatus.component.css']
})
export class GrievancetrackstatusComponent implements OnInit {
  manage_status : FormGroup;
  respSts : any;
  resp: any;
  grivancearray=environment.formlist;
  grievnceRefNo:"";
  grievanceURL= environment.GRIEVANCE_URL;
  constructor(private fb: FormBuilder,public vldChkLst : ValidatorchklistService,private manufactureService:ManufactureSchemeService,private router: Router,private route:ActivatedRoute,private encDec: EncryptDecryptService) {
    this.manage_status = this.fb.group({
      txtApplicationId : '',
      });
      let encGrievnceId = this.route.snapshot.paramMap.get('id');
      if(encGrievnceId){
        this.grievnceRefNo = this.encDec.decText(encGrievnceId);
        this.submitForm();
      }
   }
   

  ngOnInit(): void {
  }
  submitForm(){
    let errFlag = 0;
    let txtApplicationId = (this.manage_status.value.txtApplicationId)?this.manage_status.value.txtApplicationId:this.grievnceRefNo;
     if((errFlag == 0) && (!this.vldChkLst.blankCheck(txtApplicationId, `Reference No.`,"referenceno"))){
        errFlag = 1;  
      }
      let params = {
        txtApplicationId: txtApplicationId
      };
       this.manufactureService.grievancetrackstatus(params).subscribe((response:any)=>{

        if(response.flag==1){
          if(response.result[0]){
            this.respSts  = response.result;
          }else{
            Swal.fire({
              text: 'Invalid Reference No.',
              icon: 'error',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Ok'
          });
          }
        }else{
          errFlag = 1;
          Swal.fire({
              text: 'Somethings went Wrong!',
              icon: 'error',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Ok'
          });
        }
        });
  }
  funDir(Id: any) {
    let value: any = '';
    this.grivancearray.forEach(element => {
        if (element.value === Id) {
            value = element.key;
            return;
        }
    });
    return value;
}
}
