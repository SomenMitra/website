import { AbstractControl, FormControl, FormGroup, ValidatorFn } from "@angular/forms";
import * as moment from "moment";
import { Moment } from "moment";

export function datePickerValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let forbidden = true;
      if (control.value) {
        //var now = moment(new Date()); 
        const now = moment().startOf('day');
        let strDate = control.value;
        const year = parseInt(strDate.year);
        const month = parseInt(strDate.month)-1;
        const day = parseInt(strDate.day);
         var end  = moment([year,month,day]);
        const yearsDiff = end.diff(now, 'years');
        if (yearsDiff > -18 && yearsDiff<=0) {
            forbidden = false;
        }
      }
      return forbidden ? { 'invalidDOBYear': true } : null;
    };
  } 

  export function ConfirmedValidator(controlName: string, matchingControlName: string){
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];
        if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
            return;
        }
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ confirmedValidator: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}

 //custom validation
 export function checkFileType(control: AbstractControl): { [key: string]: any } | null {
  let filename = control.value;
  var ext = filename.substring(filename.lastIndexOf('.') + 1);
  let forbidden = true;
  if(ext==='pdf'){                 
    forbidden = false;       
  }
    return forbidden ? { 'invalid_type': true } : null;
}

export function fileSizeValidator(files: FileList,size:any) {
    return function(control: FormControl) {
      // return (control: AbstractControl): { [key: string]: any } | null => {
      const file = control.value;
    //   console.log(files[0].size);
      if (file) {
        var path = file.replace(/^.*[\\\/]/, "");
        const fileSize = files[0].size;
        const fileSizeInKB = Math.round(fileSize / (1024));
        // console.log(fileSizeInKB);
        if (fileSizeInKB > size) {
          return {
            fileSizeValidator: true
          };
        } else {
          return null;
        }
      }
      return null;
    };
  }

  export function requiredFileType(type: string[]) {
    return function(control: FormControl) {
      // return (control: AbstractControl): { [key: string]: any } | null => {
      const file = control.value;
      var existValue: boolean = false;
      if (file) {
  
        var path = file.replace(/^.*[\\\/]/, "");
  
        const extension = path.split(".")[1].toUpperCase();
        for (var i = 0; i < type.length; i++) {
          let typeFile = type[i].toUpperCase();
          if (typeFile === extension.toUpperCase()) {
            existValue = true;
          }
        }
        if (existValue == true) {
          return null;
        } else {
          return {
            requiredFileType: true
          };
        }
      }
      return null;
    };
  }