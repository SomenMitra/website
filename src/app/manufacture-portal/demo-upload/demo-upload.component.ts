import { Component, OnInit } from '@angular/core';

import { HttpResponse, HttpEventType } from '@angular/common/http';
import { UntypedFormControl, UntypedFormArray, UntypedFormBuilder, Validators } from '@angular/forms';
import { FileExtensionValidatorDirective } from '../scheme-document/file-extension-validator.directive';





@Component({
  selector: 'app-demo-upload',
  templateUrl: './demo-upload.component.html',
  styleUrls: ['./demo-upload.component.css']
})
export class DemoUploadComponent implements OnInit {

  percentCompleted: number = 0;
  isMultipleUploaded = false;
  isSingleUploaded = false;
  urlAfterUpload = '';
  percentUploaded = [0];
  acceptedExtensions = "jpg, jpeg, bmp, png, wav, mp3, mp4";
  constructor(private formBuilder: UntypedFormBuilder, 
    // private fuService: FileUploadService
  ) {
  }
  

  ngOnInit(): void {


   

  }


  uploadForm = this.formBuilder.group({
    title: ['', Validators.required],
    filesToUpload: this.formBuilder.array([
      this.formBuilder.control('',
       [Validators.required, FileExtensionValidatorDirective(this.acceptedExtensions)]
      )
    ])
  });
  get title(): UntypedFormControl {
    return this.uploadForm.get('title') as UntypedFormControl;
  }
  get filesToUpload(): UntypedFormArray {
    return this.uploadForm.get('filesToUpload') as UntypedFormArray;
  }
  addMoreFiles() {
    this.filesToUpload.push(this.formBuilder.control('',
      [Validators.required, FileExtensionValidatorDirective(this.acceptedExtensions)]
    ));
    this.percentUploaded.push(0);
  }
  deleteFile(index: number) {
    this.filesToUpload.removeAt(index);
    this.percentUploaded.splice(index, 1);
  }
  onFormSubmit() {
    console.log('---Uploading multiple file---');
    this.isMultipleUploaded = false;
    for (let i = 0; i < this.filesToUpload.length && this.uploadForm.valid; i++) {
      const selectedFileList = (<HTMLInputElement>document.getElementById('file' + i)).files;
      const file = selectedFileList.item(0);
      this.uploadFile(file, i);
    }
    console.log(this.title.value);
  }
  uploadFile(file: File, fileNum: number) {
    const formData = new FormData();
    // formData.append("file", file);
    // this.fuService.uploadWithProgress(formData)
    //   .subscribe(event => {
    //     if (event.type === HttpEventType.UploadProgress) {
    //       this.percentUploaded[fileNum] = Math.round(100 * event.loaded / event.total);
    //     } else if (event instanceof HttpResponse) {
    //       console.log(file.name + ', Size: ' + file.size + ', Uploaded URL: ' + event.body.link);
    //       this.fileUploadSuccess();
    //     }
    //   },
    //     err => console.log(err)
    //   );
  }
  fileUploadSuccess() {
    let flag = true;
    this.percentUploaded.forEach(n => {
      if (n !== 100) {
        flag = false;
      }
    });
    if (flag) {
      this.isMultipleUploaded = true;
    }
  }
  formReset() {
    this.uploadForm.reset();
    this.isMultipleUploaded = false;
    for (let i = 0; i < this.percentUploaded.length; i++) {
      this.percentUploaded[i] = 0;
    }
  }

}
