import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class RedirectService {

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
var jsonEncoded = JSON.stringify(obj);
var encToken = CryptoJS.HmacSHA256(jsonEncoded, "252e80b4e5d9cfc8b369ad98dcc87b5f").toString();
  var mapInput = document.createElement("input");
  mapInput.type = "hidden";
  mapInput.name = "DATA";
  mapInput.setAttribute("value", jsonEncoded);
  mapForm.appendChild(mapInput);
  
  var hashInput = document.createElement("input");
  hashInput.type = "hidden";
  hashInput.name = "ENC_TOKEN";
  hashInput.setAttribute("value", encToken);
  mapForm.appendChild(hashInput);
  

  document.body.appendChild(mapForm);
  //console.log(mapForm);
  mapForm.submit();
}
}