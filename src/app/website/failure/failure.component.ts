import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-failure',
  templateUrl: './failure.component.html',
  styleUrls: ['./failure.component.css']
})
export class FailureComponent implements OnInit {

  loading = false;
  constructor() { }

  ngOnInit(): void {
  }

}
