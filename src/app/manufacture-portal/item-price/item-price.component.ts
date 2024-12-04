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
import { ValidatorchklistService } from 'src/app/validatorchklist.service';

@Component({
  selector: 'app-item-price',
  templateUrl: './item-price.component.html',
  styleUrls: ['./item-price.component.css']
})
export class ItemPriceComponent implements OnInit {


  @ViewChild('ApplicationModal') ApplicationModal:ElementRef;
  @ViewChild('someSeedDBTVoucherModal') someSeedDBTVoucherModalRef: ElementRef;
  voucherModalDetails :any[]=[];
  seedDBT = environment.seedDBT;
  statusform =new UntypedFormGroup({});
  itemform =new UntypedFormGroup({});
  itemPrice = new UntypedFormGroup({});
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
  groupedItem: any;
  schemeItem: any;
  componentItem: any;
  subcomponentItem:any;
  mixDirectorate:any=[];
  myForm: FormGroup;
  productForm: FormGroup;
  manufactureInfo:any;
  itemGroupId:any;
  groupValue:any;
  divShow:any;
  sonali_addmore : FormGroup;
  departmentItem : any;
  priceArray :any;
  spacing :any;
  landArea :any;
  isDataFlagprice=false;
 arritems:any;
 arritemgroups:any;
 itempriceSubmitted = false;
 Price: any = 0.0;
 currentRow: string;
 objAddMr:any;
 itemPriceArray:any=[];
//  itemDetailsArr:any=[];
 fillItem:any = [];
  @ViewChild('somePriceModal') somePriceModalRef: ElementRef;


  constructor(
    private formBuilder:UntypedFormBuilder,
    private api: ManufactureSchemeService,
    private modalService: NgbModal,
    private el: ElementRef,
    private router:Router,
    private encDec: EncryptDecryptService,
    private objMstr: CitizenMasterService,
    private fb : FormBuilder,
    public vldChkLst: ValidatorchklistService,
  ) {
    this.productForm = this.fb.group({
      financialYear: '',
      quantities: this.fb.array([]) ,
    });

  }

  ngOnInit(): void {
    this.manufactureInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    this.initForm();
    this.getPMKSYScheme();
    this.getComponent();
    this.getFinancialYear();
  }
  private initForm() {
    this.statusform = this.formBuilder.group({
      'selscheme': new UntypedFormControl('',
                [
                  Validators.required,
                ]
    ),
      'selcomponentGroup': new UntypedFormControl('0',
                [
                  Validators.required,
                ]
    ),
    'selFinancialYear': new UntypedFormControl('',
                [
                  Validators.required,
                ]
    ),
    'selsubComponent': new UntypedFormControl('',
                [
                  Validators.required,
                ]
    ),
  });
}
getPMKSYScheme(){
  let params = {
    "miSchemeId": this.manufactureInfo.MI_SCHEME_ID,
    "profileId": this.manufactureInfo.USER_ID
  };
  this.loading = true;
  this.api.getPMKSYScheme(params).subscribe(res=>{
    if(res['status']==200){
      this.respSts  = res.status;
      this.respSts  = res.status;
      this.schemeItem = res.result['schemeId'];
      var element =' <option value="">-- Select --</option>';
      for (var i = 0; i < this.schemeItem.length; i++) {
        var schemeid = this.schemeItem[i].intProcessId;
        var schemename =  this.schemeItem[i].vchProcessName;
        element += '<option value="' + schemeid + '" >' + schemename + '</option>';
      }
      $('select[name="scheme"]').html(element);
      this.loading = false;
    }
    else{
      this.loading = true;
    }

  });
}
getItemGroup(){
  let params = {

  };
  this.loading = true;
  this.api.getItemGroup(params).subscribe(res=>{
    if(res['status']==200){
      this.respSts  = res.status;
      this.respSts  = res.status;
      this.groupedItem = res.result['groupId'];
      this.loading = false;
    }
    else{
      this.loading = true;
    }

  });
 }
 getComponent(){
  let params = {
      "componentId": this.manufactureInfo.MI_COMPONENT_ID
  };
  this.loading = true;
  this.api.getComponent(params).subscribe(res=>{
    if(res['status']==200){
      this.respSts  = res.status;
      this.respSts  = res.status;
      this.componentItem = res.result['componentId'];

      this.loading = false;
    }
    else{
      this.loading = true;
    }

  });
 }

 getFinancialYear(){
 
 var current_year = new Date().getFullYear()
 var amount_of_years = 1
 var next = current_year+1;

  for (var i = 0; i < amount_of_years+1; i++) {
    var year = (current_year-i).toString();
    var next = (current_year-i)+1;
    var vyear = (current_year-i) + '-' + next.toString().slice(-2);
    var element = '<option value="' + year + '">' + vyear + '</option>';
    $('select[name="financial_year"]').append(element)
  }
 }


 getItemDetails(value:string,financialYear:string){
  // let errFlag = 0;
  this.productForm = this.fb.group({
    FinancialYear: '',
    quantities: this.fb.array([]) ,
  });

  this.submitted=true;


  let params = {
    "itemGroupId": value,
    "financialYear": financialYear,
    "manufactureId":this.manufactureInfo.USER_ID
  };

  this.loading = true;
  if(financialYear!='' && value!=''){
  this.api.getItem(params).subscribe(res=>{
    if(res['status']==200){
      this.itemGroupId = res.groupId;
      this.applicationDetails = res.result['item'];
      this.loading = false;
      this.isDataFlag = true;


      this.getDepartmentDetails();
        for(let i = 0; i < this.applicationDetails.length; i++){

          let itemName = this.applicationDetails[i].ItemName;
          let price = this.applicationDetails[i].ItemPrice;
          this.newQuantity(this.applicationDetails[i].FinancialYear,this.applicationDetails[i].ItemId,this.applicationDetails[i].ItemName,this.applicationDetails[i].ItemGroupId,this.applicationDetails[i].ItemPrice,this.applicationDetails[i].ItemUnit,this.applicationDetails[i].DeptItemPrice);
          this.quantities().push(this.newQuantity(this.applicationDetails[i].FinancialYear,this.applicationDetails[i].ItemId,this.applicationDetails[i].ItemName,this.applicationDetails[i].ItemGroupId,this.applicationDetails[i].ItemPrice,this.applicationDetails[i].ItemUnit,this.applicationDetails[i].DeptItemPrice));

          // if(errFlag == 0){
          //   this.quantities().push(this.newQuantity('','','',''));
          //   }
         }
    }
    else{
      this.isDataFlag = false;
      this.loading = false;
    }

  });
}else{
  this.isDataFlag = false;
  this.loading = false;
}
 }
 getsubComponentDetails(value:string,financialYear:string){
  // let errFlag = 0;
  this.productForm = this.fb.group({
    FinancialYear: ''
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
      this.loading = false;
      this.isDataFlag = true;
      this.respSts  = res.status;
      this.respSts  = res.status;
      this.subcomponentItem = res.result['subcomponentId'];
      var element =' <option value="">-- Select --</option>';
      for (var i = 0; i < this.subcomponentItem.length; i++) {
        var subcomponentid = this.subcomponentItem[i].subcomponentId;
        var subcomponentname =  this.subcomponentItem[i].subcomponentName;
        element += '<option value="' + subcomponentid + '">' + subcomponentname + '</option>';
      }
      $('select[name="subComponent"]').html(element);
    }
    else{
      this.isDataFlag = false;
      this.loading = false;
    }

  });
}else{
  this.isDataFlag = false;
  this.loading = false;
}
 }

 getDepartmentPrice(cvalue:string,financialYear:string,subcvalue:string,schemeId:string){
  this.productForm = this.fb.group({
    FinancialYear: ''
  });

  this.submitted=true;


  let params = {
    "componentId": cvalue,
    "financialYear": financialYear,
    "manufactureId":this.manufactureInfo.USER_ID,
    "subComponent":subcvalue,
    "schemeId":schemeId
  };
  this.loading = true;
   if(financialYear!='' && cvalue!='' && subcvalue!='' && schemeId!=''){
    this.api.getDepartmentPriceOne(params).subscribe(res=>{
      if(res['status']==200){
        this.loading = false;
        this.isDataFlagprice = true;
        this.respSts  = res.status;
        this.priceArray = res.result['priceArray'];
        this.spacing = res.result['spacing'];
        this.landArea = res.result['landArea'];
      }
      else{
        this.isDataFlag = false;
        this.loading = false;
      }

    });
   }
   else{
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
  open(content: any) {

    this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false, ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  getPriceDetails(spaceid,landid) {
    let params = {
      "landid": landid,
      "spaceid": spaceid
    };
    this.currentRow=spaceid+'_'+landid;
    let itemDetailsArr= [];
    this.fillItem = [];
    //  console.log(typeof(this.priceArray[0]['details'+this.currentRow]));
    if(this.priceArray[0]['details'+this.currentRow]!=null || typeof(this.priceArray[0]['details'+this.currentRow])!='undefined'){
     if(this.priceArray[0]['details'+this.currentRow].length){
      itemDetailsArr=JSON.parse(this.priceArray[0]['details'+this.currentRow]);
       itemDetailsArr=itemDetailsArr[0];
      this.fillItem2(itemDetailsArr);
     }
    }
    this.api.getPriceDetails(params).subscribe(res=>{
      if(res['status']==200){
        this.respSts  = res.status;
        this.arritems = res.result['arritems'];
        this.arritemgroups = res.result['arritemgroups'];
        this.loading = false;
      }
      else{
        this.loading = false;
      }

    });
    this.open(this.somePriceModalRef);
  }
  keyPressEvt(type: any, evt: any, crtId: any) {

    let sts: any;

    // let dashslashnumber = <HTMLElement> document.querySelector(".dashslashnumber");
    let classname = document.getElementById(crtId).className;

    let classnameArr = classname.split(" ");

    if (classnameArr.indexOf("dashslashnumber") > -1) {
      sts = this.vldChkLst.isDashSlashNumeric(evt);
    } else {
      sts = this.vldChkLst.isAlphaNumeric(evt);
      if (type == 1) {
        sts = this.vldChkLst.isNumberKey(evt);
      }
      if (type == 2) {
        sts = this.vldChkLst.isCharKey(evt);
      }
      if (type == 3) {
        sts = this.vldChkLst.isAlphaNumeric(evt);
      }
      if (type == 4) {
        sts = this.vldChkLst.isDecimal(evt);
      }
    }



    return sts;
  }
  fillItem2(itemDetailsArr:any)
  {

    this.fillItem = [];
    if(itemDetailsArr.length)
    {

      for(let items of itemDetailsArr)
      {
        let groupId = items.igId;
        let iId = items.iId;
        let price = items.price;
        this.fillItem[groupId+"_"+iId] =price;

      }

      //   itemDetailsArr.each(function(i){
      //     let groupId = itemDetailsArr[i].igId;
      //     let iId = itemDetailsArr[i].iId;
      //     let price = itemDetailsArr[i].price;
      //     this.fillItem[groupId+"_"+iId] =price;

      // });
    }
  }
onSubmit(){
    this.submitted=true;
    if (this.productForm.invalid) {
      return;
    }
    let priceArr=[];
    let count=0;
    $("#tblPrice tr").each(function(){
      let trData = $(this);
      let priceRowArr = [];

      trData.find('.txtPrice').each(function(){
          let tdData= $(this).attr('name');

          let tdVal = $("#txt_"+tdData).val();
          let hdnitemval= $("#hdntxt_"+tdData).val();

           if(tdVal==''){

            count++;
           }
          //  else{
            priceRowArr.push({"id":tdData,"val":tdVal,'details':hdnitemval});
          //  }
      });
            priceArr.push(priceRowArr);

  });
      // if(count>0){
      //   Swal.fire({
      //     icon: 'error',
      //     text: "Enter All Price"
      //   });
      //   return false
      // }
      // else{
        let params = {
          "financialYear":this.statusform.value.selFinancialYear,
          "itemPrice": priceArr,
          "schemeId": this.statusform.value.selscheme,
          "componentId": this.statusform.value.selcomponentGroup,
          "subcomponentId":this.statusform.value.selsubComponent,
          "manufactureId":this.manufactureInfo.USER_ID

        };

        this.loading = true;
        this.api.saveManufactureItemPrice(params).subscribe(res=>{
          if(res['status']==200){
            this.loading = false;
            Swal.fire({
              icon: 'success',
              text: "Item Price Updated Successfully"
            }).then((res)=>{
              window.location.reload();
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
       //}

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
      }
      else{
        this.isDataFlag = false;
        this.loading = false;
      }

    });
   }
   get k(): { [key: string]: AbstractControl } {
    return this.itemPrice.controls;
  }
  submitItemPrice() {
    this.itempriceSubmitted = true;
    if (this.itemPrice.invalid) {
      return;
    }

    this.objAddMr = { "details": []};
    let obChldjAddMr = [];
    const itemPrices=$('.itemPrice');
    const itemId=$('.itemId');
    const itemName=$('.itemName');
    const groupId=$('.groupId');
    this.Price = 0.0;
    for (var i = 0; i < itemPrices.length; i++)
    {
      var item_price=itemPrices[i].getAttribute('id');
      var actualitem_price=parseFloat((document.getElementById(item_price) as HTMLTextAreaElement).value);
      var item_name=itemName[i].getAttribute('id');
      var actualitem_name=(document.getElementById(item_name) as HTMLTextAreaElement).innerHTML;
      var item_group=groupId[i].getAttribute('id');
      var actualitem_group=(document.getElementById(item_group) as HTMLTextAreaElement).value;
      if(Number.isNaN(actualitem_price)){
        this.loading = false;
        Swal.fire({
          icon: 'error',
          text: "Enter Price for "+ actualitem_name
        });
        return false
      }
      var item_id=itemId[i].getAttribute('id');
      var actualitem_id=parseFloat((document.getElementById(item_id) as HTMLTextAreaElement).value);
      var item_price=itemPrices[i].getAttribute('id');
      this.Price =this.Price+actualitem_price;
      var arrAddMr = {
        "iId":actualitem_id,
        'igId':actualitem_group,
        "price": actualitem_price
      };
      obChldjAddMr.push(arrAddMr);
    }
    (this.objAddMr.details).push(obChldjAddMr);
     let CurRow = this.currentRow;
    this.Price =this.Price.toFixed(2);
    var mainpriceId = $("#udpatePrice_"+CurRow).closest('.test').find('input.txtPrice[type=text]').attr('id');
    $("#"+mainpriceId).val(this.Price);
    this.productForm.patchValue({ [mainpriceId]:this.Price });

    var hdnpriceId = $("#udpatePrice_"+CurRow).closest('.test').find('input.hdnprice[type=hidden]').attr('id');
    $("#"+hdnpriceId).val(JSON.stringify(this.objAddMr.details));
    this.productForm.patchValue({ [hdnpriceId]:JSON.stringify(this.objAddMr.details) });

    $("#apponlineCompletionClose").click();
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














