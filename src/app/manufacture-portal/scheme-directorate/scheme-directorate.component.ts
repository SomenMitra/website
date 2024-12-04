import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CitizenSchemeService } from '../service-api/citizen-scheme.service';
import { EncryptDecryptService } from '../../encrypt-decrypt.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-scheme-directorate',
  templateUrl: './scheme-directorate.component.html',
  styleUrls: ['./scheme-directorate.component.css']
})
export class SchemeDirectorateComponent implements OnInit {
  public loading = false;
  respSts: any;
  groupedDirectorate: any;
  otherDirectorate: any;

  
  dirIcons = environment.directoryListicons;
  constructor(private router: Router, private objSchm: CitizenSchemeService, private encDec: EncryptDecryptService) { }

  ngOnInit(): void {
    this.getDirectorates();
  }

  viewSchemsPage(schemeStr : any)
  {
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/citizen-portal/scheme-list',encSchemeStr]);
  }

  getDirectorates(){
    let params = {
     
    };
    this.loading = true;
    this.objSchm.getDirectorates(params).subscribe(res=>{
      if(res['status']==200){
  
      this.respSts  = res.status;
    
   
  this.groupedDirectorate = res.result['schemService'];
  this.otherDirectorate = res.result['other'];
      this.loading = false;
    console.log(this.groupedDirectorate);
    
   
      }
      else{
        this.loading = true;
      }
      
    });
   }
}
