import { Directive } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';


export function FileExtensionValidatorDirective(validExt: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let forbidden = true;
      if (control.value) {
        const fileExt = control.value.split('.').pop();
        validExt.split(',').forEach(ext => {
          if (ext.trim() == fileExt) {
            forbidden = false;
          }
        });
      }
      return forbidden ? { 'inValidExt': true } : null;
    };
  } 


