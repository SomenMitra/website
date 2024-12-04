import { Directive, HostListener, ElementRef } from '@angular/core';
@Directive({
  selector: 'input[type=text],textarea'
})
export class NoSpecialCharacterAtFirstDirective {
 // private specialCharsRegex: RegExp = /^[!@#$%^&*(),.?":{}|<>_-]/;
  private specialCharsRegex: RegExp =  /^[A-Za-z0-9-]*$/;
  constructor(private el: ElementRef) { }
  @HostListener('keyup', ['$event']) onKeyUp(event: KeyboardEvent) {
    this.blockSpecialCharFirst();
  }
  private blockSpecialCharFirst() {
    const input = this.el.nativeElement.value;
    // If the first character is a special character, remove it
    if (!this.specialCharsRegex.test(input.charAt(0))) {
      this.el.nativeElement.value = input.substring(1);
    }
  }
}