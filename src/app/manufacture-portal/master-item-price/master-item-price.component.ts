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
  selector: 'app-master-item-price',
  templateUrl: './master-item-price.component.html',
  styleUrls: ['./master-item-price.component.css']
})
export class MasterItemPriceComponent implements OnInit {

  statusform =new UntypedFormGroup({});
  productForm: FormGroup;
  schemeId:any;
  schemeItem: any;
  manufactureInfo:any;
  public loading = false;
  public sbBtton = false;
  respSts: any;
  arritems: any;
  arritemgroups: any;

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
    {
      this.productForm = this.fb.group({
        financialYear: '',
        quantities: this.fb.array([]) ,
      });
  
    }
  }

  ngOnInit(): void {
    this.manufactureInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    this.getFinancialYear();
    this.getPMKSYScheme();
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
    getPMKSYScheme(){
      let params = {
        "miSchemeId": this.manufactureInfo.MI_SCHEME_ID,
        "profileId": this.manufactureInfo.USER_ID
      };
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
    getItemPrice(financialYear:string,schemeId:string,){
      let params = {
        "financialYear": financialYear,
        "schemeId":schemeId,
        "manufactureId":this.manufactureInfo.USER_ID
      };
      this.loading = true;
      this.api.getItemList(params).subscribe(res=>{
        if(res['status']==200){
          this.loading = false;
          this.arritems=res.result.result.arritems;
          this.arritemgroups=res.result.result.arritemgroups;
          this.sbBtton=true;
        }
        else{
          this.sbBtton=false;
          this.loading = false;
        }
    
      });
    }
    onSubmit(){
      let fYear=$("#fYear").val();
      let schemeId=$("#scheme").val();
      let priceArr = [];
      let priceRowArr = [];
      this.loading = true;
      $(".itemPrice").each(function(){
        //let txtData = $(this);
        let tdData= $(this).attr('name');
        let priceVal = $("#itemPrice_"+tdData).val();
        //if(Number(priceVal) > 0){
          let groupVal = $("#itemGrId_"+tdData).val();
          let itemVal= $("#itemId_"+tdData).val();
          priceRowArr.push({"itemGroupId":groupVal,"itemId":itemVal,"itemPrice":priceVal});
        //}
        
      });
      //priceArr.push(priceRowArr);

      let params = {
        "itemPrice": priceRowArr,
        "manufactureId": this.manufactureInfo.USER_ID,
        "financialYear":fYear,
        "schemeId":schemeId
      };
      this.api.saveManufactureMasterPrice(params).subscribe(res=>{
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
      
    }

}
