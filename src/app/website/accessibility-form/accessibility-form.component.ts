import { Component, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { FontResizeService } from '../services/font-resize.service';

@Component({
  selector: 'app-accessibility-form',
  templateUrl: './accessibility-form.component.html',
  styleUrls: ['./accessibility-form.component.css']
})
export class AccessibilityFormComponent {


  
  isMenuOpen = false;
  isDropdownOpen: boolean = false;

  private routerSubscription: Subscription = new Subscription;
  isOpen: boolean | undefined;



  // font resize ts
  private readonly minFontSize: number = 14; 
  private readonly maxFontSize: number = 18; 
  fontCount: number = 2; 
  FontResizeService: any;

  constructor(private fontResizeService: FontResizeService) {}


  
  get fontSize() {
    return this.fontResizeService.getFontSize();
  }

  get progressPercentage() {
    return ((this.fontSize - this.minFontSize) / (this.maxFontSize - this.minFontSize)) * 100;
  }

  increaseFont() {
    const newSize = this.fontResizeService.getFontSize() + 1; // Increment font size
    if (newSize <= this.maxFontSize) { 
      this.fontResizeService.increaseFontSize();
      this.fontCount = Math.min(this.fontCount + 1, 4);
    }
  }

  decreaseFont() {
    const newSize = this.fontResizeService.getFontSize() - 1; // Decrement font size
    if (newSize >= this.minFontSize) { 
      this.fontResizeService.decreaseFontSize();
      this.fontCount = Math.max(this.fontCount - 1, -4);
    }
  }
  // font resize ts


  buttons = [
    { label: 'Monochrome', title: 'Monochrome', active: false, iconType: 'monoChrome' },
    { label: 'Light Theme', title: 'Toggle Theme', active: false, iconType: 'lightTheme' }, // Combine dark and light theme
    { label: 'Highlight Link', title: 'Highlight Link', active: false, iconType: 'hilightLink' },
    { label: 'Screen Reader', title: 'Screen Reader', active: false, iconType: 'screenReader' }
  ];



toggleActive(index: number) {
    const clickedButton = this.buttons[index];

    // Check if the clicked button is a theme button
    const isThemeButton = clickedButton.iconType === 'darkTheme' || clickedButton.iconType === 'lightTheme';

    if (isThemeButton) {
        // Handle theme switching
        if (clickedButton.iconType === 'darkTheme') {
            this.setTheme('theme-light');
            clickedButton.label = 'Light Theme';
            clickedButton.iconType = 'lightTheme';
        } else if (clickedButton.iconType === 'lightTheme') {
            this.setTheme('theme-dark');
            clickedButton.label = 'Dark Theme';
            clickedButton.iconType = 'darkTheme';
        }

        // Deactivate all buttons except theme buttons
        this.buttons.forEach((button) => {
            if (button.iconType !== 'darkTheme' && button.iconType !== 'lightTheme') {
                button.active = false; 
            }
        });

        // Mark the clicked theme button as active
        clickedButton.active = true;

    } else {
        // Handle other buttons (monochrome, highlight link, etc.)
        const isActive = clickedButton.active;

        // Deactivate all buttons
        this.buttons.forEach(button => {
            button.active = false; 
        });

        // Toggle the clicked button
        if (!isActive) {
            clickedButton.active = true; 
            this.setItem('activeButtonIndex', index.toString()); 
        } else {
            clickedButton.active = false; 
            this.setItem('activeButtonIndex', ''); // Clear active button index from local storage
        }

        // Handle monochrome toggle
        const monochromeButton = this.buttons.find(button => button.iconType === 'monoChrome');
        if (monochromeButton) {
            this.setMonochrome(monochromeButton.active);
        }

        // Handle highlight link toggle
        const highlightButton = this.buttons.find(button => button.iconType === 'hilightLink');
        if (highlightButton) {
            this.setHilightlink(highlightButton.active);
        }
    }
}
// check buttona ctive in page reload
private checkActiveButtonOnLoad() {
  const activeButtonIndex = this.getItem('activeButtonIndex');
  
  if (activeButtonIndex) {
      const index = parseInt(activeButtonIndex, 10);
      if (this.buttons[index]) {
          this.buttons.forEach((button, i) => {
              button.active = (i === index);
          });
      }
  }
}
// check buttona ctive in page reload





  //  theme setup
  private setTheme(theme: string) {
      console.log(`Setting theme: ${theme}`);
      const body = document.body;
      body.classList.remove('theme-light', 'theme-dark'); 
      body.classList.add(theme); 
  
      // Save the current theme to local storage
      this.setItem('currentTheme', theme);
  }
  
  private checkThemeOnLoad() {
      const savedTheme = this.getItem('currentTheme');
      //console.log(`Saved theme from local storage: ${savedTheme}`);
      if (savedTheme) {
          this.setTheme(savedTheme); 
      } else {
          this.setTheme('theme-light');
      }
  }


  //  theme setup




  //  highlight link add
  private setHilightlink(isActive: boolean) {
    const links = document.querySelectorAll('a'); 
    links.forEach(link => {
        if (isActive) {
            link.classList.add('highlight__text'); 
        } else {
            link.classList.remove('highlight__text'); 
        }
    });
    
    // Save the active state to local storage

    if (isActive) {
        this.setItem('highlightLinkActive', 'true');
    } else {
        this.removeItem('highlightLinkActive');
    }


    
}


private checkHighlightLinkOnLoad() {
  const isActive = this.getItem('highlightLinkActive') === 'true';
  this.setHilightlink(isActive);
}


  //  highlight link add


  //  monochrome setup
  private setMonochrome(isActive: boolean) {
    const body = document.body;
    if (isActive) {
      body.classList.add('add_monochrome');
      this.setItem('monochromeActive', 'true');
    } else {
      body.classList.remove('add_monochrome');
      this.removeItem('monochromeActive');
    }
  }

  private checkMonochromeOnLoad() {
    const isActive = this.getItem('monochromeActive') === 'true';
    this.setMonochrome(isActive);
  }
  //  monochrome setup


  // screen reader tabindex set
  private setTabIndexForScreenReader() {
    const screenReaderElements = document.querySelectorAll('.screen__reader'); // Select elements
    screenReaderElements.forEach((element, index) => {
      (element as HTMLElement).tabIndex = index + 1; // Set tabindex
    });
  }
  // screen reader tabindex set

  resetActive(event: MouseEvent) {
    event.preventDefault();

    // Deactivate all buttons
    this.buttons.forEach(button => button.active = false);

    // Reset theme to default
    this.setTheme('theme-light'); // Reset to your default theme

    // Remove monochrome class
    this.setMonochrome(false);

    // Remove highlight link class
    this.setHilightlink(false);

    // Reset font count to 0
    this.fontCount = 2;
    
    this.fontResizeService.setFontSize(16);

  }
  
  

  //  reset button all


  handleClick(event: MouseEvent) {
    this.resetActive(event); 
  }


  toggleMegamenu(event: MouseEvent) {
    event.preventDefault(); // Prevent default link behavior
    this.isMenuOpen = !this.isMenuOpen;
    document.body.classList.toggle('menu-open', this.isMenuOpen);
    const menu = document.getElementById('megaMenu');
    if (menu) {
      menu.classList.toggle('show', this.isMenuOpen);
    }

    if (this.isMenuOpen) {
      this.focusSearchInput(); // Focus the search input when opening the menu
    }
  }
  focusSearchInput() {
    throw new Error('Method not implemented.');
  }




  // Toggle dropdown state
  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  // Detect click outside the dropdown and reset
  @HostListener('document:click', ['$event.target'])
  onClickOutside(targetElement: HTMLElement) {
    const clickedInside = targetElement.closest('#dropdownMenuButton');
    if (!clickedInside && this.isDropdownOpen) {
      this.isDropdownOpen = false;
    }
  }





  ngOnInit() {
    this.checkMonochromeOnLoad();  //reload to class set
    this.checkHighlightLinkOnLoad(); //reload to class set
    this.checkThemeOnLoad();  //reload to class set
    this.checkActiveButtonOnLoad(); //reload to class set
}

ngAfterViewInit() {
  this.setTabIndexForScreenReader();
}



  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }

  }

  
// Local Storage set Methods
private setItem(key: string, value: string) {
  localStorage.setItem(key, value);
}

private getItem(key: string): string | null {
  return localStorage.getItem(key);
}

private removeItem(key: string) {
  localStorage.removeItem(key);
}

// Local Storage set Methods


}
