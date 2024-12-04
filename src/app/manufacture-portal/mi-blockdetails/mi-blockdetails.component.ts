import { Component } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators, AbstractControl, FormArray } from '@angular/forms';
import { ManufactureSchemeService } from '../service-api/manufacture-scheme.service';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import { Router, ActivatedRoute } from '@angular/router';





@Component({
  selector: 'app-mi-blockdetails',
  templateUrl: './mi-blockdetails.component.html',
  styleUrls: ['./mi-blockdetails.component.css']
})
export class MiBlockdetailsComponent {
  statusform =new UntypedFormGroup({});
  public loading = false;
  manufactureInfo:any;
  respSts: any;
  respStass: any;
  respStas: any;
  schemeItem: any;
  distlist: any;
  isDataFlagprice: any;
  financialYear: any;
  schemeId: any;
  distId: any;
  manufactureId:any;
  blockId:any;
  totCnt:any=0;

  

  constructor(
    private formBuilder:UntypedFormBuilder,
    private api: ManufactureSchemeService,
    private router: Router,
    private route:ActivatedRoute,
    private encDec: EncryptDecryptService,

  ){

  }


  ngOnInit(): void {
    this.loading = true;
    this.manufactureInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    this.manufactureId=this.manufactureInfo.USER_ID;  
    
    let encSchemeId = this.route.snapshot.paramMap.get('id');
    let schemeStr = this.encDec.decText(encSchemeId);
    let schemeArr = schemeStr.split(':');
    this.financialYear = schemeArr[0];
    this.schemeId = schemeArr[1];
    this.distId = schemeArr[2];
    this.getFinancialYear(this.financialYear);
    this.getPMKSYScheme(this.schemeId,this.manufactureInfo.USER_ID);
    this.getAllDist(this.distId);
    this.getMIBlockdetails(this.financialYear,this.schemeId,this.distId)
   }


   getFinancialYear(financialYear){
    var current_year = new Date().getFullYear()
    var amount_of_years = 1
    var next = current_year+1;
   
     for (var i = 0; i < amount_of_years+1; i++) {
       var year = (current_year-i).toString();
       var next = (current_year-i)+1;
       var vyear = (current_year-i) + '-' + next.toString().slice(-2);
       var selected=(financialYear == year)?"selected=selected":'';
       var element = '<option '+selected+' value="' + year + '">' + vyear + '</option>';
       $('select[name="financial_year"]').append(element)
     }
    }

    getPMKSYScheme(schemeId,profileId){
      this.loading = true;
      let params = {
        "miSchemeId": this.manufactureInfo.MI_SCHEME_ID,
        "profileId": this.manufactureInfo.USER_ID
      };
      
      this.api.getPMKSYScheme(params).subscribe(res=>{
        if(res['status']==200){
          this.respStass  = res.status;
          this.respStass  = res.status;
          this.schemeItem = res.result['schemeId'];
          var element =' <option value="">-- Select --</option>';
          for (var i = 0; i < this.schemeItem.length; i++) {
            var schemeid = this.schemeItem[i].intProcessId;
            var schemename =  this.schemeItem[i].vchProcessName;
            var selected=(schemeId == schemeid)?"selected=selected":'';
            element += '<option '+selected+' value="'+ schemeid +'">' + schemename + '</option>';
          }
          $('select[name="scheme"]').html(element);
          this.loading = false;
        }
        else{
          this.loading = true;
        }
  });
  }

  getAllDist(distId){
    this.loading = true;
    let params = {
      "miSchemeId": this.manufactureInfo.MI_SCHEME_ID
    };
    this.api.getAllDist(params).subscribe(res=>{
      if(res['status']==200){
        this.respSts  = res.status;
        this.respSts  = res.status;
        this.distlist= res.result;
        
        //console.log(res.result);
        var element =' <option value="">-- Select --</option>';
        for (var i = 0; i < this.distlist.length; i++) {
          var distid = this.distlist[i].intDemoHierarchyValueId;
          var distName =  this.distlist[i].vchDemoHierarchyValue;
          var selected=(distId == distid)?"selected=selected":'';
          element += '<option '+selected+' value="' + distid + '" >' + distName + '</option>';
        }
        $('select[name="dist"]').html(element);
        this.loading = false;
      }
      else{
        this.loading = true;
      }
});

  }
  getMIBlockdetails(financialYear:string,schemeId:string,distId:string){
    this.loading = true;
    let params = {
      "financialYear": financialYear,
       "schemeId":schemeId,
       "distId":distId,
       "manufactureId":this.manufactureId,     
    };
    this.api.getMIBlockdtls(params).subscribe(res=>{
      if(res['status']==200){
        this.loading = false;
        this.isDataFlagprice = true;
        this.respStas  = res.result;
        for(let i=0;i<this.respStas.length;i++){
          let totIndivisual:any=(this.respStas[i].TotalAppReceived > 0)?this.respStas[i].TotalAppReceived:0;
          this.totCnt=parseInt(this.totCnt) + parseInt(totIndivisual);
        }
       }
      else{        
        this.loading = true;
        this.respStas='';
        this.isDataFlagprice=false;
      }  
    });
  }
  viewAppliedScheme(schemeStr : any)
  {
    //console.log(schemeStr);
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/manufacture-portal/mi-dashboard',encSchemeStr]);
  }
}
