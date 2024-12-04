import { Component, OnInit, ElementRef,ViewChild } from '@angular/core';
import { environment } from '../../../environments/environment';
import { NgbDateStruct, NgbModal, ModalDismissReasons  } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormBuilder, UntypedFormControl, UntypedFormGroup, NG_ASYNC_VALIDATORS, Validators } from '@angular/forms';
import { WebsiteApiService } from '../website-api.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  error: any;
  DistrictNames: any;
  BankNames: any;
  ifscForm: any;
  Banks: any[];
  siteURL = environment.siteURL;
  apiUrl=environment.apiUrl;
  ifscSubmitted = false;
  isIFSCFlag = false;

  @ViewChild('someModal') someModalRef:ElementRef;
  constructor(private modalService: NgbModal,
     private apilist:WebsiteApiService
 
    ) { }

  ngOnInit(): void {
   
  }
  getIFSC(){

    this.Banks = [];
    this.ifscForm = new UntypedFormGroup({
      'vchBankName': new UntypedFormControl('', 
                    [
                      Validators.required,
                    ]
      ),
      'vchDistrictName': new UntypedFormControl('', 
                    [
                      Validators.required,
                    ]
      )
    });
   
    let params = { };
   this.apilist.getIfscCode(params).subscribe(res=>{
     
          this.BankNames = res.result['bankDetails'];
          this.DistrictNames = res.result['districtDetails'];
        },
        error => {
          this.error = error
          this.BankNames = []
          this.DistrictNames = []
        }

      );
    this.open(this.someModalRef);

  
  }
  get j(): { [key: string]: AbstractControl } {
    return this.ifscForm.controls;
  }
  searchIFSC(){
    
    this.ifscSubmitted = true;
    if (this.ifscForm.invalid) {
      return;
    }
    let params = { 
      bankName:this.ifscForm.value.vchBankName,
      distName:this.ifscForm.value.vchDistrictName
    }
    this.apilist.getifscDetails(params)
      .subscribe(
        (data: any)=> {
          if(data.status=='1'){
            this.Banks = data.result;
            this.isIFSCFlag = true;
           console.log(data.result)
          }else{
            this.isIFSCFlag = false;
            Swal.fire({
              icon: 'error',
              text: data.errMsg
            });
          }
            
        },
        error => {
          this.error = error
          this.Banks = [];
         // console.log(error);
          Swal.fire({
            icon: 'error',
            text: 'No Records Found!'
          });
        }

      );
  }
  open(content:any) {
  
    this.modalService.open(content, {size: 'lg',backdrop: 'static',keyboard: false,ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  close(content:any) {
  
    this.modalService.open(content, {size: 'lg',backdrop: 'static',keyboard: false,ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
}
