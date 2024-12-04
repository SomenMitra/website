import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';


@Component({
  selector: 'app-seed-dbt-demo',
  templateUrl: './seed-dbt-demo.component.html',
  styleUrls: ['./seed-dbt-demo.component.css']
})
export class SeedDbtDemoComponent implements OnInit {
  siteURL = environment.siteURL;
  constructor(private router: Router, private route: ActivatedRoute, private encDec: EncryptDecryptService) { }
  pageNameDtl = '';
  videoUrl = '';
  ngOnInit(): void {
    let encPageName = this.route.snapshot.paramMap.get('id');
    let pageName = this.encDec.decText(encPageName);
    this.pageNameDtl = pageName;
    // if (pageName=='Farmer') {
    //   this.videoUrl = 'F6FpHQPjP0Q';
    // } else {
    //   this.videoUrl = 'lVmEMqFvDo4';
    // }

  }

  goBack() {
    this.router.navigate(['/home/seed-apply/' + environment.seedDBTPre]);
  }

}
