import { Component } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators, AbstractControl, FormArray } from '@angular/forms';
import { ManufactureSchemeService } from '../service-api/manufacture-scheme.service';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-mi-dashboard',
  templateUrl: './mi-dashboard.component.html',
  styleUrls: ['./mi-dashboard.component.css']
})
export class MIDashboardComponent {
  statusform =new UntypedFormGroup({});
  manufactureInfo:any;
  public loading = false;
  respSts: any;
  respStas: any;
  schemeItem: any;
  isDataFlagprice=false;
  manufactureId:any;
  totCnt:any=0;
  
  constructor(
    private formBuilder:UntypedFormBuilder,
    private api: ManufactureSchemeService,
    private encDec: EncryptDecryptService,
    private router: Router,
    private route:ActivatedRoute,
  ){

  }
 ngOnInit(): void {

    this.manufactureInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    this.manufactureId=this.manufactureInfo.USER_ID;
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
  getTotalApplication(financialYear:string,schemeId:string,){
    let params = {
        "financialYear": financialYear,
        "schemeId":schemeId,
        "manufactureId":this.manufactureId,
    };
    this.loading = true;
    this.api.getDistList(params).subscribe(res=>{
      this.loading = false;
      if(res['status']==200){
        this.isDataFlagprice = true;
        this.respStas  = res.result;
        for(let i=0;i<this.respStas.length;i++){
          let totIndivisual:any=(this.respStas[i].TotalAppReceived > 0)?this.respStas[i].TotalAppReceived:0;
          this.totCnt=parseInt(this.totCnt) + parseInt(totIndivisual);
        }    
      }
      else{
        this.respStas='';
        this.isDataFlagprice=false;
      }
  
    });

  }
  view(schemeStr : any)
  {
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/manufacture-portal/mi-blockdetails',encSchemeStr]);
  }

 }
