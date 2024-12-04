import { Component, OnInit } from '@angular/core';
import { ManufactureSchemeService } from 'src/app/manufacture-portal/service-api/manufacture-scheme.service';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-grievanceacknowledge',
  templateUrl: './grievanceacknowledge.component.html',
  styleUrls: ['./grievanceacknowledge.component.css']
})
export class GrievanceacknowledgeComponent implements OnInit {
  respSts : any;
  respStsDir : any;
  grivancearray=environment.formlist;
  printPage() {
    window.print();
  }
  txtServiceId : any;
    constructor(private api:ManufactureSchemeService, 
    private router: Router,
    private route:ActivatedRoute,
    private encDec: EncryptDecryptService,) { 
    let encSeviceId = this.route.snapshot.paramMap.get('id');
//console.log();

  if (encSeviceId != '') {

    let schemeStr = this.encDec.decText(encSeviceId);
    let schemeArr: any = schemeStr.split(':');
    this.txtServiceId = schemeArr[0];
   //console.log(this.txtFormId);
    }
    }

  ngOnInit(): void {
    this.fetchData();
  }
  
  fetchData() {
    let params = {
      txtServiceId: this.txtServiceId
    };
    this.api.getpreView(params).subscribe(res=> {       
       if(res.flag==1){
        this.respSts  = res.result;
        //console.log(this.respStsDir);
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



