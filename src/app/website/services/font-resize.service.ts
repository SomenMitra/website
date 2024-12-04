import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FontResizeService {
  private fontSize: number = 16; // Default font size in pixels
  private readonly minFontSize: number = 14; // Minimum font size in pixels
  private readonly maxFontSize: number = 18; // Maximum font size in pixels

 

  getFontSize() {
    return this.fontSize;
  }

  increaseFontSize() {
    this.fontSize = Math.min(this.maxFontSize, this.fontSize + 1); 
    this.updateFontSize();
    this.saveFontSize(); // Save to local storage
  }

  decreaseFontSize() {
    this.fontSize = Math.max(this.minFontSize, this.fontSize - 1); 
    this.updateFontSize();
    this.saveFontSize(); // Save to local storage
  }


  private updateFontSize() {
    // document.documentElement.style.fontSize = `${this.fontSize}px`;   //globally set all
    // document.documentElement.style.overflowX = 'hidden'; 
    
    const innerPageLayout = document.querySelector('.innerpage-layout') as HTMLElement; 
    if (innerPageLayout) {
      innerPageLayout.style.fontSize = `${this.fontSize}px`; // Apply to the specific div
    }


  }

  setFontSize(size: number) {
    this.fontSize = size;
    this.updateFontSize(); // Ensure the document font size is updated
    this.saveFontSize(); // Save to local storage if needed
  }
  


  private saveFontSize() {
    localStorage.setItem('fontSize', this.fontSize.toString());
  }


  


  

}

