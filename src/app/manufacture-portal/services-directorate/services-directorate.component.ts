import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CitizenSchemeService } from '../service-api/citizen-scheme.service';
import { EncryptDecryptService } from '../../encrypt-decrypt.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-services-directorate',
  templateUrl: './services-directorate.component.html',
  styleUrls: ['./services-directorate.component.css']
})
export class ServicesDirectorateComponent implements OnInit {
  public loading = false;
  respSts: any;
  groupedDirectorate: any;
  dirIcons = environment.directoryListicons;
  constructor(private router: Router, private objSchm: CitizenSchemeService, private encDec: EncryptDecryptService) { }

  ngOnInit(): void {
    this.getDirectorates();
  }
  viewServicespage(schemeStr : any)
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
    
   
  this.groupedDirectorate = res.result['other'];
      this.loading = false;
    console.log(this.groupedDirectorate);
    
   
      }
      else{
        this.loading = true;
      }
      
    });
   }
}
