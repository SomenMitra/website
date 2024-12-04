import { Component, HostListener } from '@angular/core';
import { IdleService } from './idle.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FARD';
  devMode = environment.production;
  userAgent: string;
  isAndroid: boolean;
  isIOS: boolean;
  constructor(private idleService: IdleService) {}
 
  ngOnInit() {
    // this.userAgent = navigator.userAgent;
    // this.isAndroid = /Android/i.test(this.userAgent);
    // this.isIOS = /iPhone|iPad|iPod/i.test(this.userAgent);
    // console.log('User Agent:', this.userAgent);
    // console.log('Is Android:', this.isAndroid);
    // console.log('Is iOS:', this.isIOS);
    this.idleService.startWatching();
    // if(!this.isAndroid && !this.isIOS ){
    //   this.detectDevTools();
    // }
  }
 
  onActivate(event) {
    window.scroll(0, 0);
  }
 
  /**
   * Description: This code is used for disabled right click option
   * Created on: 25th Sep 2024
   * Created by: Manish Kumar
   */
  @HostListener('document:contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    if (this.devMode) {
      event.preventDefault();
    }
  }
 
   /**
  * Description: This code is used for disabled keyboard option ctrl + shif + i and fn + f12
  * Created on: 25th Sep 2024
  * Created by: Manish Kumar
  */
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.devMode) {
      if (
        (event.ctrlKey && event.shiftKey && (event.key === 'I' || event.key === 'J')) ||
        (event.ctrlKey && event.key === 'U') ||
        event.key === 'F12'
      ) {
        event.preventDefault();
      }
    }
  }
 
  /**
  * Description: This code is used for disabled browser developer tools
  * Created on: 25th Sep 2024
  * Created by: Manish Kumar
  */
  /*detectDevTools() {
    if (this.devMode) {
        const threshold = 160;  
        let devtoolsOpen = false;
 
        const checkDevTools = () => {
            const widthDiff = Math.abs(window.outerWidth - window.innerWidth);
            const heightDiff = Math.abs(window.outerHeight - window.innerHeight);
            if ((widthDiff > threshold || heightDiff > threshold) && !devtoolsOpen) {
                devtoolsOpen = true;
                Swal.fire({
                  title: 'Warning',
                  text: 'Developer tools detected! Please close the tools.',
                  icon: 'warning',
                  allowOutsideClick: false, // Disable outside click
                  confirmButtonText: 'OK'
                }).then((result) => {
                  if (result.isConfirmed) {
                    // Reload the page
                    window.location.reload();
                  }
                });
            }
            else if (devtoolsOpen && widthDiff <= threshold && heightDiff <= threshold) {
                devtoolsOpen = false;
            }
        };
 
        // Listen for resize and mousemove events to check for Developer Tools
        window.addEventListener('resize', checkDevTools);
        window.addEventListener('mousemove', checkDevTools);
    }
}*/
 
 
}