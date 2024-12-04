import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators, AbstractControl, FormArray } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ManufactureSchemeService } from '../service-api/manufacture-scheme.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from '@angular/common';
import { ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptDecryptService } from '../../encrypt-decrypt.service';
import { CitizenMasterService } from '../service-api/citizen-master.service';
import {FormGroup,FormBuilder, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { CitizenProfileService } from '../service-api/citizen-profile.service';
import { CitizenSchemeService } from '../service-api/citizen-scheme.service';
import { FileUploadService } from '../file-upload.service';
import { HttpResponse, HttpEventType } from '@angular/common/http';
import { ValidatorchklistService } from 'src/app/validatorchklist.service';
//import { PmksyService } from '../../../pmksy/service-api/pmksy.service';

@Component({
  selector: 'app-update-boq',
  templateUrl: './update-boq.component.html',
  styleUrls: ['./update-boq.component.css']
})
export class UpdateBoqComponent implements OnInit {
 

  @ViewChild('ApplicationModal') ApplicationModal:ElementRef;
  @ViewChild('someSeedDBTVoucherModal') someSeedDBTVoucherModalRef: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;
  voucherModalDetails :any[]=[];
  seedDBT = environment.seedDBT;
  statusform =new UntypedFormGroup({});
  itemform =new UntypedFormGroup({});
  itemForm : FormGroup;
  itemPrice = new UntypedFormGroup({});
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
  mixDirectorate:any=[];
  myForm: FormGroup;
  productForm: FormGroup;
  manufactureInfo:any;
  itemGroupId:any;
  groupValue:any;
  divShow:any;
  departmentItem:any;
  applicationId:any;
  odishaoneIntID: any;
  profileId:any;
  farmInfoSts: any;
  applicantId: any;
  applicantName: any;
  emailId: any;
  mobileNo: any;
  fatherNm: any;
  aadhaarNo: any;
  gender: any;
  castCatg: any;
  dob :  any;
  districtNm: any;
  blockNm: any;
  gpNm: any;
  villageNm: any;
  address: any;
  profImgUrl: any;
  dtmAppliedOn: any;
  applicationStatus: any;
  odishaone_vchRequest: any;
  odishaone_encData: any;
  voucherPreviewStatus : number;
  schmHrDt: any;
  manufactureFlag: any;
  appId: any;
  serviceId: any;
  schemeName : any;
  up: number = 0;
  totalMPrice : any;
  totalPrice: any;
  spacingList: any;
  priceDetail: any;
  itemGroup: any;
  arritems: any;
  arritemgroups: any;
  componentId: any;
  subComponentId: any;
  landAreaId: any;
  spacingId: any;
  itempriceSubmitted: any;
  totalmiPrice: any;
  boqUpdate: any;
  objAddMr: any;
  staticArray: string[];
  actualuploadFileIdd: any;
  objAddMrFile: any;
  obChldjAddMrFile: any;
  percentUploaded = [0];
  isMultipleUploaded = false;
  isDraft = false;
  totExcOther:any;
  totIncOther:any;
  totalItemPrice:any;
  totalFittingPrice:any;
  totalGSTAmount:any;
  totalMIGSTPrice:any;
  fittingPercentage:any;
  appStatus:any;
  resubmitManufacture=environment.RESUBMIT_MANUFACTURE;
  MIreveretRemrks:any='';

  acceptedExtensions = 'jpg,jpeg,png,pdf';
  fileType = 'jpg,jpeg,png,pdf';
  farmerType: any;
  uploadedFiles: { [key: number]: File } = {};
  constructor(
    private formBuilder:UntypedFormBuilder,
    private api: ManufactureSchemeService,
    private modalService: NgbModal,
    private el: ElementRef,
    private router:Router,
    private encDec: EncryptDecryptService,
    private objMstr: CitizenMasterService,
    private fb : FormBuilder,
    private route: ActivatedRoute,
    private objProf: CitizenProfileService,
    private objSchmCtrl: CitizenSchemeService,
    private fuService: FileUploadService,
    //private objPMKSY:PmksyService,
    public vldChkLst: ValidatorchklistService    
  ) { 
    this.staticArray = ['Water Test Report', 'Soil Test Report', 'Area Map Design Report', 'Spot Inspection Report','GDB Format Map','Farmer Acceptance Report','SF/MF Certificate from AHO']; 

  }

  ngOnInit(): void {
    this.initForm();
    // this.getItemGroup();
    let encSchemeId = this.route.snapshot.paramMap.get('id');
    let schemeStr = this.encDec.decText(encSchemeId);
    let schemeArr = schemeStr.split(':');

    
            
    this.schemeId = schemeArr[0];
    this.applicationId = schemeArr[1];
    this.profileId = schemeArr[2];
    // this.itemGroupId = schemeArr[3];
    this.componentId = schemeArr[3];
    this.manufactureFlag = schemeArr[4];
    this.serviceId = schemeArr[5];
    this.schemeName = schemeArr[6];
    this.subComponentId = schemeArr[7];
    this.landAreaId = schemeArr[8];
    this.spacingId = schemeArr[9];
    
    this.manufactureInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));    
    setTimeout(() => {
      this.getFarmrInfo();
    }, 1000);
    if(this.voucherPreviewStatus == 1)
      {
        $('#collapseOne').removeClass('show');
        $('.farmerInfoAccordian').addClass('collapsed');
      }      
      // this.getItemDetails(this.itemGroupId,this.applicationId);
      // this.getSpace();
      this.getItemGroup();   
      //this.getIfResubmit();
  }
  
  private initForm() {

    this.productForm = this.fb.group({
      quantities: this.fb.array([]) ,
      optionalquantities: this.fb.array([]) ,
    });    

    
}

getItemGroup(){
  let params = {
   "manufactureId":this.manufactureInfo.USER_ID,
   "componentId":this.componentId,
   "subComponentId":this.subComponentId,
   "landAreaId":this.landAreaId,
   "spacingId":this.spacingId,
   "schemeId":this.schemeId,
   "applicationId":this.applicationId
  };
  // this.loading = true;
  this.api.getItemGroup(params).subscribe(res=>{
    if(res['status']==200){
      
      //console.log(res.result);
      //console.log(res.result.arritems);
      this.arritems=res.result.arritems;
      this.arritemgroups=res.result.arritemgroups;
      this.appStatus=res.result.appStatus;
      this.itemGroup = res.result;
      // console.log(res.result.itemGroup);
      // this.itemGroup = res.result.itemGroup;
      // this.priceDetail  = res.result.itemDetail;
      // console.log(Object.keys(this.priceDetail));
      this.loading = false;
      setTimeout(() => {
        this.calTotalMIPrice();
      }, 1000);
      
    }
    else{
      this.loading = false;
    }
    
  });
 }

//   getSpace(){

//   let params = {
    
//   };
//   this.loading = true;
//   this.api.getSpace(params).subscribe(res=>{
//     console.log(res);
//     if(res['status']==200){
//       this.spacingList = res.result;
//       console.log(this.spacingList);
//       this.loading = false;
//       this.isDataFlag = true;

//       console.log(this.spacingList);        
//     }
//     else{
//       this.isDataFlag = false;
//       this.loading = false;
//     }
    
//   });
//  }
 getItemDetails(itemGroupId,applicationId){
  // let errFlag = 0;
  this.productForm = this.fb.group({
    quantities: this.fb.array([]),
    optionalquantities: this.fb.array([])
  });
 
  this.submitted=true;
  

  let params = {
    "manufactureId":this.manufactureInfo.USER_ID,
    "itemGroupId":itemGroupId,
    "applicationId":applicationId
  };
  this.loading = true;
  this.api.getManufactureItem(params).subscribe(res=>{
    if(res['status']==200){
      this.applicationDetails = res.result;
      this.loading = false;
      this.isDataFlag = true;

        for(let i = 0; i < this.applicationDetails.length; i++){

          let itemName = this.applicationDetails[i].ItemName;
          let price = this.applicationDetails[i].vchItemPrice;
          if(this.applicationDetails[i].intItemGroupId!=3){
            this.newQuantity(this.applicationDetails[i].intItemId,this.applicationDetails[i].ItemName,this.applicationDetails[i].intItemGroupId,this.applicationDetails[i].vchItemPrice,this.applicationDetails[i].vchUnit,this.applicationDetails[i].quantity,this.applicationDetails[i].totalPrice);
            this.quantities().push(this.newQuantity(this.applicationDetails[i].intItemId,this.applicationDetails[i].ItemName,this.applicationDetails[i].intItemGroupId,this.applicationDetails[i].vchItemPrice,this.applicationDetails[i].vchUnit,this.applicationDetails[i].quantity,this.applicationDetails[i].totalPrice));
          }else if(this.applicationDetails[i].intItemGroupId==3){
            this.newOptionalQuantity(this.applicationDetails[i].intItemId,this.applicationDetails[i].ItemName,this.applicationDetails[i].intItemGroupId,this.applicationDetails[i].vchItemPrice,this.applicationDetails[i].vchUnit,this.applicationDetails[i].quantity,this.applicationDetails[i].totalPrice);
            this.optionalquantities().push(this.newQuantity(this.applicationDetails[i].intItemId,this.applicationDetails[i].ItemName,this.applicationDetails[i].intItemGroupId,this.applicationDetails[i].vchItemPrice,this.applicationDetails[i].vchUnit,this.applicationDetails[i].quantity,this.applicationDetails[i].totalPrice));
          }
          

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
 }
 
  quantities() : FormArray {
    return this.productForm.get("quantities") as FormArray
  }
  optionalquantities() : FormArray {
    return this.productForm.get("optionalquantities") as FormArray
  }

  newQuantity(itemId,itemname,itemGroupId,itemPrice,itemUnit,quantity,totalPrice): FormGroup {
    return this.fb.group({
      itemId: itemId,
      itemName: itemname,
      itemGroupId: itemGroupId,
      price: itemPrice,
      unit: itemUnit,
      manufactureId: this.manufactureInfo.USER_ID,
      quantity: quantity,
      totalPrice: totalPrice
    })
  }

  newOptionalQuantity(itemId,itemname,itemGroupId,itemPrice,itemUnit,quantity,totalPrice): FormGroup {
    return this.fb.group({
      itemId: itemId,
      itemName: itemname,
      itemGroupId: itemGroupId,
      price: itemPrice,
      unit: itemUnit,
      manufactureId: this.manufactureInfo.USER_ID,
      quantity: quantity,
      totalPrice: totalPrice
    })
  }


  get f(): { [key: string]: AbstractControl } {
    return this.statusform.controls;
  }

  get i(): { [key: string]: AbstractControl } {
    return this.productForm.controls;
  }
  
  
  getFarmrInfo() {
    let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    this.odishaoneIntID = farmerInfo.ODISHAONE_INTEGRATIONID;
    let params = {
      "profileId": this.profileId,
      "applicationId":this.applicationId,
      "schemeId":this.schemeId,
      "subConstKey":"MKUY_CATEGORY",
      "odishaoneIntID":this.odishaoneIntID
    };
    this.loading = true;
    this.objProf.profileBuild(params).subscribe(res => {
      this.farmInfoSts = res.status;
      if (res.status > 0) {
        let resProfInfo = res.result['profileInfo'];
        // get profile info
        this.applicantId = resProfInfo['applicantId'];
        this.applicantName = resProfInfo['applicantName'];
        this.emailId = resProfInfo['emailId'];
        this.mobileNo = resProfInfo['mobileNo'];
        this.fatherNm = resProfInfo['fatherNm'];
        this.farmerType = resProfInfo['farmerType'];
        let aadhaarNoP = resProfInfo['aadhaarNo'];
        this.aadhaarNo = '';
        if (aadhaarNoP != '') {
          this.aadhaarNo = "X".repeat(8) + aadhaarNoP.substr(8, 4);
          }
        this.gender = resProfInfo['genderNm'];
        this.castCatg = resProfInfo['castCatgNm'];
        let dobV = resProfInfo['dob'];
        if(dobV != ''){
          let dtmDob = new Date(dobV);
          this.dob = formatDate(dtmDob, 'dd-MMM-yyyy', 'en-US');
        }
        this.districtNm = resProfInfo['districtNm'];
        this.blockNm = resProfInfo['blockNm'];
        this.gpNm = resProfInfo['gpNm'];
        this.villageNm = resProfInfo['vlgNm'];
        this.address = resProfInfo['address'];
        this.profImgUrl = resProfInfo['profPic'];
        this.dtmAppliedOn = resProfInfo['dtmAppliedOn'];
        this.applicationStatus = resProfInfo['intApplicationStatus'];
        this.odishaone_vchRequest = resProfInfo['vchRequest'] ?(resProfInfo['vchRequest']):"";
        this.odishaone_encData = resProfInfo['ODISHAONE_encData']?resProfInfo['ODISHAONE_encData']:"";
        this.loading = false;
      }
    },
      error => {
        Swal.fire({
          icon: 'error',
          text: environment.errorMsg
        });
        this.loading = false;
      });
  }
  getSchmDynmCtrls() {
    let params = {
      "schemeId": this.schemeId,
      "profileId": this.profileId,
      "applicationId": this.profileId,
      "mainSectionId": 0,
      "appHistId": ''
    };
    this.loading = true;
    this.objSchmCtrl.schemeDynCtrls(params).subscribe(res => {
      if (res.status > 0) {
        this.schmHrDt = res.result['schmSrvArr'];
        //console.log(this.schmHrDt.schmServTypeNm);
        
        this.loading = false;
        this.initForm();


      }
    },
      error => {
        Swal.fire({
          icon: 'error',
          text: environment.errorMsg
        });
        this.loading = false;
      });
  }

    onSubmit(){
    this.submitted=true;
    if (this.productForm.invalid) {
      return;
    }

    let params = {
      "itemPrice": this.productForm.value.quantities,
      "optionalitemPrice": this.productForm.value.optionalquantities,
      "itemGroupId": this.itemGroupId,
      "manufactureId":this.manufactureInfo.USER_ID,
      "applicationId":this.applicationId

    };
    // console.log(this.itemGroupId);
    // console.log(this.productForm.value.quantities);
    this.loading = true;
    this.api.updateBoq(params).subscribe(res=>{
      if(res['status']==200){
        this.up = 1;
        this.loading = false;
        Swal.fire({
          icon: 'success',
          text: "BOQ Updated Successfully"
        }).then(() => {
          this.router.navigate(['/manufacture-portal/mi-dashboard']);
          });
        

        // this.router.navigate(['/home/seed-preview', encAppCtnId]).then(() => {
        //   window.location.reload();
        // });
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


   
  //  quantityChange(event, product) {
  //   console.log(product.value.price);
  //   console.log(product.value.quantity
  //     );

  
    //     this.totalMPrice =  product.value.price * product.value.quantity;
  //     console.log(this.totalMPrice);
  // }

  // quantityChange($event,quantity) {
  //   console.log(quantity);
  //   console.log(quantity.value.price);
  //   console.log(quantity.value.quantity);
  //   this.totalPrice = quantity.value.price * quantity.value.quantity;

    
  // } 
  // onKeyUp(event) {
  //   // Handle the key-up event here
  //   console.log('Key up:', event);
  // }

  inputValue: string;
  totalDigits: string;

  // onKeyPress(event) {
  //   console.log(this.itemQuantity);
  //   const inputValue = (this.itemQuantity || '').replace(/\D/g, '');
  //   this.totalDigits = inputValue;
  //   console.log(this.totalDigits);
  // }
  
  onKeyPress(itemGroupId,itemId){
    const totalPriceArray = [];
    // console.log(itemGroupId);
    // console.log(itemId);
    let mp = "miPrice_"+itemGroupId+'_'+itemId;
    let q = "quantity_"+itemGroupId+'_'+itemId;
    let tp = "totalPrice_"+itemGroupId+'_'+itemId;
    this.totalPrice = 0.0;
    this.totalmiPrice = 0.0;
    var actualmiPrice=parseFloat((document.getElementById(mp) as HTMLTextAreaElement).value);
    var actualquantity=parseFloat((document.getElementById(q) as HTMLTextAreaElement).value);
    // console.log(actualmiPrice);
    // console.log(actualquantity);

    this.totalPrice = actualmiPrice * actualquantity;
    // console.log(this.totalPrice);
    
    (document.getElementById(tp) as HTMLTextAreaElement).value = this.totalPrice;
    const myInput = (document.getElementById(tp) as HTMLTextAreaElement);
      
      myInput.readOnly = true;


      var slides = document.getElementsByClassName("totalPrice");
      var totPrice:any=0;
      var gstAmt:any=0;
      var fittingCharge:any=0;
      for (var i = 0; i < slides.length; i++) {
        let priceId=slides.item(i).getAttribute('id');
        let price=( < HTMLInputElement > document.getElementById(priceId)).value; 
        let priceArr=priceId.split("_");
        var concatId=parseInt(priceArr[1])+'_'+parseInt(priceArr[2]);
        if(parseInt(priceArr[1])==3){          
          if ($('#chkOptional_'+concatId).is(':checked')) {                   
            totPrice= parseFloat(totPrice) + parseFloat(price);
          }         
        }else{ 
          if ($('#chkMandatory_'+concatId).is(':checked')) {                   
            totPrice= parseFloat(totPrice) + parseFloat(price);
          }      
        }        
      }
      this.totalItemPrice=totPrice;
      this.fittingPercentage=(this.componentId == 1)?5:0;
      fittingCharge=parseFloat(totPrice) * this.fittingPercentage/100;
      this.totalFittingPrice=fittingCharge;
      var totAmt=totPrice + fittingCharge;
      gstAmt= (parseFloat(totAmt) * 12 )/100;
      var finalGSTAmount=parseFloat(gstAmt).toFixed(2);
      this.totalGSTAmount=finalGSTAmount;
      var totMIPrice=parseFloat(totPrice) + parseFloat(fittingCharge) + parseFloat(finalGSTAmount);
      //var totMIPrice=parseFloat(totPrice + fittingCharge + finalGSTAmount).toFixed(2);
      this.totalMIGSTPrice=totMIPrice;
  }
  calTotalMIPrice(){
      var slides = document.getElementsByClassName("totalPrice");
      var totPrice:any=0;
      var gstAmt:any=0;
      var fittingCharge:any=0;
      for (var i = 0; i < slides.length; i++) {        
        let priceId=slides.item(i).getAttribute('id');
        let price=( < HTMLInputElement > document.getElementById(priceId)).value; 
        let priceArr=priceId.split("_");
        var concatId=parseInt(priceArr[1])+'_'+parseInt(priceArr[2]);
        if(parseInt(priceArr[1])==3){          
          if ($('#chkOptional_'+concatId).is(':checked')) {                   
            totPrice= parseFloat(totPrice) + parseFloat(price);
          }         
        }else{ 
          if ($('#chkMandatory_'+concatId).is(':checked')) {                   
            totPrice= parseFloat(totPrice) + parseFloat(price);
          }      
        }       
      }
      //console.log(totPrice);
      this.totalItemPrice=totPrice;
      this.fittingPercentage=(this.componentId == 1)?5:0;
      this.totalItemPrice=totPrice;
      fittingCharge=parseFloat(totPrice) * this.fittingPercentage/100;
      this.totalFittingPrice=fittingCharge;
      var totAmt=totPrice + fittingCharge;
      gstAmt= (parseFloat(totAmt) * 12 )/100;
      var finalGSTAmount=parseFloat(gstAmt).toFixed(2);
      this.totalGSTAmount=finalGSTAmount;
      var totMIPrice=parseFloat(totPrice) + parseFloat(fittingCharge) + parseFloat(finalGSTAmount);
      this.totalMIGSTPrice=totMIPrice;
      //console.log(finalGSTAmount);
  }
  submitItemPrice(){
    let totChecked=$('.chkMandatory').filter(':checked').length;
    if(totChecked <= 0){
      this.loading = false;
      Swal.fire({
        icon: 'error',
        text: "Please check item for update BOQ"
      });
      return false;  
    }
    if(this.appStatus == this.resubmitManufacture){
      if($('#resubmitRmrkMI').val()==''){
        this.loading = false;
        Swal.fire({
          icon: 'error',
          text: "Please Enter Reveret Remarks"
        });
        return false;
      }else{
        var MIremarks=$('#resubmitRmrkMI').val();
        this.MIreveretRemrks=MIremarks;
      }
      
    }
    this.submitted=true;
    if (this.productForm.invalid) {
      return;
    }

    const mId = this.manufactureInfo.USER_ID;


    const itemId = $('.itemId');
    const itemName = $('.itemName');
    const itemGroupId = $('.itemGroupId');
    const miPrice = $('.miPrice');
    const quantity = $('.quantity');
    const chkOptional = $('.chkOptional');
    const totalPrice = $('.totalPrice');
    const uploadFile = $('.uploadFile');
    
    this.totalPrice = 0.0;
    let obChldjAddMr = [];
    let obChldjAddOptMr = [];
    this.objAddMr = { "details": []};
    this.objAddMrFile = { "detail": []};
    let obChldjAddMrFile = [];
    const formData = new FormData();
    this.totExcOther=0;
    this.totIncOther=0;
    for (var i = 0; i < itemId.length; i++)
    {

      var itemIdd=itemId[i].getAttribute('id');
      var actualitemIdd=parseFloat((document.getElementById(itemIdd) as HTMLTextAreaElement).value);
      var itemNamee=itemName[i].getAttribute('id');
      var actualitemName=(document.getElementById(itemNamee) as HTMLTextAreaElement).value;
      var itemGroupIdd=itemGroupId[i].getAttribute('id');
      var actualitemGroupId=parseFloat((document.getElementById(itemGroupIdd) as HTMLTextAreaElement).value);
      var miPrices=miPrice[i].getAttribute('id');
      var actualmiprice=parseFloat((document.getElementById(miPrices) as HTMLTextAreaElement).value);
      var item_quantity=quantity[i].getAttribute('id');
      var actualquantity=parseFloat((document.getElementById(item_quantity) as HTMLTextAreaElement).value);        
      this.totalPrice = actualmiprice * actualquantity;
      
      
      var concatId=actualitemGroupId+'_'+actualitemIdd;
      if(Number(actualitemGroupId)!=3){
        this.totExcOther=this.totExcOther + this.totalPrice;
          if ($('#chkMandatory_'+concatId).is(':checked')) {
          if(Number.isNaN(actualquantity)){
            this.loading = false;
            Swal.fire({
              icon: 'error',
              text: "Enter the Quantity of "+actualitemName
            });
            return false;   
          }   
          var arrAddMr = {
            "gId":actualitemGroupId,
            "itemId":actualitemIdd,        
            "miPrice":actualmiprice,
            "quantity": actualquantity,
            "totalPrice": this.totalPrice
          };  
          obChldjAddMr.push(arrAddMr);
        }
      }
      else if(Number(actualitemGroupId)==3){
        if ($('#chkOptional_'+concatId).is(':checked')) {
          if(Number.isNaN(actualquantity)){
            this.loading = false;
            Swal.fire({
              icon: 'error',
              text: "Enter the Quantity of "+actualitemName
            });
            return false            
          }
          var arrAddOptMr = {
            "gId":actualitemGroupId,
            "itemId":actualitemIdd,        
            "miPrice":actualmiprice,
            "quantity": actualquantity,
            "totalPrice": this.totalPrice
          };
          var arrAddMr = {
            "gId":actualitemGroupId,
            "itemId":actualitemIdd,        
            "miPrice":actualmiprice,
            "quantity": actualquantity,
            "totalPrice": this.totalPrice
          };
          this.totIncOther=this.totIncOther + this.totalPrice;
          obChldjAddOptMr.push(arrAddOptMr);
          obChldjAddMr.push(arrAddMr);
        }
        
      }    
      
    }  
    formData.append('obChldjAddMr', JSON.stringify(obChldjAddMr));
    formData.append('obChldjAddOptMr', JSON.stringify(obChldjAddOptMr));
    formData.append('totExcOther', this.totExcOther);
    formData.append('totIncOther', this.totIncOther);
    formData.append('decTotalAmt', this.totalItemPrice);
    formData.append('decFittingCharges', this.totalFittingPrice);
    formData.append('decTotGst', this.totalGSTAmount);
    formData.append('decTotMIPrice', this.totalMIGSTPrice);
    formData.append('txtMIRemarks', this.MIreveretRemrks);

    const fileInputs = document.querySelectorAll('.uploadFile') as NodeListOf<HTMLInputElement>;

    // Loop through each file input
        
        formData.append("schemeId", this.schemeId);
        formData.append("manufactureId", this.manufactureInfo.USER_ID);
        formData.append("componentId", this.componentId);
        formData.append("subComponentId", this.subComponentId);
        formData.append("landAreaId", this.landAreaId);
        formData.append("spacingId", this.spacingId);
        formData.append("profileId", this.profileId);
        formData.append("applctnId", this.applicationId);
        formData.append("draftSts", String(this.isDraft));
        let fileNames = '';
        let fileArr = [];
    for (let i = 0; i < fileInputs.length; i++) {
      const fileInput = fileInputs[i];
      const files = fileInput.files;     
      
        const file = files[0];
      if (file == undefined && !(this.farmerType === '1' && (this.castCatg === 'SC' || this.castCatg === 'ST') && this.staticArray[i] === 'SF/MF Certificate from AHO')) {
          Swal.fire({
            icon: 'error',
            text: 'Upload '+this.staticArray[i]
          });
          return false;
          }

          else if(file)
        {
          
          let uploadedFileType = file.type;
          let uploadedFileSize = file.size;
          const selectedFileList = (fileInput);
          const extension = selectedFileList.value.split('.').pop();
          let UploadFileConvesion=Math.round((uploadedFileSize / 1024));
          let acceptableTypes = this.fileType.split(',');
          const accepteableLowercase = acceptableTypes.map(acceptableTypes => acceptableTypes.toLowerCase());
          const maxSizeInMB =1;
          const fileSizeInMB = file.size / (1024 * 1024);
          if(accepteableLowercase.includes(extension.toLowerCase()) == false)
          {
            Swal.fire({
              icon: 'error',
              text: 'Upload only '+this.fileType+' files for '+this.staticArray[i]
            });

            return false;
          }

          else if(fileSizeInMB > maxSizeInMB){
            Swal.fire({
              icon: 'error',
              text: this.staticArray[i]+' should be < '+ maxSizeInMB+'MB'
            });

            return false;
          }

        }

          
        
        fileArr.push({"id":'file'+i,"name":this.staticArray[i]})
        formData.append('file'+i, file);
        } 
    formData.append('allFiles', JSON.stringify(fileArr));
    fileNames += 'allFiles' + ",";
    fileNames = fileNames.replace(/,\s*$/, "");
    formData.append("fileNames", fileNames);

    
    this.uploadFile(formData, 1);
  }
  uploadFile(formData: any, fileNum: number) {
    
    Swal.fire({
      title: 'Proceed to submit',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.fuService.uploadDocumentWithProgress(formData)
          .subscribe(event => {
            if (event.type === HttpEventType.UploadProgress) {
              this.percentUploaded[fileNum] = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.fileUploadSuccess();
              let upSts = event['body']['status'];
              let upMsg = event['body']['msg'];
              // start after uploaded
              if(upSts==1)
              {
                this.loading = false;
                  Swal.fire({
                    icon: 'success',
                    text: upMsg
                  }).then(() => {
                          this.router.navigate(['/manufacture-portal/mi-dashboard']);
                  });
              }
              else{
                this.loading = false;
                Swal.fire({
                  icon: 'error',
                  text: upMsg
                });
              }
              // end after uploaded
            }
          },
            err => console.log(err)
          );
      }
    })
    
      
     
  }

  fileUploadSuccess() {
    let flag = true;
    this.percentUploaded.forEach(n => {
      if (n !== 100) {
        flag = false;
      }
    });
    if (flag) {
      this.isMultipleUploaded = true;
    }
  }
  goBack(event: Event) {
    event.preventDefault();
    window.history.back();
  }
  onFileChange(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.uploadedFiles[index] = input.files[0];
    } else {
      this.uploadedFiles[index] = null; // Clear the file if no file is selected
    }
  }

  previewFile(file: File, event: Event): void {
    event.preventDefault();  // Prevent form submission
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, '_blank');
  }
}
  

