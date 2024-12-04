import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    // return null;
    if(!args){
      return value;
    }
    else{
      args=args;
      //console.log(args);
    }
    return value.filter(items=>{

      let rVal=(items.vchProcessName.toLocaleLowerCase().includes(args)) || (items.vchProcessName.toLocaleLowerCase().includes(args)) || (items.vchProcessName.toString().includes(args)) || (items.vchProcessName.toLocaleLowerCase().includes(args));
      return rVal;

      //return items.vchProcessName.match(args)==true;
    //  return items.vchProcessName.startsWith(args)==true;
    })
  }

}

