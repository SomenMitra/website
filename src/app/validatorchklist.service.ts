import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ValidatorchklistService {
  constructor() { }  
  blankCheck(elmVal:any, msg:any,fieldId='')
  {
      if( elmVal == '' || typeof (elmVal) == undefined || elmVal == null)
      {
        Swal.fire({
          icon: 'error',
          text: 'Enter '+msg
        }).then(function(){
          if(fieldId!=''){
            window.setTimeout(function () { 
            document.getElementById(fieldId).focus();
            }, 500); 
          }
        });
        return false;
      }
      return true;
  }
  blankCheckCustome(elmVal:any, msg:any,fieldId='')
  {
      if(elmVal == '' || typeof (elmVal) == undefined || elmVal == null)
      {
        Swal.fire({
          icon: 'error',
          text: msg
        }).then(function(){
          if(fieldId!=''){
            window.setTimeout(function () { 
            document.getElementById(fieldId).focus();
            }, 500); 
          }
        });
        return false;
      }
      return true;
  }

  blankImgCheck(elmVal:any, msg:any,fieldId='')
  {
      if(elmVal == '' || typeof (elmVal) == undefined || elmVal == null)
      {
        Swal.fire({
          icon: 'error',
          text: 'Please '+msg
        }).then(function(){
          if(fieldId!=''){
            window.setTimeout(function () { 
            document.getElementById(fieldId).focus();
            }, 500); 
          }
        });
        return false;
      }
      return true;
  }

  blankCheckRdo(elmNm:any, msg:any,fieldId='')
  {
      let ele = document.getElementsByName(elmNm);
      let checkedCtr:number = 0;
      for(let i = 0; i < ele.length; i++) {

         if((ele[i] as HTMLInputElement).checked)
         {
          checkedCtr++;
         }

      }
      if(checkedCtr==0)
      {
        Swal.fire({
          icon: 'error',
          text: 'Select '+msg
        }).then(function(){
          if(fieldId!=''){
            window.setTimeout(function () { 
            document.getElementById(fieldId).focus();
            }, 500); 
          }
        });

        return false;
      }
      return true;
  }
  blankCheckRdoCustome(elmNm:any, msg:any,fieldId='')
  {
      let ele = document.getElementsByName(elmNm);
      let checkedCtr:number = 0;
      for(let i = 0; i < ele.length; i++) {

         if((ele[i] as HTMLInputElement).checked)
         {
          checkedCtr++;
         }

      }
      if(checkedCtr==0)
      {
        Swal.fire({
          icon: 'error',
          text: msg
        }).then(function(){
          if(fieldId!=''){
            window.setTimeout(function () { 
            document.getElementById(fieldId).focus();
            }, 500); 
          }
        });

        return false;
      }
      return true;
  }

  blankCheckRdoDynamic(elmNm:any, msg:any,fieldId='')
  {
      let className =  'cls_'+elmNm;
      let ele = document.getElementsByClassName(className);
      let checkedCtr:number = 0;
      for(let i = 0; i < ele.length; i++) {

         if((ele[i] as HTMLInputElement).checked)
         {
          checkedCtr++;
         }

      }
      if(checkedCtr==0)
      {
        Swal.fire({
          icon: 'error',
          text: 'Select '+msg
        }).then(function(){
          if(fieldId!=''){
            window.setTimeout(function () { 
            document.getElementById(fieldId).focus();
            }, 500); 
          }
        });

        return false;
      }
      return true;
  }

  selectDropdown(elmVal:any, msg:any,fieldId='')
  {
    
      if(elmVal == 0 || elmVal == '' || typeof (elmVal) == undefined || elmVal == null)
      {
        Swal.fire({
          icon: 'error',
          text: 'Select '+msg
        }).then(function(){
          if(fieldId!=''){
            window.setTimeout(function () { 
            document.getElementById(fieldId).focus();
            }, 500); 
          }
        });
        return false;
      }
      return true;
  }
  selectDropdownCustome(elmVal:any, msg:any,fieldId='')
  {
      if(elmVal == 0 || elmVal == '' || typeof (elmVal) == undefined || elmVal == null)
      {
        Swal.fire({
          icon: 'error',
          text: msg
        }).then(function(){
          if(fieldId!=''){
            window.setTimeout(function () { 
            document.getElementById(fieldId).focus();
            }, 500); 
          }
        });
        return false;
      }
      return true;
  }
  maxLength(elmVal:any,fldLngth:any, msg:any,fieldId='')
  {
      if(typeof (elmVal) !== 'undefined' && elmVal.length>0 && elmVal.length>fldLngth )
      {
        Swal.fire({
          icon: 'error',
          text: msg+' should not more than ' + fldLngth + ' charater'
        }).then(function(){
          if(fieldId!=''){
            window.setTimeout(function () { 
            document.getElementById(fieldId).focus();
            }, 500); 
          }
        });;
        return false;
      }
      return true;
  }
  isOnlySpecialCharacters(value) {
    const specialCharPattern = /^[^A-Za-z0-9\s]+$/;
    return specialCharPattern.test(value);
  }
  onlyhypen(elmVal:any,fieldId='')
  {
   
    var specialCharPattern = /^[^A-Za-z0-9\s]+$/;
      if(typeof (elmVal) !== 'undefined' && elmVal.length>0 && specialCharPattern.test(elmVal))
      {
        console.log(elmVal);
        Swal.fire({
          icon: 'error',
          text: 'Please enter value after negative symbol for '+fieldId
        }).then(function(){
          if(fieldId!=''){
            window.setTimeout(function () { 
            document.getElementById(fieldId).focus();
            }, 500); 
          }
        });;
        return false;
      }
      return true;
  }
 
  minLength(elmVal:any,fldLngth:any, msg:any,fieldId='')
  {
      if(typeof (elmVal) !== 'undefined' && elmVal.length>0 && elmVal.length<fldLngth )
      {
        Swal.fire({
          icon: 'error',
          text: msg+' should not be less than ' + fldLngth + ' charater'
        }).then(function(){
          if(fieldId!=''){
            window.setTimeout(function () { 
            document.getElementById(fieldId).focus();
            }, 500); 
          }
        });;
        return false;
      }
      return true;
  }


  validEmail(elmVal:any,fieldId='')
  {
      let pattern = new RegExp(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/);
      let pattern1 = new RegExp(/^[^\s].+[^\s]$/);
      if (elmVal != '' &&  typeof elmVal !=='undefined')
      {
          if (pattern.test(elmVal) == true && pattern1.test(elmVal) == true)
            return true;
          else
          {
            Swal.fire({
              icon: 'error',
              text: 'Please Enter a Valid E-mail Id'
            }).then(function(){
              if(fieldId!=''){
                window.setTimeout(function () { 
                document.getElementById(fieldId).focus();
                }, 500); 
              }
            });
            return false;
          }
      }
      return true;
  }
  validMob(elmVal:any,fieldId='')
  {
      let pattern = new RegExp(/^[6-9][0-9]{9}$/);
      if (elmVal != '')
      {
          if (pattern.test(elmVal) == true)
            return true;
          else
          {
            Swal.fire({
              icon: 'error',
              text: 'Please Enter a valid Mobile No.'
            }).then(function(){
              if(fieldId!=''){
                window.setTimeout(function () { 
                document.getElementById(fieldId).focus();
                }, 500); 
              }
            });
            return false;
          }
      }
      return true;
  }

  validPassword(elmVal:any,fieldId='')
  {
      let pattern = new RegExp(/^.*(?=.{8,15})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&!%()*?]).*$/);
      if (elmVal != '')
      {
          if (pattern.test(elmVal) == true)
            return true;
          else
          {
            Swal.fire({
              icon: 'error',
              text: 'Please enter a valid password'
            }).then(function(){
              if(fieldId!=''){
                window.setTimeout(function () { 
                document.getElementById(fieldId).focus();
                }, 500); 
              }
            });
            return false;
          }
      }
      return true;
  }

// validates Aadhar number received as string
  validAadhar(elmVal:any,fieldId='') {
    if (elmVal != '')
      {
          // multiplication table
          const d = [
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
            [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
            [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
            [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
            [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
            [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
            [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
            [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
            [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
          ]

          // permutation table
          const p = [
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
            [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
            [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
            [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
            [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
            [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
            [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
          ]
          let c = 0
          let invertedArray = elmVal.split('').map(Number).reverse()

          invertedArray.forEach((val:any, i:any) => {
            c = d[c][p[(i % 8)][val]]
          })
          if (c === 0)
            return true;
          else
          {
            Swal.fire({
              icon: 'error',
              text: 'Please Enter a Valid Aadhaar No'
            }).then(function(){
              if(fieldId!=''){
                window.setTimeout(function () { 
                document.getElementById(fieldId).focus();
                }, 500); 
              }
            });
            return false;
          }
      }
      return true;
  }

  isCharKey(event:any){
    var charCode2 = (event.which) ? event.which : event.keyCode;
    if(charCode2 == 46)
    {
      return true;
    }
    else if (charCode2 > 32 && (charCode2 < 65 || charCode2 > 90) &&
            (charCode2 < 97 || charCode2 > 122)) {
        //alert("Enter letters only.");
        return false;
    }
    return true;
  }
  isCharKeyMob(val: any) {
    return val.replace(/[^a-zA-z ]/g, '');
  }


  isNumberKey(event:any)
  {
      let charCode = (event.which) ? event.which : event.keyCode
      if (charCode > 31 && (charCode < 48 || charCode > 57) )
          return false;
      return true;
  }
  isNumberKeyMob(val: any) {
    return val.replace(/[^0-9]/g, '');
  }

 isAlphaNumeric(event:any){
  let arr = [40,41,62,47,44,46,32];
  
    const charCode2 = (event.which) ? event.which : event.keyCode
    
  if((charCode2>=65 && charCode2 <= 90) || (charCode2>=97 && charCode2 <= 122) || (charCode2>=48 && charCode2 <= 57) || arr.includes(charCode2))
  {
    return true;
  }
  return false;

    // if (charCode2 > 32 && (charCode2 < 65 || charCode2 > 90) && (charCode2 < 97 || charCode2 > 122) && (charCode2 > 31 && (charCode2 < 48 || charCode2 > 57) )) {
    //     return false;
    // }

    // return true;

  }

  blockspecialchar_first(evt: any) {
    const disallowedChars: { [key: number]: string } = {
      44: ',', 47: '/', 58: ':', 46: '.', 39: 'Single Quote', 32: 'White Space',
      40: '(', 41: ')', 45: '-', 95: '_', 59: ';', 124: '|', 63: '?', 34: '"',
      35: '#', 36: '$', 38: '&', 126: '~', 96: '`', 33: '!', 37: '%', 94: '^',
      42: '*', 92: '\\', 43: '+', 61: '=', 123: '{', 125: '}', 91: '[', 93: ']',
      60: '<', 62: '>', 64: '@'
    };

    let txtValue: string = evt.target.value;
    let firstCharCode = txtValue.charCodeAt(0);

    if (disallowedChars[firstCharCode]) {
      Swal.fire({
        icon: 'error',
        text: `${disallowedChars[firstCharCode]} Not allowed in 1st Place!!!`,
        allowOutsideClick: false,
      });
      evt.target.value = ''; // Clear the input
      return false;
    }

    return true; // Valid status if no disallowed char is found
  }

  // isAlphaNumeric(event:any){
   
  //    var numPattern = new RegExp(/^[A-Za-z0-9()_@./ ,#&+-]*$/);
  //   // console.log(event)
  //  // var numPattern = new RegExp(/^([a-zA-Z0-9 _-]+)$/);
  //   var txtVal = event.target.value;
  //   let space = txtVal.charAt(0);

  //   var charCode2 = (event.which) ? event.which : event.keyCode
  //   if (event.target.selectionStart === 0 && charCode2 === 32){
  //     event.preventDefault();
  //   }
  //   if (txtVal != '')
  //   {
  //       if (numPattern.test(txtVal) == true)
  //           return true;
  //       else
  //           return false;
  //   }
  //   else
  //       return true;
  // }
  blockSpecialCharsfrst(event:any){

    if(event.target.selectionStart=== null &&  event.keyCode==32){
      event.preventDefault();
    }
     
  }

  isAlphaNumericMob(event:any){
   
    var txtVal = event.target.value;
    var numPattern = new RegExp(/^[A-Za-z0-9()_@./ ,#&+-]*$/);
    if (numPattern.test(txtVal))
      return txtVal;
    return '';
  }

  isDecimal(event:any){
    let charCode = (event.which) ? event.which : event.keyCode;

    var txtVal = event.target.value;
    if ((charCode > 47 && charCode < 58) || charCode == 46 || charCode == 8 || (charCode == 45 ))
    {
        if ((txtVal.indexOf(".") > 0 && charCode == 46 ))
            return false;
        else if ((txtVal.indexOf("-") >=0 && charCode == 45))
            return false;
        else
            return true;
    }
    return false;
  }

  isDecimalMob(val: any) {
    return val.replace(/[^\d+(\.\d{1,2}]/g, '');
  }


  dynCtrlVal(ctrlValParam:any,elemObj:any)
  {
   
    let dynData       = ctrlValParam['dynDataObj'];
    let elmVal        = ctrlValParam['ctrlVal'];
    let drftSts       = ctrlValParam['drftSts'];
    let dispNnSts     = ctrlValParam['dispNnSts'];
    let sectnCtrlType = ctrlValParam['ctrlType'];
   
    let ctrlNm      = '';
    let lblName     = '';
    let ctrlType    = 0;
    let mndSts      = 0;
    let fldLngth    = 0;
    if(sectnCtrlType==8)
    {
      ctrlNm      = '';
      lblName     = dynData['columnName'];
      ctrlType    = dynData['columnType'];
      mndSts      = (dispNnSts===false)?dynData['columnMnd']:0;
      fldLngth    = dynData['fieldLen'];
    }
    else{
      ctrlNm      = dynData['jsnControlArray'][0]['ctrlName'];
      lblName     = dynData['vchLabelName'];
      ctrlType    = dynData['tinControlType'];
      mndSts      = (dispNnSts===false)?dynData['tinMandatorySts']:0;
      fldLngth    = dynData['intFieldLength'];
    }

    let valSts = true;

    // for select tag
    if (mndSts==1 && ctrlType==2) {
      if(drftSts==false)
      {
        if(!this.selectDropdown(elmVal,lblName))
        {
          valSts = false;
        }
      }
    }
    // for radio button
    else if (mndSts==1 && (ctrlType==5 || ctrlType==1)) {
      if(drftSts==false)
      {
        if(!this.blankCheckRdoDynamic(ctrlNm,lblName))
        {
          valSts = false;
        }
      }
    }
    // for text box
    else if (mndSts==1 && ctrlType==6) {
      if(drftSts==false)
      {
        if(!this.blankCheck(elmVal,lblName))
        {
          valSts = false;
          //dynData.focus();
        }
      }
      if(!this.maxLength(elmVal,fldLngth,lblName))
      {
        valSts = false;
        //dynData.focus();
      }
      if(sectnCtrlType!=8){
        if(!this.onlyhypen(elmVal,lblName))
          {
            valSts = false;
            dynData.focus();
          }
      }
     
    }
    // for text area
    else if (mndSts==1 && ctrlType==7) {
      if(drftSts==false)
      {
        if(!this.blankCheck(elmVal,lblName))
        {
          valSts = false;
          //dynData.focus();
        }
      }
      if(!this.maxLength(elmVal,fldLngth,lblName))
      {
        valSts = false;
        //dynData.focus();
      }
      if(!this.onlyhypen(elmVal,lblName))
        {
          valSts = false;
          //dynData.focus();
        }
    }

    // for date box
    else if (mndSts==1 && ctrlType==9) {
      if(drftSts==false)
      {
        if(!this.blankCheck(elmVal,lblName))
        {
          valSts = false;
        }
      }
    }

    // for time box
    else if (mndSts==1 && ctrlType==10) {
      if(drftSts==false)
      {
        if(!this.blankCheck(elmVal,lblName))
        {
          valSts = false;
        }
      }
    }

    // for date time box
    else if (mndSts==1 && ctrlType==11) {
      if(drftSts==false)
      {
        if(!this.blankCheck(elmVal,lblName))
        {
          valSts = false;
        }
      }
    }

    else{
      valSts = true;
    }
    return valSts;
  }

  isDashSlashNumeric(event:any){
    let charCode = (event.which) ? event.which : event.keyCode
    // console.log(charCode);
    if (charCode > 31 && (charCode < 45 || charCode > 57 || charCode==46))
        return false;
    return true;
  }
  isDashSlashNumericMob(val: any) {
    return val.replace(/[^0-9/-]/g, '');
  }
  price_in_words(price1) {
    let price = price1.replace(/([-,€])+/g, '');
    var sglDigit = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"],
        dblDigit = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"],
        tensPlace = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"],
        handle_tens = function (dgt, prevDgt) {
            return 0 == dgt ? "" : " " + (1 == dgt ? dblDigit[prevDgt] : tensPlace[dgt])
        },
        handle_utlc = function (dgt, nxtDgt, denom) {
            return (0 != dgt && 1 != nxtDgt ? " " + sglDigit[dgt] : "") + (0 != nxtDgt || dgt > 0 ? " " + denom : "")
        };
    var str = "",
        digitIdx = 0,
        digit = 0,
        nxtDigit = 0,
        words = [];
    if (price += "", isNaN(parseInt(price))) str = "";
    else if (parseInt(price) > 0 && price.length <= 10) {
        for (digitIdx = price.length - 1; digitIdx >= 0; digitIdx--) switch (digit = price[digitIdx] - 0, nxtDigit = digitIdx > 0 ? price[digitIdx - 1] - 0 : 0, price.length - digitIdx - 1) {
            case 0:
                words.push(handle_utlc(digit, nxtDigit, ""));
                break;
            case 1:
                words.push(handle_tens(digit, price[digitIdx + 1]));
                break;
            case 2:
                words.push(0 != digit ? "" + sglDigit[digit] + " Hundred" + (0 != price[digitIdx + 1] && 0 != price[digitIdx + 2] ? " and" : "") : "");
                break;
            case 3:
                words.push(handle_utlc(digit, nxtDigit, "Thousand"));
                break;
            case 4:
                words.push(handle_tens(digit, price[digitIdx + 1]));
                break;
            case 5:
                words.push(handle_utlc(digit, nxtDigit, "Lakh"));
                break;
            case 6:
                words.push(handle_tens(digit, price[digitIdx + 1]));
                break;
            case 7:
                words.push(handle_utlc(digit, nxtDigit, "Crore"));
                break;
            case 8:
                words.push(handle_tens(digit, price[digitIdx + 1]));
                break;
            case 9:
                words.push(0 != digit ? "" + sglDigit[digit] + " Hundred" + (0 != price[digitIdx + 1] || 0 != price[digitIdx + 2] ? " and" : " Crore") : "")
        }
        str = words.reverse().join(" ")
    }
    // if(str!=''){
    //   return str+"Only";
    // }
    return str;

  }
  isBlankCheckSpaceVAlidation(event:any,msg:any,fieldId=''){     
    //let pattern = new RegExp(/^[a-zA-Z][\sa-zA-Z]*/);
    let pattern1 = new RegExp(/^\s*\S+(?: \S+)*\s*$/);    
    //let pattern2 = new RegExp(/^[^\s].+[^\s]$/);

    if (event != '' &&  typeof event !=='undefined')
    {
        // if (pattern2.test(event) == true)            
        //     return true;
        // else
        // {
        //   Swal.fire({
        //     icon: 'error',
        //     text: 'White space not allowed first or last character'
        //   }).then(function(){
        //     if(fieldId!=''){
        //       window.setTimeout(function () { 
        //       document.getElementById(fieldId).focus();
        //       }, 500); 
        //     }
        //   });
        //   return false;
        // }

        if (pattern1.test(event) == true)            
            return true;
        else
        {
          Swal.fire({
            icon: 'error',
            text: 'More than one space not allowed'
          }).then(function(){
            if(fieldId!=''){
              window.setTimeout(function () { 
              document.getElementById(fieldId).focus();
              }, 500); 
            }
          });
          return false;
        }
    }
    return true;
  }
  spaceFirstValidate(event:any,msg:any,fieldId=''){     
    //let pattern = new RegExp(/^[a-zA-Z][\sa-zA-Z]*/);
    // let pattern = new RegExp(/^[^(?!\s)].+[^\s]$/);
    let pattern = new RegExp(/^(?!\s).*(?<!\s)$/);
    if (event != '' &&  typeof event !=='undefined')
    {
        if (pattern.test(event) == true) {
          return true;
        }    
        else
        {
          Swal.fire({
            icon: 'error',
            text: 'White space not allowed first or last character'
          }).then(function(){
            if(fieldId!=''){
              window.setTimeout(function () { 
              document.getElementById(fieldId).focus();
              }, 500); 
            }
          });
          return false;
        }
    }
    return true;
  }
  
  isCharWithSpace(event: any): void {
    const charCode = event.which || event.keyCode;
    const charStr = String.fromCharCode(charCode);
    const currentValue = (event.target as HTMLInputElement).value;

    const isCharKey = /^[a-zA-Z]+$/.test(charStr);

    const isSpaceAllowed = charStr === ' ' && currentValue && !currentValue.endsWith(' ') && !currentValue.includes('  ');

    const isFirstCharSpace = currentValue === '' && charStr === ' ';

    if (!(isCharKey || isSpaceAllowed) || isFirstCharSpace) {
      event.preventDefault();
    }
  }

  isAlphaNumericWithoutSpace(event: any): void {
    const charCode = event.which || event.keyCode;
    const charStr = String.fromCharCode(charCode);
    const isAlphaNumeric = /^[A-Z0-9]+$/.test(charStr);
    if (!isAlphaNumeric) {
      event.preventDefault();
    }
  }

}
