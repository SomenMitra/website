import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class OdishaoneRedirectService {

  constructor() { }

  post(obj,url) {
    var mapForm = document.createElement("form");
    //mapForm.target = "_blank";
    mapForm.method = "POST"; // or "post" if appropriate
    mapForm.action = url;
    
  //   Object.keys(obj).forEach(function(param){
  //     var mapInput = document.createElement("input");
  //     mapInput.type = "hidden";
  //     mapInput.name = param;
  //     mapInput.setAttribute("value", obj[param]);
  //     mapForm.appendChild(mapInput);
  // });

  var mapInput = document.createElement("input");
  mapInput.type = "hidden";
  mapInput.name = "encData";
  mapInput.setAttribute("value", obj);
  mapForm.appendChild(mapInput);
  
  
  

  document.body.appendChild(mapForm);
  //console.log(mapForm);
  mapForm.submit();
}
}