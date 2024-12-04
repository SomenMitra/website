import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators, AbstractControl, FormArray } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ManufactureSchemeService } from '../service-api/manufacture-scheme.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from '@angular/common';
import { ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { EncryptDecryptService } from '../../encrypt-decrypt.service';
import { CitizenMasterService } from '../service-api/citizen-master.service';
import {FormGroup,FormBuilder, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manufacture-price',
  templateUrl: './manufacture-price.component.html',
  styleUrls: ['./manufacture-price.component.css']
})
export class ManufacturePriceComponent implements OnInit {
 

  @ViewChild('ApplicationModal') ApplicationModal:ElementRef;
  @ViewChild('someSeedDBTVoucherModal') someSeedDBTVoucherModalRef: ElementRef;
  voucherModalDetails :any[]=[];
  seedDBT = environment.seedDBT;
  statusform =new UntypedFormGroup({});
  itemform =new UntypedFormGroup({});
  itemForm : FormGroup; 
  submitted = false;
  applications: any;
  public loading = false;
  bodyData: any;
  applicationDetails: any;
  isDataFlag = false;
  siteURL = environment.siteURL;
  dtApplication = '--';
  SchemePrev: any;
  error: any;
  applicationNo:any;
  otherDetails:any;
  schemeId:any;
  p: number = 1;
  farmerInfo:any;
  directorateInfo:any[]=[];
  respSts: any;
  component: any;
  mixDirectorate:any=[];
  myForm: FormGroup;
  productForm: FormGroup;
  manufactureInfo:any;
  itemGroupId:any;
  groupValue:any;
  divShow:any;
  sonali_addmore : FormGroup;
  departmentItem : any;
  subcomponent : any;
  
  constructor(
    private formBuilder:UntypedFormBuilder,
    private api: ManufactureSchemeService,
    private modalService: NgbModal,
    private el: ElementRef,
    private router:Router,
    private encDec: EncryptDecryptService,
    private objMstr: CitizenMasterService,
    private fb : FormBuilder
  ) { 
    this.productForm = this.fb.group({
      financialYear: '',
      quantities: this.fb.array([]) ,
    });

  }

  ngOnInit(): void {
    this.initForm();
    this.getComponent();
    this.getFinancialYear();
    this.manufactureInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    // this.getDepartmentItem();
    // console.log(this.statusform.value.selItemGroup);
    // console.log(this.manufactureInfo.USER_ID);
  }
  private initForm() {
    this.statusform = this.formBuilder.group({
      'selItemGroup': new UntypedFormControl('',
                [
                  Validators.required,
                ]
    ),
    'selFinancialYear': new UntypedFormControl('',
                [
                  Validators.required,
                ]
    ),     
  });
}
getComponent(){
  let params = {
   
  };
  this.loading = true;
  this.api.getComponent(params).subscribe(res=>{
    if(res['status']==200){
      this.respSts  = res.status;   
      this.respSts  = res.status;
      this.component = res.result['componentId'];
      console.log(this.component);
      this.loading = false;
    }
    else{
      this.loading = true;
    }
    
  });
 }

 getFinancialYear(){
  // var currentYear = new Date().getFullYear();
  // for(var i = 0; i < 6; i++){
  //   var next = currentYear+1;
  //   var year = currentYear + '-' + next.toString().slice(-2);
  //   var vyear = (currentYear-i).toString();
  //   $('#fYear').append(new Option(year, vyear));
  //   currentYear--;    
  // }

  var current_year = new Date().getFullYear()
 var amount_of_years = 6
 var next = current_year+1;

  for (var i = 0; i < amount_of_years+1; i++) {
    var year = (current_year-i).toString();
    var next = (current_year-i)+1;
    var vyear = (current_year-i) + '-' + next.toString().slice(-2);
    var element = '<option value="' + year + '">' + vyear + '</option>';
    $('select[name="financial_year"]').append(element)
  }
 }
 

 getSubcomponent(value:string,financialYear:string){
  // let errFlag = 0;
  this.productForm = this.fb.group({
    FinancialYear: '',
    quantities: this.fb.array([]) ,
  });
 
  this.submitted=true;
  

  let params = {
    "componentId": value,
    "financialYear": financialYear,
    "manufactureId":this.manufactureInfo.USER_ID
  };
  this.loading = true;
  if(financialYear!='' && value!=''){
  this.api.getSubcomponent(params).subscribe(res=>{
    if(res['status']==200){
      this.respSts  = res.status;   
      this.respSts  = res.status;
      this.subcomponent = res.result['subcomponentId'];
      this.loading = false;
    }
    else{
      this.loading = true;
    }
    
  });
}else{
  this.isDataFlag = false;
  this.loading = false;
}
 }
 
  quantities() : FormArray {
    return this.productForm.get("quantities") as FormArray
  }

  newQuantity(financialYear,itemId,itemname,itemGroupId,itemPrice,itemUnit,deptItemPrice): FormGroup {
    return this.fb.group({
      financialYear: financialYear,
      itemId: itemId,
      itemName: itemname,
      itemGroupId: itemGroupId,
      price: itemPrice,
      manufactureId: this.manufactureInfo.USER_ID,
      itemUnit: itemUnit,
      deptItemPrice: deptItemPrice
    })
  }


  get f(): { [key: string]: AbstractControl } {
    return this.statusform.controls;
  }

  get i(): { [key: string]: AbstractControl } {
    return this.productForm.controls;
  }
  
  

    onSubmit(){
    this.submitted=true;
    if (this.productForm.invalid) {
      return;
    }

    let params = {
      "financialYear":this.productForm.value.financialYear,
      "itemPrice": this.productForm.value.quantities,
      "itemGroupId": this.itemGroupId,
      "manufactureId":this.manufactureInfo.USER_ID

    };
    console.log(params);
    console.log(this.productForm.value.quantities);
    this.loading = true;
    this.api.saveItemPrice(params).subscribe(res=>{
      if(res['status']==200){
        this.loading = false;
        Swal.fire({
          icon: 'success',
          text: "Item Price Updated Successfully"
        });
      }
      else{
        this.loading = true;
        Swal.fire({
          icon: 'error',
          text: "Something Went Wrong"
        });
      }
      
    });
   }

   
   getDepartmentItem(){
    // let errFlag = 0;
    
    
  
    let params = {
      
    };
    this.loading = true;
    this.api.getDepartmentItem(params).subscribe(res=>{
      if(res['status']==200){
        this.departmentItem = res.result;
        this.loading = false;
        this.isDataFlag = true;
  
        console.log(this.departmentItem);
      }
      else{
        this.isDataFlag = false;
        this.loading = false;
      }
      
    });
   }

   getDepartmentDetails(){
    // let errFlag = 0;
    
   
    this.submitted=true;
    
  
    let params = {
      "itemGroupId": '',
      "manufactureId":''
    };
    this.loading = true;
    this.api.getDepartmentItem(params).subscribe(res=>{
      if(res['status']==200){
        this.departmentItem = res.result;
        this.loading = false;
        // this.isDataFlag = true;
  
        console.log(this.departmentItem);
      }
      else{
        // this.isDataFlag = false;
        this.loading = false;
      }
      
    });
   }


   changeItemGroup(){
    
   }
}





