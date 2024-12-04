import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import { CitizenSchemeService } from '../service-api/citizen-scheme.service';

@Component({
  selector: 'app-scheme-tab',
  templateUrl: './scheme-tab.component.html',
  styleUrls: ['./scheme-tab.component.css']
})
export class SchemeTabComponent implements OnInit {
  resSchmTabSts:any;
  resSchmTabList:any;
  @Input() pSchemeId: any;
  @Input() pApplicantId: any;
  @Input() currTabIndxP:any;

  @Output() dataToSchmApply:any = new EventEmitter()
  currTabIndx = 0;
  constructor(private objSchmCtrl:CitizenSchemeService) { }

  ngOnInit(): void {
    this.currTabIndx = (this.currTabIndxP>0)?this.currTabIndxP:this.currTabIndx;
    this.getTabList();
  }
  getTabList()
  {
    let params = {
      "schemeId":this.pSchemeId,
      "profileId":this.pApplicantId
    };
    this.objSchmCtrl.schemeMainSctns(params).subscribe(res=>{
        this.resSchmTabSts  = res.status;
        this.resSchmTabList = res.result;
        let param = {"currTabIndx": this.currTabIndx,"schmTabLst":this.resSchmTabList};
        this.dataToSchmApply.emit(param);
    }); 
  }
}
