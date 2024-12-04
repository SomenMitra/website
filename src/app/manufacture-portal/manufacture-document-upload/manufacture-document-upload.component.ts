import { Component,  ViewChild, ElementRef, HostListener} from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder,Validators} from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ManufactureSchemeService } from '../service-api/manufacture-scheme.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptDecryptService } from '../../encrypt-decrypt.service';
import { CitizenMasterService } from '../service-api/citizen-master.service';
import { FormBuilder} from '@angular/forms';
import Swal from 'sweetalert2';
import { CitizenProfileService } from '../service-api/citizen-profile.service';
import { CitizenSchemeService } from '../service-api/citizen-scheme.service';
import { FileUploadService } from '../file-upload.service';
import { HttpResponse, HttpEventType } from '@angular/common/http';
import { ValidatorchklistService } from 'src/app/validatorchklist.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

interface TableDataItem {
  name: string;
  fileName: string;
  originalFileName: string;
  fileSize: number;
  showUpload: boolean;
  file: File | null; // To store the uploaded file
  fileUrl?: string; // Optional property
}
@Component({
  selector: 'app-manufacture-document-upload',
  templateUrl: './manufacture-document-upload.component.html',
  styleUrls: ['./manufacture-document-upload.component.css'],
  providers: [DatePipe]
})
export class ManufactureDocumentUploadComponent {
  @HostListener('document:keydown.enter', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    event.preventDefault(); // Prevent the default action of the Enter key
  }
  @ViewChild('ApplicationModal') ApplicationModal: ElementRef;
  @ViewChild('someSeedDBTVoucherModal') someSeedDBTVoucherModalRef: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;
  manufactureDocument = new UntypedFormGroup({});
  submitted = false;
  public loading = false;
  isDataFlag = false;
  siteURL = environment.siteURL;
  profileId: any;
  mobileNo: any;
  percentUploaded = [0];
  isMultipleUploaded = false;
  resubmitManufacture = environment.RESUBMIT_MANUFACTURE;
  acceptedExtensions = 'jpg,jpeg,png,pdf';
  fileType = 'jpg,jpeg,png,pdf';
  farmerType: any;
  uploadedFiles: { [key: number]: File } = {};
  referenceNo: any;
  isEdit: any;
  //'BIS Licence for Components Applied',
  staticArray = ['Pan Card', 'Aadhaar Card', 'GST Registration', 'DIC Registration', 'MSME Udyam No.', 'IT Return Copy', 'State Pollution Certificate', 'Turn over Certificate with Balance Sheet and P and L Account', 'Previous Dealership Certificate for Experience in MI'];
  onlineServiceId: any;
  processId: any;
  respSts: any;
  respList: any;
  manufactureDetails: any;
  manufactureDoc: any;
  gstValidity: any;
  dicValidity: any;
  maxDate: NgbDateStruct;
  form: any;
  financialYear: any;
  gstFromDateFormatted: any;
  gstToDateFormatted: any;
  dicFromDateFormatted: any;
  dicToDateFormatted: any;
  itemLists: any;
  stateLists: any;
  rowComponentId: any[] = [];
  rowManufactured: any[] = [];
  rowProcured: any[] = [];
  rowTechnicalStaff: any[] = [];
  rowPerformanceReport: any[] = [];
  rowTestingReport: any[] = [];
  manufacturedUploadedFiles: any;
  showHidemanufacturedUploadedFiles = false;
  procuredUploadedFiles: any;
  showHideprocuredUploadedFiles = false;
  procuredBISUploadedFiles: any;
  showHideprocuredBISUploadedFiles = false;
  staffUploadedFiles: any;
  showHideStaffUploadedFiles = false;
  testingUploadedFiles: any;
  showHideTestingUploadedFiles = false;
  vchReferenceNo = '';
  vchApplicantName = '';
  vchCompanyRegNo = '';
  vchComanyHead = '';
  vchMobileNo = '';
  vchEmail = '';
  vchGSTIN = ''
  showStaffvalue: any = 1;
  showPerformancevalue: any = 1;
  showTestingvalue: any = 1;
  years: number[] = [];
  showDripMandatory: boolean = true;
  showSprinklerMandatory: boolean = false;
  showBothMandatory: boolean = false;
  procurementComponentId: any = 1;
  type: any;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private api: ManufactureSchemeService,
    private modalService: NgbModal,
    private el: ElementRef,
    private router: Router,
    private encDec: EncryptDecryptService,
    private objMstr: CitizenMasterService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private objProf: CitizenProfileService,
    private objSchmCtrl: CitizenSchemeService,
    private fuService: FileUploadService,
    //private objPMKSY:PmksyService,
    public vldChkLst: ValidatorchklistService,
    private datePipe: DatePipe
  ) {
    const currentDate = new Date();
    this.maxDate = {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
      day: currentDate.getDate(),
    };
  }

  currentStep: number = 1;

  setStep(step: number) {
    if (step == 1) {
      let manufactureParam = {
        "profileId": this.profileId,
        "schemeId": this.processId,
        "onlineServiceId": this.onlineServiceId,
        "type": this.type
      };
      this.getManufactureDetails(manufactureParam);
    }
    if (step == 2) {
      let manufacturedParam = {
        "profileId": this.profileId,
        "schemeId": this.processId,
        "onlineServiceId": this.onlineServiceId
      };
      this.getManufacturedItem(manufacturedParam);
    }
    if (step == 3) {
      let manufacturedParam = {
        "profileId": this.profileId,
        "schemeId": this.processId,
        "onlineServiceId": this.onlineServiceId
      };
      this.getProcuredItem(manufacturedParam);
    }
    if (step == 4) {
      let manufacturedParam = {
        "profileId": this.profileId,
        "schemeId": this.processId,
        "onlineServiceId": this.onlineServiceId
      };
      this.getTechnicalStaffDetails(manufacturedParam);
    }
    if (step == 5) {
      let manufacturedParam = {
        "profileId": this.profileId,
        "schemeId": this.processId,
        "onlineServiceId": this.onlineServiceId
      };
      this.getPerformanceDetails(manufacturedParam);
    }
    this.currentStep = step;
  }

  nextStep() {
    if (this.currentStep < 5) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onRadioChange(value: any) {
    this.showStaffvalue = value;
  }
  onRadioPerformance(value: any) {
    this.showPerformancevalue = value;
  }
  onRadioTesting(value: any) {
    this.showTestingvalue = value;
  }

  resetDate(event: Event, controlName: string) {
    event.preventDefault();
    this.manufactureDocument.get(controlName)?.patchValue('');
  }

  isDateSelected(controlName: string): boolean {
    // Check if the date is selected for the given control
    const control = this.manufactureDocument.get(controlName);
    return control?.value ? true : false;
  }
  // read only input datepicker box disable
  preventInput(event: KeyboardEvent | ClipboardEvent | Event): void {
    event.preventDefault();
  }

  // read only input datepicker box disable
  row = [];
  addTable() {
    this.row.push({
      id: '',
      name: '',
      email: ''
    });
  }
  deleteRow(index: number) {
    this.row.splice(index, 1);
  }
  selectedOption: string;
  selectedValue: number;
  selectOption(option: string, value: number) {
    this.selectedOption = option;
    this.selectedValue = value;
  }
  // priyaranjan




  //dynamic form design
  // tableData = this.staticArray.map(item => ({
  //   name: item,
  //   fileName: '',
  //   fileSize: 0,
  //   showUpload: true,
  //   file: null as File | null, // To store the uploaded file
  // }));
  tableData: TableDataItem[] = this.staticArray.map(item => ({
    name: item,
    fileName: '',
    originalFileName: '',
    fileSize: 0,
    showUpload: true,
    file: null,
    fileUrl: '' // Initialize fileUrl with an empty string if needed
  }));

  onFileChangeManufactured1(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.manufacturedUploadedFiles = input.files[0];
      this.showHidemanufacturedUploadedFiles = true;
    } else {
      this.manufacturedUploadedFiles = null; // Clear the file if no file is selected
    }
  }



  onFileChange(event: any, index: number): void {
    const file = event.target.files[0];
    if (file && this.checkDocumentValidation(file)) {
      this.tableData[index].fileName = file.name;
      this.tableData[index].originalFileName = '';
      this.tableData[index].fileSize = Math.round(file.size / 1024);
      this.tableData[index].showUpload = false;
      this.tableData[index].file = file; // Store the file
    }
  }

  refresh(index: number): void {
    this.tableData[index].fileName = '';
    this.tableData[index].originalFileName = '';
    this.tableData[index].fileSize = 0;
    this.tableData[index].showUpload = true;
    this.tableData[index].file = null;
  }
  removeDoc() {
    this.manufacturedUploadedFiles.fileName = '';
    this.manufacturedUploadedFiles.originalFileName = '';
    this.manufacturedUploadedFiles.file = '';
  }

  previewFile(fileOrUrl: File | string, event: Event): void {
    event.preventDefault();
    if (fileOrUrl instanceof File) {
      // Handle File object
      const fileURL = URL.createObjectURL(fileOrUrl);
      window.open(fileURL, '_blank');
    } else {
      window.open(fileOrUrl, '_blank');
    }
  }

  fillBis(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const bisValue = selectElement.selectedOptions[0].getAttribute('data-id');
    (<HTMLInputElement>document.getElementById('txtManufacturedBis')).value = bisValue;
  }
  fillProcuredBis(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const bisValue = selectElement.selectedOptions[0].getAttribute('data-id');
    (<HTMLInputElement>document.getElementById('txtProcuredBis')).value = bisValue;
  }
  onFileChangeManufactured(event: any) {
    const file = event.target.files[0];
    if (file && this.checkDocumentValidation(file)) {
      this.manufacturedUploadedFiles = file;
      this.showHidemanufacturedUploadedFiles = true;
    } else {
      this.manufacturedUploadedFiles = '';
      this.showHidemanufacturedUploadedFiles = false;
      (<HTMLInputElement>document.getElementById(event.target.id)).value = '';
    }
  }
  onFileChangeProcured(event: any) {
    const file = event.target.files[0];
    if (file && this.checkDocumentValidation(file)) {
      this.procuredUploadedFiles = file;
      this.showHideprocuredUploadedFiles = true;
    } else {
      this.procuredUploadedFiles = '';
      this.showHideprocuredUploadedFiles = false;
      (<HTMLInputElement>document.getElementById(event.target.id)).value = '';
    }
  }
  onFileChangeProcuredBIS(event: any) {
    const file = event.target.files[0];
    if (file && this.checkDocumentValidation(file)) {
      this.procuredBISUploadedFiles = file;
      this.showHideprocuredBISUploadedFiles = true;
    } else {
      this.procuredBISUploadedFiles = '';
      this.showHideprocuredBISUploadedFiles = false;
      (<HTMLInputElement>document.getElementById(event.target.id)).value = '';
    }
  }
  onFileChangeStaffDoc(event: any) {
    const file = event.target.files[0];
    if (file && this.checkDocumentValidation(file)) {
      this.staffUploadedFiles = file;
      this.showHideStaffUploadedFiles = true;
    } else {
      this.staffUploadedFiles = '';
      this.showHideStaffUploadedFiles = false;
      (<HTMLInputElement>document.getElementById(event.target.id)).value = '';
    }
  }
  onFileChangeTestingDoc(event: any) {
    const file = event.target.files[0];  // Get the file from the input
    if (file && this.checkDocumentValidation(file)) {
      this.testingUploadedFiles = file;
      this.showHideTestingUploadedFiles = true;
    } else {
      this.testingUploadedFiles = '';
      this.showHideTestingUploadedFiles = false;
      (<HTMLInputElement>document.getElementById(event.target.id)).value = '';
    }
  }
  checkDocumentValidation(file: File): boolean {
    const extension = file.name.split('.').pop().toLowerCase();
    const maxSizeInMB = 1;
    const fileSizeInMB = file.size / (1024 * 1024);
    const acceptableTypes = this.fileType.split(',').map(type => type.toLowerCase());

    if (!acceptableTypes.includes(extension)) {
      Swal.fire({
        icon: 'error',
        text: 'Please Upload only ' + this.fileType
      });
      return false;
    }

    if (fileSizeInMB > maxSizeInMB) {
      Swal.fire({
        icon: 'error',
        text: 'File size should be < ' + maxSizeInMB + 'MB'
      });
      return false;
    }
    return true;
  }
  addTableManufactured() {
    let selManufactured = $(".selManufactured").attr("id");
    let txtManufacturedBis = $(".txtManufacturedBis").attr("id");
    let txtManufacturedCML = $(".txtManufacturedCML").attr("id");
    let txtManufacturedValidity = $(".txtManufacturedValidity").attr("id");
    let txtManufacturedManufactureName = $(".txtManufacturedManufactureName").attr("id");
    let txtManufacturedProdCapacity = $(".txtManufacturedProdCapacity").attr("id");
    let txtManufacturedUploadDoc = $(".txtManufacturedUploadDoc").attr("id");
    const selManufacturedVal = (<HTMLInputElement>document.getElementById(selManufactured)).value;
    const selectElement = document.querySelector('.selManufactured') as HTMLSelectElement;
    const selManufacturedText = selectElement.options[selectElement.selectedIndex].text;
    const txtManufacturedBisVal = (<HTMLInputElement>document.getElementById(txtManufacturedBis)).value;
    const txtManufacturedCMLVal = (<HTMLInputElement>document.getElementById(txtManufacturedCML)).value;
    const txtManufacturedValidityVal = (<HTMLInputElement>document.getElementById(txtManufacturedValidity)).value;
    const txtManufacturedManufactureNameVal = (<HTMLInputElement>document.getElementById(txtManufacturedManufactureName)).value;
    const txtManufacturedProdCapacityVal = (<HTMLInputElement>document.getElementById(txtManufacturedProdCapacity)).value;
    const txtManufacturedUploadDocVal = (<HTMLInputElement>document.getElementById(txtManufacturedUploadDoc)).value;
    const radiosComponent = document.querySelectorAll('.selComponent') as NodeListOf<HTMLInputElement>;
    let selectedComponent: any = '';
    radiosComponent.forEach(radio => {
      if (radio.checked) {
        selectedComponent = radio.value;
      }
    });
    if (!selManufacturedVal) {
      Swal.fire({
        icon: 'error',
        text: 'Please Select Component Name'
      });
      return;
    }
    if (!txtManufacturedBisVal) {
      Swal.fire({
        icon: 'error',
        text: 'Please Enter Bis Code'
      });
      return;
    }
    if (!txtManufacturedCMLVal) {
      Swal.fire({
        icon: 'error',
        text: 'Please Enter CM/L No'
      });
      return;
    }
    if (!txtManufacturedValidityVal) {
      Swal.fire({
        icon: 'error',
        text: 'Please Enter Validity Date'
      });
      return;
    }
    if (!txtManufacturedManufactureNameVal) {
      Swal.fire({
        icon: 'error',
        text: 'Please Enter Manufacture Name'
      });
      return;
    }
    if (!txtManufacturedProdCapacityVal) {
      Swal.fire({
        icon: 'error',
        text: 'Please Enter Production Capacity'
      });
      return;
    }
    if (!txtManufacturedUploadDocVal) {
      Swal.fire({
        icon: 'error',
        text: 'Please Upload Certificate'
      });
      return;
    }
    //let rowManufactured = [];
    this.rowManufactured.push({
      componentName: selManufacturedVal,
      componentSelectName: selManufacturedText,
      bisCode: txtManufacturedBisVal,
      cmlNo: txtManufacturedCMLVal,
      validDate: txtManufacturedValidityVal,
      manufactureName: txtManufacturedManufactureNameVal,
      productionCapacity: txtManufacturedProdCapacityVal,
      certificate: this.manufacturedUploadedFiles,
      hdnCertificate: ''
    });
    this.rowComponentId.push({
      componentId: selManufacturedVal,
    });

    (<HTMLInputElement>document.getElementById(selManufactured)).value = '';
    (<HTMLInputElement>document.getElementById(txtManufacturedBis)).value = '';
    (<HTMLInputElement>document.getElementById(txtManufacturedCML)).value = '';
    (<HTMLInputElement>document.getElementById(txtManufacturedValidity)).value = '';
    (<HTMLInputElement>document.getElementById(txtManufacturedManufactureName)).value = '';
    (<HTMLInputElement>document.getElementById(txtManufacturedProdCapacity)).value = '';
    (<HTMLInputElement>document.getElementById(txtManufacturedUploadDoc)).value = '';
    const fromDateElement = document.getElementById(txtManufacturedValidity);
    fromDateElement.dispatchEvent(new Event('input', { bubbles: true }));
    this.showHidemanufacturedUploadedFiles = false;
    this.getComponentItem(selectedComponent, this.rowComponentId);
  }
  addTableProcured() {
    let selProcured = $(".selProcured").attr("id");
    let txtProcuredBis = $(".txtProcuredBis").attr("id");
    let txtProcuredCML = $(".txtProcuredCML").attr("id");
    let txtProcuredValidity = $(".txtProcuredValidity").attr("id");
    let txtProcuredManufactureName = $(".txtProcuredManufactureName").attr("id");
    let txtProcuredUploadDoc = $(".txtProcuredUploadDoc").attr("id");
    let txtProcuredBISUploadDoc = $(".txtProcuredBISUploadDoc").attr("id");
    const selProcuredVal = (<HTMLInputElement>document.getElementById(selProcured)).value;
    const selectElement = document.querySelector('.selProcured') as HTMLSelectElement;
    const selProcuredText = selectElement.options[selectElement.selectedIndex].text;
    const txtProcuredBisVal = (<HTMLInputElement>document.getElementById(txtProcuredBis)).value;
    const txtProcuredCMLVal = (<HTMLInputElement>document.getElementById(txtProcuredCML)).value;
    const txtProcuredValidityVal = (<HTMLInputElement>document.getElementById(txtProcuredValidity)).value;
    const txtProcuredManufactureNameVal = (<HTMLInputElement>document.getElementById(txtProcuredManufactureName)).value;
    const txtProcuredUploadDocVal = (<HTMLInputElement>document.getElementById(txtProcuredUploadDoc)).value;
    const txtProcuredBISUploadDocVal = (<HTMLInputElement>document.getElementById(txtProcuredBISUploadDoc)).value;
    if (!selProcuredVal) {
      Swal.fire({
        icon: 'error',
        text: 'Please Select Component Name'
      });
      return;
    }
    if (!txtProcuredBisVal) {
      Swal.fire({
        icon: 'error',
        text: 'Please Enter Bis Code'
      });
      return;
    }
    if (!txtProcuredCMLVal) {
      Swal.fire({
        icon: 'error',
        text: 'Please Enter CM/L No'
      });
      return;
    }
    if (!txtProcuredValidityVal) {
      Swal.fire({
        icon: 'error',
        text: 'Please Enter Validity Date'
      });
      return;
    }
    if (!txtProcuredManufactureNameVal) {
      Swal.fire({
        icon: 'error',
        text: 'Please Enter Outsource Company Name'
      });
      return;
    }
    if (!txtProcuredUploadDocVal) {
      Swal.fire({
        icon: 'error',
        text: 'Please Upload MOU Certificate'
      });
      return;
    }
    if (!txtProcuredBISUploadDocVal) {
      Swal.fire({
        icon: 'error',
        text: 'Please Upload BIS Certificate'
      });
      return;
    }
    //let rowManufactured = [];
    this.rowProcured.push({
      componentName: selProcuredVal,
      componentSelectName: selProcuredText,
      bisCode: txtProcuredBisVal,
      cmlNo: txtProcuredCMLVal,
      validDate: txtProcuredValidityVal,
      manufactureName: txtProcuredManufactureNameVal,
      certificate: this.procuredUploadedFiles,
      bisCertificate: this.procuredBISUploadedFiles,
      hdnCertificate: '',
      hdnBISCertificate: ''
    });

    (<HTMLInputElement>document.getElementById(selProcured)).value = '';
    (<HTMLInputElement>document.getElementById(txtProcuredBis)).value = '';
    (<HTMLInputElement>document.getElementById(txtProcuredCML)).value = '';
    (<HTMLInputElement>document.getElementById(txtProcuredValidity)).value = '';
    (<HTMLInputElement>document.getElementById(txtProcuredManufactureName)).value = '';
    (<HTMLInputElement>document.getElementById(txtProcuredUploadDoc)).value = '';
    (<HTMLInputElement>document.getElementById(txtProcuredBISUploadDoc)).value = '';
    const fromDateElement = document.getElementById(txtProcuredValidity);
    fromDateElement.dispatchEvent(new Event('input', { bubbles: true }));
    this.showHideprocuredUploadedFiles = false;
    this.showHideprocuredBISUploadedFiles = false;

    this.getProcureItem(this.procurementComponentId);
  }
  addTableTechnicalStaff() {
    let txtStaffName = $(".txtStaffName").attr("id");
    let txtDesignation = $(".txtDesignation").attr("id");
    let txtJoiningDate = $(".txtJoiningDate").attr("id");
    let selStaffState = $(".selStaffState").attr("id");
    let txtQualification = $(".txtQualification").attr("id");
    let txtStaffUploadDoc = $(".txtStaffUploadDoc").attr("id");
    const txtStaffNameVal = (<HTMLInputElement>document.getElementById(txtStaffName)).value;
    const selStaffStateVal = (<HTMLInputElement>document.getElementById(selStaffState)).value;
    const selectElement = document.querySelector('.selStaffState') as HTMLSelectElement;
    const selStaffStateText = selectElement.options[selectElement.selectedIndex].text;
    const txtDesignationVal = (<HTMLInputElement>document.getElementById(txtDesignation)).value;
    const txtJoiningDateVal = (<HTMLInputElement>document.getElementById(txtJoiningDate)).value;
    const txtQualificationVal = (<HTMLInputElement>document.getElementById(txtQualification)).value;
    const txtStaffUploadDocVal = (<HTMLInputElement>document.getElementById(txtStaffUploadDoc)).value;
    if (!txtStaffNameVal) {
      Swal.fire({
        icon: 'error',
        text: 'Please Enter Technical Staff Name'
      });
      return;
    }
    if (!txtDesignationVal) {
      Swal.fire({
        icon: 'error',
        text: 'Please Enter Designation'
      });
      return;
    }
    if (!txtJoiningDateVal) {
      Swal.fire({
        icon: 'error',
        text: 'Please Enter Joining Date'
      });
      return;
    }
    if (!selStaffStateVal) {
      Swal.fire({
        icon: 'error',
        text: 'Please Select Serving State'
      });
      return;
    }
    if (!txtQualificationVal) {
      Swal.fire({
        icon: 'error',
        text: 'Please Enter Qualification'
      });
      return;
    }
    if (!txtStaffUploadDocVal) {
      Swal.fire({
        icon: 'error',
        text: 'Please Upload Document'
      });
      return;
    }
    //let rowManufactured = [];
    this.rowTechnicalStaff.push({
      staffName: txtStaffNameVal,
      designationName: txtDesignationVal,
      joiningDate: txtJoiningDateVal,
      servingState: selStaffStateVal,
      servingStateText: selStaffStateText,
      qualification: txtQualificationVal,
      document: this.staffUploadedFiles,
      hdnDocument: '',
    });
    (<HTMLInputElement>document.getElementById(txtStaffName)).value = '';
    (<HTMLInputElement>document.getElementById(txtDesignation)).value = '';
    (<HTMLInputElement>document.getElementById(txtJoiningDate)).value = '';
    (<HTMLInputElement>document.getElementById(selStaffState)).value = '';
    (<HTMLInputElement>document.getElementById(txtQualification)).value = '';
    (<HTMLInputElement>document.getElementById(txtStaffUploadDoc)).value = '';
    const fromDateElement = document.getElementById(txtJoiningDate);
    fromDateElement.dispatchEvent(new Event('input', { bubbles: true }));
    this.showHideStaffUploadedFiles = false;
    //this.setStep(2);
    //this.getProcureItem(1);
  }
  addTablePerformance() {
    let selEmpaneledState = $(".selEmpaneledState").attr("id");
    let selEmpanelmentYear = $(".selEmpanelmentYear").attr("id");
    let txtPhyAchievement = $(".txtPhyAchievement").attr("id");
    let txtFinAchievement = $(".txtFinAchievement").attr("id");
    const selEmpaneledStateVal = (<HTMLInputElement>document.getElementById(selEmpaneledState)).value;
    const selEmpanelmentYearVal = (<HTMLInputElement>document.getElementById(selEmpanelmentYear)).value;
    const selectEmpanelElement = document.querySelector('.selEmpaneledState') as HTMLSelectElement;
    const selectEmpanelYearElement = document.querySelector('.selEmpanelmentYear') as HTMLSelectElement;
    const selEmpanelStateText = selectEmpanelElement.options[selectEmpanelElement.selectedIndex].text;
    const selEmpanelYearText = selectEmpanelYearElement.options[selectEmpanelYearElement.selectedIndex].text;
    const txtPhyAchievementVal = (<HTMLInputElement>document.getElementById(txtPhyAchievement)).value;
    const txtFinAchievementVal = (<HTMLInputElement>document.getElementById(txtFinAchievement)).value;
    if (!selEmpaneledStateVal) {
      Swal.fire({
        icon: 'error',
        text: 'Please Select Empaneled State Name'
      });
      return;
    }
    if (!selEmpanelmentYearVal) {
      Swal.fire({
        icon: 'error',
        text: 'Please Select Empaneled Year'
      });
      return;
    }
    if (!txtPhyAchievementVal) {
      Swal.fire({
        icon: 'error',
        text: 'Please Enter Physical Achievement'
      });
      return;
    }
    if (!txtFinAchievementVal) {
      Swal.fire({
        icon: 'error',
        text: 'Please Enter Financial Achievement'
      });
      return;
    }
    this.rowPerformanceReport.push({
      empaneledState: selEmpaneledStateVal,
      empaneledStateText: selEmpanelStateText,
      empaneledYear: selEmpanelmentYearVal,
      empaneledYearText: selEmpanelYearText,
      physicalAchievement: txtPhyAchievementVal,
      financialAchievement: txtFinAchievementVal
    });
    (<HTMLInputElement>document.getElementById(selEmpaneledState)).value = '';
    (<HTMLInputElement>document.getElementById(selEmpanelmentYear)).value = '';
    (<HTMLInputElement>document.getElementById(txtPhyAchievement)).value = '';
    (<HTMLInputElement>document.getElementById(txtFinAchievement)).value = '';
  }
  addTableTesting() {
    let selType = $(".selType").attr("id");
    let txtInstituteName = $(".txtInstituteName").attr("id");
    let txtTestingUploadDoc = $(".txtTestingUploadDoc").attr("id");
    let txtValidityFromDate = $(".txtValidityFromDate").attr("id");
    let txtValidityToDate = $(".txtValidityToDate").attr("id");
    const selTypeVal = (<HTMLInputElement>document.getElementById(selType)).value;
    const selectTypeElement = document.querySelector('.selType') as HTMLSelectElement;
    const selTypeText = selectTypeElement.options[selectTypeElement.selectedIndex].text;
    const txtInstituteNameVal = (<HTMLInputElement>document.getElementById(txtInstituteName)).value;
    const txtTestingUploadDocVal = (<HTMLInputElement>document.getElementById(txtTestingUploadDoc)).value;
    const txtValidityFromDateVal = (<HTMLInputElement>document.getElementById(txtValidityFromDate)).value;
    const txtValidityToDateVal = (<HTMLInputElement>document.getElementById(txtValidityToDate)).value;
    if (!selTypeVal) {
      Swal.fire({
        icon: 'error',
        text: 'Please Select Type'
      });
      return;
    }
    if (!txtInstituteNameVal) {
      Swal.fire({
        icon: 'error',
        text: 'Please Select Institution Name'
      });
      return;
    }
    if (!txtTestingUploadDocVal) {
      Swal.fire({
        icon: 'error',
        text: 'Please Upload Testing Document'
      });
      return;
    }
    if (!txtValidityFromDateVal) {
      Swal.fire({
        icon: 'error',
        text: 'Please Enter Validity From Date'
      });
      return;
    }
    if (!txtValidityToDateVal) {
      Swal.fire({
        icon: 'error',
        text: 'Please Enter Validity To Date'
      });
      return;
    }
    this.rowTestingReport.push({
      typeVal: selTypeVal,
      selTypeText: selTypeText,
      instituteName: txtInstituteNameVal,
      testingDocument: this.testingUploadedFiles,
      validityFromDate: txtValidityFromDateVal,
      validityToDate: txtValidityToDateVal,
      hdnTestingDocument: ''
    });
    (<HTMLInputElement>document.getElementById(selType)).value = '';
    (<HTMLInputElement>document.getElementById(txtInstituteName)).value = '';
    (<HTMLInputElement>document.getElementById(txtTestingUploadDoc)).value = '';
    (<HTMLInputElement>document.getElementById(txtValidityFromDate)).value = '';
    (<HTMLInputElement>document.getElementById(txtValidityToDate)).value = '';
    const fromDateElement = document.getElementById(txtValidityFromDate);
    fromDateElement.dispatchEvent(new Event('input', { bubbles: true }));
    const toDateElement = document.getElementById(txtValidityToDate);
    toDateElement.dispatchEvent(new Event('input', { bubbles: true }));
    this.showHideTestingUploadedFiles = false;
  }
  deleteManufactured(rowId) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.rowManufactured.splice(rowId, 1);
        Swal.fire(
          'Deleted!',
          'Your record has been deleted.',
          'success'
        );
      }
    });
  }
  deleteProcured(rowId) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.rowProcured.splice(rowId, 1);
        Swal.fire(
          'Deleted!',
          'Your record has been deleted.',
          'success'
        );
      }
    });
  }
  deleteTechnicalStaff(rowId) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.rowTechnicalStaff.splice(rowId, 1);
        Swal.fire(
          'Deleted!',
          'Your record has been deleted.',
          'success'
        );
      }
    });
  }
  deletePerformanceReport(rowId) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.rowPerformanceReport.splice(rowId, 1);
        Swal.fire(
          'Deleted!',
          'Your record has been deleted.',
          'success'
        );
      }
    });
  }
  deleteTestingReport(rowId) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.rowTestingReport.splice(rowId, 1);
        Swal.fire(
          'Deleted!',
          'Your record has been deleted.',
          'success'
        );
      }
    });
  }

  //dynamic form design

  ngOnInit(): void {
    let params = this.route.snapshot.paramMap.get('id');
    let param = this.encDec.decText(params);
    let paramArr = param.split(':');
    this.profileId = paramArr[0];
    this.referenceNo = paramArr[1];
    this.mobileNo = paramArr[2];
    this.isEdit = paramArr[3];
    this.onlineServiceId = paramArr[4];
    this.processId = paramArr[5];
    this.type = paramArr[6];
    const today = new Date();
    let manufactureParam = {
      "profileId": this.profileId,
      "schemeId": this.processId,
      "onlineServiceId": this.onlineServiceId,
      "type": this.type
    };
    this.getManufactureDetails(manufactureParam);
    this.manufactureDocument = this.fb.group({
      gstFromDate: ['', Validators.required],
      gstToDate: ['', Validators.required],
      dicFromDate: ['', Validators.required],
      dicToDate: ['', Validators.required],
      selectedOption: ['', Validators.required],
      dripBisNo: [''],
      sprinklerBisNo: [''],
      panCard: ['', Validators.required],
      aadhaarCard: ['', Validators.required],
      gstRegistration: ['', Validators.required],
      dicRegistration: ['', Validators.required],
      msmeUdyam: ['', Validators.required],
      remarks: [''],
    });

    this.getCurrentFinancialYear();

  }

  // Validator function to check if the date is in the future
  dateNotInFuture(control: any) {
    if (!control.value) {
      return null; // Skip validation if no value
    }

    const controlDateValue = control.value; // control.value should be an object
    if (controlDateValue && controlDateValue.year && controlDateValue.month && controlDateValue.day) {
      const { year, month, day } = controlDateValue;
      const controlDate = new Date(year, month - 1, day); // Months are 0-based
      const today = new Date();

      // Reset time for comparison
      today.setHours(0, 0, 0, 0);
      controlDate.setHours(0, 0, 0, 0);

      if (controlDate > today) {
        return { 'futureDate': true };
      }
    } else {
      console.error('Unexpected control value format:', controlDateValue);
    }

    return null;
  }
  getCurrentFinancialYear() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // getMonth() returns 0-based month index
    let financialYearStart: number;
    let financialYearEnd: number;

    if (month >= 4) {
      // Financial year starts from April 1st
      financialYearStart = year;
      financialYearEnd = year + 1;
    } else {
      // Before April 1st, we are in the previous financial year
      financialYearStart = year - 1;
      financialYearEnd = year;
    }
    this.financialYear = [financialYearStart - 1, financialYearStart - 2, financialYearStart - 3]
  }
  getManufactureDetails(params: any) {
    this.loading = true;
    this.api.getManufactureDetails(params).subscribe(res => {
      this.respSts = res.status;
      if (this.respSts == 1) {
        this.loading = false;
        this.respList = res.result;
        this.manufactureDetails = this.respList.manufactureDetails[0];
        this.manufactureDoc = this.manufactureDetails.vchDocumentDetail;
        this.gstValidity = JSON.parse(this.manufactureDetails.vchGSTValidity);
        this.dicValidity = JSON.parse(this.manufactureDetails.vchDICValidity);

        //if (this.isEdit == 2) {
        this.populateForm();
        this.bindDocumentData();
        //}
      } else {
        this.loading = false;
      }
    });
  }
  getManufacturedItem(params: any) {
    this.loading = true;
    this.rowManufactured = [];
    this.rowComponentId = [];
    this.api.getManufacturedItem(params).subscribe(res => {
      if (res.status == 1) {
        let jsonManufacturedArray: any[] = res.result.manufacturedItem;
        let uploadUrl = res.result.uploadUrl;
        let uploadFolder = res.result.uploadFolder;
        let componentId = (res.result.componentId > 0) ? res.result.componentId : 1;
        jsonManufacturedArray.forEach((item: any, index) => {
          this.rowManufactured.push({
            componentName: item.componentId,
            componentSelectName: item.componentName,
            bisCode: item.bisCode,
            cmlNo: item.cmlNo,
            validDate: item.validDate,
            manufactureName: item.manufactureName,
            productionCapacity: item.productionCapacity,
            certificate: uploadUrl + uploadFolder + '/' + item.fileName,
            hdnCertificate: item.fileName,
            //certificate: this.manufacturedUploadedFiles,
          });
          this.rowComponentId.push({
            componentId: item.componentId,
          })
        });
        let selComponent = $(".selComponent").attr("id");
        const selectedRadioElement = document.getElementById(`selComponent${componentId}`) as HTMLInputElement;
        selectedRadioElement.checked = true;

        if (componentId == 1) {
          this.showDripMandatory = true;
          this.showSprinklerMandatory = false;
          this.showBothMandatory == false;
        } else if (componentId == 2) {
          this.showDripMandatory = false;
          this.showSprinklerMandatory = true;
          this.showBothMandatory = false;
        } else {
          this.showBothMandatory = true;
          this.showDripMandatory = false;
          this.showSprinklerMandatory = false;
        }
        this.getComponentItem(componentId, this.rowComponentId);
      } else {
        let componentId = 1;
        let selComponent = $(".selComponent").attr("id");
        const selectedRadioElement = document.getElementById(`selComponent${componentId}`) as HTMLInputElement;
        selectedRadioElement.checked = true;
        this.getComponentItem(1, this.rowComponentId);
      }
    });
  }
  getProcuredItem(params: any) {
    this.loading = true;
    this.rowProcured = [];
    this.api.getProcuredItem(params).subscribe(res => {
      if (res.status == 1) {
        let jsonProcuredArray: any[] = res.result.procuredItem;
        let uploadUrl = res.result.uploadUrl;
        let uploadFolder = res.result.uploadFolder;
        let componentId = (res.result.componentId > 0) ? res.result.componentId : 1;
        this.procurementComponentId = componentId;
        if (jsonProcuredArray) {
          jsonProcuredArray.forEach((item: any, index) => {
            this.rowProcured.push({
              componentName: item.componentId,
              componentSelectName: item.componentName,
              bisCode: item.bisCode,
              cmlNo: item.cmlNo,
              validDate: item.validDate,
              manufactureName: item.manufactureName,
              certificate: uploadUrl + uploadFolder + '/' + item.MOUfileName,
              hdnCertificate: item.MOUfileName,
              bisCertificate: uploadUrl + uploadFolder + '/' + item.BISfileName,
              hdnBISCertificate: item.BISfileName,
              //certificate: this.manufacturedUploadedFiles,
            });
          });
        }
        //let selComponent=$(".selComponent").attr("id");
        // const selectedRadioElement = document.getElementById(`selComponent${componentId}`) as HTMLInputElement;
        // selectedRadioElement.checked = true;
        this.getProcureItem(componentId);
        this.loading = false;
      } else {
        let componentId = 1;
        // let selComponent=$(".selComponent").attr("id");
        // const selectedRadioElement = document.getElementById(`selComponent${componentId}`) as HTMLInputElement;
        // selectedRadioElement.checked = true;
        this.getProcureItem(componentId);
        this.loading = false;
      }
    });
  }

  getTechnicalStaffDetails(params: any) {
    this.loading = true;
    this.rowTechnicalStaff = [];
    this.api.getTechnicalStaffDetails(params).subscribe(res => {
      if (res.status == 1) {
        let isTechnicalStaff = (res.result.isTechnicalStaff > 0) ? res.result.isTechnicalStaff : 1;
        if (isTechnicalStaff == 1) {
          let jsonTechnicalStaffArray: any[] = res.result.technicalStaffItem;
          let uploadUrl = res.result.uploadUrl;
          let uploadFolder = res.result.uploadFolder;
          let componentId = res.result.componentId;
          if (jsonTechnicalStaffArray) {
            jsonTechnicalStaffArray.forEach((item: any, index) => {
              this.rowTechnicalStaff.push({
                staffName: item.staffName,
                designationName: item.designationName,
                joiningDate: item.joiningDate,
                servingState: item.servingState,
                servingStateText: item.servingStateText,
                qualification: item.qualification,
                document: uploadUrl + uploadFolder + '/' + item.document,
                hdnDocument: item.document,
                //certificate: this.manufacturedUploadedFiles,
              });
            });
          }
        }
        const selectedRadioElement = document.getElementById(`selTechnical${isTechnicalStaff}`) as HTMLInputElement;
        selectedRadioElement.checked = true;
        this.showStaffvalue = isTechnicalStaff;
        this.getState();
        this.loading = false;
      } else {
        const selectedRadioElement = document.getElementById(`selTechnical${1}`) as HTMLInputElement;
        selectedRadioElement.checked = true;
        this.showStaffvalue = 1;
        this.getState();
        this.loading = false;
      }
    });
  }
  getPerformanceDetails(params: any) {
    this.loading = true;
    this.rowPerformanceReport = [];
    this.rowTestingReport = [];
    this.api.getPerformanceDetails(params).subscribe(res => {
      if (res.status == 1) {
        let isPerformanceReport = (res.result.isPerformanceReport > 0) ? res.result.isPerformanceReport : 1;
        let isTestingReport = (res.result.isTestingReport > 0) ? res.result.isTestingReport : 1;
        if (isPerformanceReport == 1 && res.result.performanceReportItem) {
          let jsonPreferenceArray: any[] = res.result.performanceReportItem;
          let uploadUrl = res.result.uploadUrl;
          let uploadFolder = res.result.uploadFolder;
          jsonPreferenceArray.forEach((item: any, index) => {
            this.rowPerformanceReport.push({
              empaneledState: item.stateName,
              empaneledStateText: item.empaneledStateText,
              empaneledYearText: item.empaneledYearText,
              physicalAchievement: item.physicalAchievement,
              financialAchievement: item.financialAchievement,
              document: uploadUrl + uploadFolder + '/' + item.document,
              hdnDocument: item.document,
            });
          });
        }
        if (isTestingReport == 1 && res.result.testingReportItem) {
          let jsonTestingArray: any[] = res.result.testingReportItem;
          let uploadUrl = res.result.uploadUrl;
          let uploadFolder = res.result.uploadFolder;
          jsonTestingArray.forEach((item: any, index) => {
            this.rowTestingReport.push({
              type: item.type,
              selTypeText: item.selTypeText,
              instituteName: item.instituteName,
              validityFromDate: item.validityFromDate,
              validityToDate: item.validityToDate,
              testingDocument: uploadUrl + uploadFolder + '/' + item.testingDocument,
              hdnTestingDocument: item.testingDocument,
            });
          });
        }

        const selectedRadioElement = document.getElementById(`selPerformance${isPerformanceReport}`) as HTMLInputElement;
        selectedRadioElement.checked = true;
        this.showPerformancevalue = isPerformanceReport;

        const selectedRadioTestingElement = document.getElementById(`selTesting${isTestingReport}`) as HTMLInputElement;
        selectedRadioTestingElement.checked = true;
        this.showTestingvalue = isTestingReport;
        this.getState();
        this.getYear();
        this.loading = false;
      } else {
        const selectedRadioElement = document.getElementById(`selPerformance${1}`) as HTMLInputElement;
        selectedRadioElement.checked = true;
        this.showPerformancevalue = 1;

        const selectedRadioTestingElement = document.getElementById(`selTesting${1}`) as HTMLInputElement;
        selectedRadioTestingElement.checked = true;
        this.showTestingvalue = 1;
        this.getState();
        this.getYear();
        this.loading = false;
      }
    });
  }
  //Automatically bind if edit
  populateForm(): void {
    if (this.manufactureDetails) {
      const formControls = this.manufactureDocument.controls;
      this.vchReferenceNo = this.manufactureDetails.vchReferenceNo;
      this.vchApplicantName = this.manufactureDetails.vchApplicantName;
      this.vchCompanyRegNo = this.manufactureDetails.vchCompanyRegNo;
      this.vchComanyHead = this.manufactureDetails.vchComanyHead;
      this.vchMobileNo = this.manufactureDetails.vchMobileNo;
      this.vchEmail = this.manufactureDetails.vchEmail;
      this.vchGSTIN = this.manufactureDetails.vchGSTIN;
      this.manufactureDocument.get(this.getControlName('GST Registration'))?.patchValue(this.vchGSTIN);
      formControls['gstFromDate'].setValue(this.dateBind(this.gstValidity[0].From) || '');
      formControls['gstToDate'].setValue(this.dateBind(this.gstValidity[0].To) || '');
      formControls['dicFromDate'].setValue(this.dateBind(this.dicValidity[0].From) || '');
      formControls['dicToDate'].setValue(this.dateBind(this.dicValidity[0].To) || '');
      // let gstRegFromDate=$(".gstRegistrationFromDate").attr("id");
      // let gstRegToDate=$(".gstRegistrationToDate").attr("id");
      // (< HTMLInputElement > document.getElementById(gstRegFromDate)).value=this.gstValidity[0].From;
      // (< HTMLInputElement > document.getElementById(gstRegToDate)).value=this.gstValidity[0].To;

      // let dicRegFromDate=$(".dicRegistrationFromDate").attr("id");
      // let dicRegToDate=$(".dicRegistrationToDate").attr("id");

      // (< HTMLInputElement > document.getElementById(dicRegFromDate)).value=this.dicValidity[0].From;
      // (< HTMLInputElement > document.getElementById(dicRegToDate)).value=this.dicValidity[0].To;

      if (this.manufactureDetails.txtTurnOver) {
        let jsonTurnoverArray: any[] = JSON.parse(this.manufactureDetails.txtTurnOver);
        jsonTurnoverArray.forEach((item: any, index) => {
          if (item.year) {
            let yearTurnOver = $(".clsAnnualTurnOver_" + index).attr("id");
            (<HTMLInputElement>document.getElementById(yearTurnOver)).value = item.turnover;
          }
        });

      }
    }
  }

  bindDocumentData(): void {
    if (this.manufactureDoc) {
      // Iterate over the documents and set the form values
      this.manufactureDoc.forEach(doc => {
        const controlName = this.getControlName(doc.vchDocumentname);
        if (controlName) {
          // Set input value
          this.manufactureDocument.get(controlName)?.setValue(doc.documentInputVal);
        }

        // Find the corresponding item in tableData and set file details
        const itemIndex = this.tableData.findIndex(item => item.name === doc.vchDocumentname);
        if (itemIndex !== -1) {
          this.tableData[itemIndex].fileName = doc.vchDocumentname;
          this.tableData[itemIndex].originalFileName = doc.vchDocumentdetail;
          this.tableData[itemIndex].file = doc.vchDocumentdetailUrl; // Set URL to preview
          this.tableData[itemIndex].showUpload = false; // Disable upload button
          this.tableData[itemIndex].fileSize = 0;
        }
      });
    }
  }
  isMandatory(item: string): boolean {
    return ['Pan Card', 'Aadhaar Card', 'GST Registration', 'DIC Registration', 'MSME Udyam No.', 'IT Return Copy', 'State Pollution Certificate', 'Turn over Certificate with Balance Sheet and P and L Account', 'Previous Dealership Certificate for Experience in MI'].includes(item);
  }
  onDateSelect(fromDateControl: string, toDateControl: string): void {
    const fromDateValue = this.manufactureDocument.get(fromDateControl).value;
    const toDateValue = this.manufactureDocument.get(toDateControl).value;

    if (fromDateValue && toDateValue) {
      // Create Date objects for comparison
      const fromDate = new Date(fromDateValue.year, fromDateValue.month - 1, fromDateValue.day);
      const toDate = new Date(toDateValue.year, toDateValue.month - 1, toDateValue.day);

      // Check if the From Date is greater than the To Date
      if (fromDate > toDate) {
        this.manufactureDocument.get(toDateControl).setErrors({ invalidDateRange: true });
        Swal.fire({
          icon: 'error',
          text: 'From Date should not be greater than To Date'
        }).then((result) => {
          this.loading = false;
          if (result.isConfirmed) {
            this.manufactureDocument.get(toDateControl).setValue('');  // Clear To Date field
          }
        });
      }
      // Check if the From Date is equal to the To Date
      else if (fromDate.getTime() === toDate.getTime()) {
        this.manufactureDocument.get(toDateControl).setErrors({ invalidDateRange: true });
        Swal.fire({
          icon: 'error',
          text: 'From Date should not be the same as To Date'
        }).then((result) => {
          this.loading = false;
          if (result.isConfirmed) {
            this.manufactureDocument.get(toDateControl).setValue('');  // Clear To Date field
          }
        });
      }
      // If dates are valid, clear any existing errors
      else {
        this.manufactureDocument.get(toDateControl).setErrors(null);
      }
    }
  }

  onDateSelectTest(): void {
    let txtValidityFromDate = $(".txtValidityFromDate").attr("id");
    let txtValidityToDate = $(".txtValidityToDate").attr("id");

    // Get the values from the input fields
    const fromDateValue = (<HTMLInputElement>document.getElementById(txtValidityFromDate)).value;
    const toDateValue = (<HTMLInputElement>document.getElementById(txtValidityToDate)).value;

    // Split and construct Date objects
    const fromDateParts = fromDateValue.split('/');
    const toDateParts = toDateValue.split('/');
    const fromDate = new Date(+fromDateParts[2], +fromDateParts[1] - 1, +fromDateParts[0]);
    const toDate = new Date(+toDateParts[2], +toDateParts[1] - 1, +toDateParts[0]);

    // Check if the To Date is smaller than the From Date
    if (toDate.getTime() < fromDate.getTime()) {
      Swal.fire({
        icon: 'error',
        text: 'From Date should not be greater than To Date'
      }).then((result) => {
        if (result.isConfirmed) {
          // Clear the To Date input field
          (<HTMLInputElement>document.getElementById(txtValidityToDate)).value = '';

          // Manually reset the datepicker states
          const fromDateElement = document.getElementById(txtValidityFromDate);
          const toDateElement = document.getElementById(txtValidityToDate);

          fromDateElement.dispatchEvent(new Event('input', { bubbles: true }));
          toDateElement.dispatchEvent(new Event('input', { bubbles: true }));

          // Optionally trigger focus and blur to visually reset
          fromDateElement.focus();
          fromDateElement.blur();
          toDateElement.focus();
          toDateElement.blur();
        }
      });
    }
    // Check if the From Date is equal to the To Date
    else if (toDate.getTime() === fromDate.getTime()) {
      Swal.fire({
        icon: 'error',
        text: 'From Date should not be the same as To Date'
      }).then((result) => {
        if (result.isConfirmed) {
          // Clear the To Date input field
          (<HTMLInputElement>document.getElementById(txtValidityToDate)).value = '';

          // Manually reset the datepicker states
          const fromDateElement = document.getElementById(txtValidityFromDate);
          const toDateElement = document.getElementById(txtValidityToDate);

          fromDateElement.dispatchEvent(new Event('input', { bubbles: true }));
          toDateElement.dispatchEvent(new Event('input', { bubbles: true }));

          fromDateElement.focus();
          fromDateElement.blur();
          toDateElement.focus();
          toDateElement.blur();
        }
      });
    }
  }



  resetManufacturedFields(btn = ''): void {
    const bisInputElement = document.querySelector('.txtManufacturedBis') as HTMLInputElement;
    if (bisInputElement) {
      bisInputElement.value = '';
    }

    const CMLInputElement = document.querySelector('.txtManufacturedCML') as HTMLInputElement;
    if (CMLInputElement) {
      CMLInputElement.value = '';
    }

    const validityInput = document.querySelector('.txtManufacturedValidity') as HTMLInputElement;
    if (validityInput) {
      validityInput.value = '';
    }

    const manufactureNameInput = document.querySelector('.txtManufacturedManufactureName') as HTMLInputElement;
    if (manufactureNameInput) {
      manufactureNameInput.value = '';
    }

    const prodCapacityInput = document.querySelector('.txtManufacturedProdCapacity') as HTMLInputElement;
    if (prodCapacityInput) {
      prodCapacityInput.value = '';
    }

    const uploadDocInput = document.querySelector('.txtManufacturedUploadDoc') as HTMLInputElement;
    if (uploadDocInput) {
      uploadDocInput.value = '';
    }
    
    // Optionally hide uploaded file section if you want
    this.showHidemanufacturedUploadedFiles = false;
    if (btn=="1"){
      const selectDropdown = document.querySelector('.selManufactured') as HTMLInputElement; 
      if (selectDropdown) {
        selectDropdown.value = '';
      }
    }
  }
  resetProcurementFields(): void {
    const selectDropdown = document.querySelector('.selProcured') as HTMLInputElement;
    if (selectDropdown) {
      selectDropdown.value = '';
    }

    const bisInputElement = document.querySelector('.txtProcuredBis') as HTMLInputElement;
    if (bisInputElement) {
      bisInputElement.value = '';
    }

    const CMLInputElement = document.querySelector('.txtProcuredCML') as HTMLInputElement;
    if (CMLInputElement) {
      CMLInputElement.value = '';
    }

    const validityInput = document.querySelector('.txtProcuredValidity') as HTMLInputElement;
    if (validityInput) {
      validityInput.value = '';
    }

    const manufactureNameInput = document.querySelector('.txtProcuredManufactureName') as HTMLInputElement;
    if (manufactureNameInput) {
      manufactureNameInput.value = '';
    }

    const uploadDocInput = document.querySelector('.txtProcuredUploadDoc') as HTMLInputElement;
    if (uploadDocInput) {
      uploadDocInput.value = '';
    }
    const uploadDocInput1 = document.querySelector('.txtProcuredBISUploadDoc') as HTMLInputElement;
    if (uploadDocInput1) {
      uploadDocInput1.value = '';
    }
    this.showHideprocuredBISUploadedFiles = false;
    this.showHideprocuredUploadedFiles = false;
  }
  resetTechnicalStaff(): void {
    const selectDropdown = document.querySelector('.selStaffState') as HTMLInputElement;
    if (selectDropdown) {
      selectDropdown.value = '';
    }

    const txtStaffName = document.querySelector('.txtStaffName') as HTMLInputElement;
    if (txtStaffName) {
      txtStaffName.value = '';
    }

    const txtDesignation = document.querySelector('.txtDesignation') as HTMLInputElement;
    if (txtDesignation) {
      txtDesignation.value = '';
    }

    const validityInput = document.querySelector('.txtJoiningDate') as HTMLInputElement;
    if (validityInput) {
      validityInput.value = '';
    }

    const txtQualification = document.querySelector('.txtQualification') as HTMLInputElement;
    if (txtQualification) {
      txtQualification.value = '';
    }

    const uploadDocInput = document.querySelector('.txtStaffUploadDoc') as HTMLInputElement;
    if (uploadDocInput) {
      uploadDocInput.value = '';
    }

    this.showHideStaffUploadedFiles = false;
  }
  resetPerformanceReport(): void {
    const selectDropdown = document.querySelector('.selEmpaneledState') as HTMLInputElement;
    if (selectDropdown) {
      selectDropdown.value = '';
    }
    const selectDropdownYear = document.querySelector('.selEmpanelmentYear') as HTMLInputElement;
    if (selectDropdownYear) {
      selectDropdownYear.value = '';
    }

    const txtPhyAchievement = document.querySelector('.txtPhyAchievement') as HTMLInputElement;
    if (txtPhyAchievement) {
      txtPhyAchievement.value = '';
    }

    const txtFinAchievement = document.querySelector('.txtFinAchievement') as HTMLInputElement;
    if (txtFinAchievement) {
      txtFinAchievement.value = '';
    }
  }
  resetTestingReport(): void {
    const selectDropdown = document.querySelector('.selType') as HTMLInputElement;
    if (selectDropdown) {
      selectDropdown.value = '';
    }

    const txtInstituteName = document.querySelector('.txtInstituteName') as HTMLInputElement;
    if (txtInstituteName) {
      txtInstituteName.value = '';
    }

    const uploadDocInput = document.querySelector('.txtTestingUploadDoc') as HTMLInputElement;
    if (uploadDocInput) {
      uploadDocInput.value = '';
    }

    const validityInput = document.querySelector('.txtValidityFromDate') as HTMLInputElement;
    if (validityInput) {
      validityInput.value = '';
    }
    const validityInput1 = document.querySelector('.txtValidityToDate') as HTMLInputElement;
    if (validityInput1) {
      validityInput1.value = '';
    }
    this.testingUploadedFiles = ''
    this.showHideTestingUploadedFiles = false;
  }
  onSelectChange(event: Event): void {
    this.resetManufacturedFields();
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;
    // Handle the selection change
    this.selectOption(this.getOptionLabel(value), parseInt(value, 10));
    this.selectedOption = this.getOptionLabel(value);
    this.selectedValue = parseInt(value, 10);
    this.rowComponentId = [];
    this.rowManufactured = [];
    if (this.selectedValue == 1) {
      this.showDripMandatory = true;
      this.showSprinklerMandatory = false;
      this.showBothMandatory = false;
    } else if (this.selectedValue == 2) {
      this.showDripMandatory = false;
      this.showSprinklerMandatory = true;
      this.showBothMandatory = false;
    } else {
      this.showBothMandatory = true;
      this.showDripMandatory = false;
      this.showSprinklerMandatory = false;
    }
    this.getComponentItem(this.selectedValue, this.rowComponentId);
  }


  getOptionLabel(value: string): string {
    switch (value) {
      case '1':
        return 'Drip Irrigation';
      case '2':
        return 'Sprinkler Irrigation';
      case '3':
        return 'Both';
      default:
        return '';
    }
  }

  getComponentItem(compoId: any, compoIdLists) {
    this.loading = true;
    let componentParam = {
      "componentId": compoId,
      "componentIsLists": compoIdLists
    };
    this.api.getComponentItem(componentParam).subscribe(res => {
      if (res.result.flag == 1) {
        this.loading = false;
        this.itemLists = res.result.resultArr;
      }
    });
  }
  getProcureItem(compoId: any) {
    this.loading = true;
    let componentParam = {
      "componentId": compoId,
      "profileId": this.profileId
    };
    this.api.getProcureItem(componentParam).subscribe(res => {
      if (res.result.flag == 1) {
        this.loading = false;
        this.itemLists = res.result.resultArr;
      }
    });
  }
  getState() {
    this.loading = true;
    let componentParam = {
      "profileId": this.profileId
    };
    this.api.getState(componentParam).subscribe(res => {
      if (res.result.flag == 1) {
        this.loading = false;
        this.stateLists = res.result.resultArr;
      }
    });
  }
  getYear() {
    this.loading = true;
    const startYear = 1950;
    const currentYear = new Date().getFullYear();

    for (let year = startYear; year <= currentYear; year++) {
      this.years.push(year);
    }
    this.loading = false;
  }
  nextStep2(event: Event) {
    event.preventDefault();
    const formData = new FormData();
    const radiosComponent = document.querySelectorAll('.selComponent') as NodeListOf<HTMLInputElement>;
    let selectedComponent: any = '';
    radiosComponent.forEach(radio => {
      if (radio.checked) {
        selectedComponent = radio.value;
      }
    });
    let components = this.rowComponentId;
    const idsToCheck = (selectedComponent == 1) ? ["9", "10", "11"] : ["20", "22"];
    if (selectedComponent == 1 || selectedComponent == 3) {
      const allExist = idsToCheck.every(idToCheck =>
        components.some(component => component.componentId === idToCheck)
      );
      if (!allExist) {
        Swal.fire({
          icon: 'error',
          text: 'Please add all the Mandatory components'
        });
        return;
      }
    }
    if (selectedComponent == 2 || selectedComponent == 3) {
      const allExist = idsToCheck.some(idToCheck =>
        components.some(component => component.componentId === idToCheck)
      );
      if (!allExist) {
        Swal.fire({
          icon: 'error',
          text: 'Please add all the Mandatory components'
        });
        return;
      }
    }


    let totRecMI = this.rowManufactured.length;
    if (totRecMI == 0) {
      Swal.fire({
        icon: 'error',
        text: 'No manufactured list found.'
      });
      return;
    }
    this.loading = true;
    formData.append('profileId', this.profileId);
    formData.append('selectedComponent', selectedComponent);
    for (let i = 0; i < totRecMI; i++) {
      const file = this.rowManufactured[i].certificate;
      formData.append('manufacturedDetails[' + i + '][certificate]', file);
      formData.append('manufacturedDetails[' + i + '][hdnCertificate]', this.rowManufactured[i].hdnCertificate);
      formData.append('manufacturedDetails[' + i + '][componentName]', this.rowManufactured[i].componentName);
      formData.append('manufacturedDetails[' + i + '][componentSelectName]', this.rowManufactured[i].componentSelectName);
      formData.append('manufacturedDetails[' + i + '][bisCode]', this.rowManufactured[i].bisCode);
      formData.append('manufacturedDetails[' + i + '][cmlNo]', this.rowManufactured[i].cmlNo);
      formData.append('manufacturedDetails[' + i + '][validDate]', this.rowManufactured[i].validDate);
      formData.append('manufacturedDetails[' + i + '][manufactureName]', this.rowManufactured[i].manufactureName);
      formData.append('manufacturedDetails[' + i + '][productionCapacity]', this.rowManufactured[i].productionCapacity);

      this.uploadSecondTab(formData, 1);
    }
  }
  nextStep3(event: Event) {
    event.preventDefault();
    const formData = new FormData();
    let totRecMI = this.rowProcured.length;
    if (totRecMI == 0) {
      Swal.fire({
        icon: 'error',
        text: 'No procured manufactured list found.'
      });
      return;
    }
    this.loading = true;
    formData.append('profileId', this.profileId);
    for (let i = 0; i < totRecMI; i++) {
      const file = this.rowProcured[i].certificate;
      const bisfile = this.rowProcured[i].bisCertificate;
      formData.append('procuredDetails[' + i + '][certificate]', file);
      formData.append('procuredDetails[' + i + '][biscertificate]', bisfile);
      formData.append('procuredDetails[' + i + '][hdnCertificate]', this.rowProcured[i].hdnCertificate);
      formData.append('procuredDetails[' + i + '][hdnBISCertificate]', this.rowProcured[i].hdnBISCertificate);
      formData.append('procuredDetails[' + i + '][componentName]', this.rowProcured[i].componentName);
      formData.append('procuredDetails[' + i + '][componentSelectName]', this.rowProcured[i].componentSelectName);
      formData.append('procuredDetails[' + i + '][bisCode]', this.rowProcured[i].bisCode);
      formData.append('procuredDetails[' + i + '][cmlNo]', this.rowProcured[i].cmlNo);
      formData.append('procuredDetails[' + i + '][validDate]', this.rowProcured[i].validDate);
      formData.append('procuredDetails[' + i + '][manufactureName]', this.rowProcured[i].manufactureName);

      this.uploadThirdTab(formData, 1);
    }
  }
  nextStep4(event: Event) {
    event.preventDefault();
    const formData = new FormData();
    const radiosTechnical = document.querySelectorAll('.selTechnical') as NodeListOf<HTMLInputElement>;
    let selectedTechnical: any = '';
    radiosTechnical.forEach(radio => {
      if (radio.checked) {
        selectedTechnical = radio.value;
      }
    });
    let totRowTS = this.rowTechnicalStaff.length;
    formData.append('selectedTechnical', selectedTechnical);
    formData.append('profileId', this.profileId);
    if (selectedTechnical == 1) {
      if (totRowTS == 0) {
        Swal.fire({
          icon: 'error',
          text: 'No technical staff list found.'
        });
        return;
      }
      this.loading = true;
      for (let i = 0; i < totRowTS; i++) {
        const file = this.rowTechnicalStaff[i].document;
        formData.append('technicalStaffDetails[' + i + '][document]', file);
        formData.append('technicalStaffDetails[' + i + '][hdnDocument]', this.rowTechnicalStaff[i].hdnDocument);
        formData.append('technicalStaffDetails[' + i + '][staffName]', this.rowTechnicalStaff[i].staffName);
        formData.append('technicalStaffDetails[' + i + '][designationName]', this.rowTechnicalStaff[i].designationName);
        formData.append('technicalStaffDetails[' + i + '][joiningDate]', this.rowTechnicalStaff[i].joiningDate);
        formData.append('technicalStaffDetails[' + i + '][servingState]', this.rowTechnicalStaff[i].servingState);
        formData.append('technicalStaffDetails[' + i + '][servingStateText]', this.rowTechnicalStaff[i].servingStateText);
        formData.append('technicalStaffDetails[' + i + '][qualification]', this.rowTechnicalStaff[i].qualification);

        this.uploadFourthTab(formData, 1);
      }
    } else {
      this.uploadFourthTab(formData, 1);
    }

  }
  nextStep5(event: Event) {
    event.preventDefault();
    const formData = new FormData();
    const radiosPerformance = document.querySelectorAll('.selPerformance') as NodeListOf<HTMLInputElement>;
    let selectedPerformance: any = '';
    radiosPerformance.forEach(radio => {
      if (radio.checked) {
        selectedPerformance = radio.value;
      }
    });
    let totRowPR = this.rowPerformanceReport.length;
    formData.append('selectedPerformance', selectedPerformance);
    formData.append('profileId', this.profileId);
    if (selectedPerformance == 1) {
      if (totRowPR == 0) {
        Swal.fire({
          icon: 'error',
          text: 'No performance report found.'
        });
        return;
      }
      this.loading = true;
      for (let i = 0; i < totRowPR; i++) {
        formData.append('performanceDetails[' + i + '][stateName]', this.rowPerformanceReport[i].empaneledState);
        formData.append('performanceDetails[' + i + '][stateNameText]', this.rowPerformanceReport[i].empaneledStateText);
        formData.append('performanceDetails[' + i + '][empaneledYear]', this.rowPerformanceReport[i].empaneledYearText);
        formData.append('performanceDetails[' + i + '][physicalAchievement]', this.rowPerformanceReport[i].physicalAchievement);
        formData.append('performanceDetails[' + i + '][financialAchievement]', this.rowPerformanceReport[i].financialAchievement);

        //this.uploadFourthTab(formData,1);
      }
    }

    const radiosTesting = document.querySelectorAll('.selTesting') as NodeListOf<HTMLInputElement>;
    let selectedTesting: any = '';
    radiosTesting.forEach(radio => {
      if (radio.checked) {
        selectedTesting = radio.value;
      }
    });
    let totRowTR = this.rowTestingReport.length;
    formData.append('selectedTesting', selectedTesting);
    if (selectedTesting == 1) {
      if (totRowTR == 0) {
        Swal.fire({
          icon: 'error',
          text: 'No testing report found.'
        });
        return;
      }
      this.loading = true;
      for (let i = 0; i < totRowTR; i++) {
        const file = this.rowTestingReport[i].testingDocument;
        formData.append('testingDetails[' + i + '][testingDocument]', file);
        formData.append('testingDetails[' + i + '][hdnTestingDocument]', this.rowTestingReport[i].hdnTestingDocument);
        formData.append('testingDetails[' + i + '][type]', this.rowTestingReport[i].selType);
        formData.append('testingDetails[' + i + '][typeText]', this.rowTestingReport[i].selTypeText);
        formData.append('testingDetails[' + i + '][instituteName]', this.rowTestingReport[i].instituteName);
        formData.append('testingDetails[' + i + '][validityFromDate]', this.rowTestingReport[i].validityFromDate);
        formData.append('testingDetails[' + i + '][validityToDate]', this.rowTestingReport[i].validityToDate);

      }
    }
    if (this.type == 'edit') {
      this.loading = false;
      if (!this.manufactureDocument.get('remarks').value) {
        Swal.fire({
          icon: 'error',
          text: 'Please Enter Resubmission Remarks'
        });
        return;
      }
      this.loading = true;
    }
    formData.append('type', this.type == 'edit' ? this.type : '');
    formData.append('remarks', this.type == 'edit' ? this.manufactureDocument.get('remarks').value : '');
    this.uploadFifthTab(formData, 1);
  }

  uploadSecondTab(formData: any, fileNum: number) {
    this.loading = false;
    Swal.fire({
      icon:'warning',
      title: 'Do you want to Submit?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.fuService.updateManufacturedItem(formData)
          .subscribe(event => {
            if (event.type === HttpEventType.UploadProgress) {
              this.percentUploaded[fileNum] = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.fileUploadSuccess();
              let upSts = event['body']['status'];
              let upMsg = event['body']['msg'];
              // start after uploaded
              if (upSts == 1) {
                this.loading = false;
                Swal.fire({
                  icon: 'success',
                  text: upMsg,
                }).then(() => {
                  this.setStep(3)
                });
              }
              else {
                this.loading = false;
                Swal.fire({
                  icon: 'error',
                  text: upMsg
                });
              }
              // end after uploaded
            }
          },
            err => console.log(err)
          );
      }
    })
  }
  uploadThirdTab(formData: any, fileNum: number) {
    this.loading = false;
    Swal.fire({
      icon:'warning',
      title: 'Do you want to Submit?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.fuService.updateProcuredItem(formData)
          .subscribe(event => {
            if (event.type === HttpEventType.UploadProgress) {
              this.percentUploaded[fileNum] = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.fileUploadSuccess();
              let upSts = event['body']['status'];
              let upMsg = event['body']['msg'];
              // start after uploaded
              if (upSts == 1) {
                this.loading = false;
                Swal.fire({
                  icon: 'success',
                  text: upMsg,
                }).then(() => {
                  this.setStep(4)
                });
              }
              else {
                this.loading = false;
                Swal.fire({
                  icon: 'error',
                  text: upMsg
                });
              }
              // end after uploaded
            }
          },
            err => console.log(err)
          );
      }
    })
  }
  uploadFourthTab(formData: any, fileNum: number) {
    this.loading = false;
    Swal.fire({
      icon:'warning',
      title: 'Do you want to Submit?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.fuService.updateTechnicalStaffItem(formData)
          .subscribe(event => {
            if (event.type === HttpEventType.UploadProgress) {
              this.percentUploaded[fileNum] = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.fileUploadSuccess();
              let upSts = event['body']['status'];
              let upMsg = event['body']['msg'];
              // start after uploaded
              if (upSts == 1) {
                this.loading = false;
                Swal.fire({
                  icon: 'success',
                  text: upMsg,
                }).then(() => {
                  this.setStep(5)
                });
              }
              else {
                this.loading = false;
                Swal.fire({
                  icon: 'error',
                  text: upMsg
                });
              }
              // end after uploaded
            }
          },
            err => console.log(err)
          );
      }
    })
  }
  uploadFifthTab(formData: any, fileNum: number) {
    this.loading = false;
    Swal.fire({
      icon:'warning',
      title: 'Do you want to final submit?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.fuService.updateReportItem(formData)
          .subscribe(event => {
            if (event.type === HttpEventType.UploadProgress) {
              this.percentUploaded[fileNum] = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.fileUploadSuccess();
              let upSts = event['body']['status'];
              let upMsg = event['body']['msg'];
              // start after uploaded
              if (upSts == 1) {
                this.loading = false;
                Swal.fire({
                  icon: 'success',
                  text: upMsg,
                }).then(() => {
                  let params = this.encDec.encText((this.profileId + ':' + this.referenceNo + ':' + this.mobileNo).toString());
                  this.router.navigate(['/manufacture-portal/manufacture-applied/' + params]);
                });
              }
              else {
                this.loading = false;
                Swal.fire({
                  icon: 'error',
                  text: upMsg
                });
              }
              // end after uploaded
            }
          },
            err => console.log(err)
          );
      }
    })
  }
  nextStep1(event: Event) {
    event.preventDefault();
    this.submitted = true;
    const formData = new FormData();
    let fileArr = [];
    let turnOverArr = [];
    if (!this.manufactureDocument.get('panCard').value) {
      Swal.fire({
        icon: 'error',
        text: 'Please Enter PAN Card Number'
      });
      return;
    }
    if (!this.manufactureDocument.get('aadhaarCard').value) {
      Swal.fire({
        icon: 'error',
        text: 'Please Enter Aadhaar Card Number'
      });
      return;
    }
    else if (this.manufactureDocument.get('aadhaarCard').value.length != 12) {
      Swal.fire({
        icon: 'error',
        text: 'Please Enter a Valid Aadhaar No'
      });
      return;
    }
    else if (!this.vldChkLst.validAadhar(this.manufactureDocument.get('aadhaarCard').value)) {
      return
    }
    if (!this.manufactureDocument.get('gstRegistration').value) {
      Swal.fire({
        icon: 'error',
        text: 'Please Enter GST Registration No.'
      });
      return;
    }

    const gstFromDateObj = this.manufactureDocument.get('gstFromDate').value;
    const gstFromDateFormatted = `${gstFromDateObj.year}-${this.padNumber(gstFromDateObj.month)}-${this.padNumber(gstFromDateObj.day)}`;

    const gstToDateObj = this.manufactureDocument.get('gstToDate').value;
    const gstToDateFormatted = `${gstToDateObj.year}-${this.padNumber(gstToDateObj.month)}-${this.padNumber(gstToDateObj.day)}`;
    if (!gstFromDateObj || !gstToDateObj) {
      Swal.fire({
        icon: 'error',
        text: 'Please Choose GST Registration From Date and To Date'
      });
      return;
    }
    if (!this.manufactureDocument.get('dicRegistration').value) {
      Swal.fire({
        icon: 'error',
        text: 'Please Enter DIC Registration No.'
      });
      return;
    }

    const dicFromDateObj = this.manufactureDocument.get('dicFromDate').value;
    const dicFromDateFormatted = `${dicFromDateObj.year}-${this.padNumber(dicFromDateObj.month)}-${this.padNumber(dicFromDateObj.day)}`;

    const dicToDateObj = this.manufactureDocument.get('dicToDate').value;
    const dicToDateFormatted = `${dicToDateObj.year}-${this.padNumber(dicToDateObj.month)}-${this.padNumber(dicToDateObj.day)}`;

    if (!dicFromDateObj || !dicToDateObj) {
      Swal.fire({
        icon: 'error',
        text: 'Please Choose DIC Registration From Date and To Date'
      });
      return;
    }

    if (!this.manufactureDocument.get('msmeUdyam').value) {
      Swal.fire({
        icon: 'error',
        text: 'Please Enter MSME Udyam No.'
      });
      return;
    }
    // Call the validation function before proceeding
    // if (!this.validateDocumentLengths()) {
    //   return;
    // }

    for (let i = 0; i < this.tableData.length; i++) {
      let hidFile = (<HTMLInputElement>document.getElementById('fileUpload' + i + '_hdnFile')).value;
      const file = this.tableData[i].file;
      const itemName = this.tableData[i].name;
      const controlName = this.getControlName(itemName);
      const inputValue = this.manufactureDocument.get(controlName)?.value || '';
      if ((hidFile == '' && this.isMandatory(this.staticArray[i])) || (hidFile == 'Undefined' && this.isMandatory(this.staticArray[i]))) {
        if (file == null) {
          Swal.fire({
            icon: 'error',
            text: 'Please Upload ' + this.staticArray[i]
          });
          return;
        }
      }
      fileArr.push({ id: 'file' + i, name: this.staticArray[i], docDetails: inputValue, hiddenFile: hidFile });
      formData.append('file' + i, file);
    }
    for (let i = 0; i < 3; i++) {
      let turnOverYear = $(".clstxtAnnualYear_" + i).attr("id");
      let annualTurnOver = $(".clsAnnualTurnOver_" + i).attr("id");
      const turnOverFyear = (<HTMLInputElement>document.getElementById(turnOverYear)).value;
      const turnOverLakh = (<HTMLInputElement>document.getElementById(annualTurnOver)).value;
      //let turnOver=this.manufactureDocument.get('txtAnnualTurnOver_'+i).value;
      if (!turnOverLakh) {
        Swal.fire({
          icon: 'error',
          text: 'Please Enter Turnover year wise'
        });
        return;
      }
      turnOverArr.push({ year: turnOverFyear, turnover: turnOverLakh });
    }
    formData.append('component', this.manufactureDocument.get('selectedOption').value);
    formData.append('dripBisNo', this.manufactureDocument.get('dripBisNo').value);
    formData.append('sprinklerBisNo', this.manufactureDocument.get('sprinklerBisNo').value);
    formData.append('panCard', this.manufactureDocument.get('panCard').value);
    formData.append('aadhaarCard', this.manufactureDocument.get('aadhaarCard').value);
    formData.append('gstRegistration', this.manufactureDocument.get('gstRegistration').value);
    formData.append('dicRegistration', this.manufactureDocument.get('dicRegistration').value);
    formData.append('gstFromDate', gstFromDateFormatted);
    formData.append('gstToDate', gstToDateFormatted);
    formData.append('dicFromDate', dicFromDateFormatted);
    formData.append('dicToDate', dicToDateFormatted);

    formData.append('isEdit', this.isEdit);
    formData.append('msmeUdyam', this.manufactureDocument.get('msmeUdyam').value ? this.manufactureDocument.get('msmeUdyam').value : '');
    formData.append('profileId', this.profileId);
    formData.append('referenceNo', this.referenceNo);
    formData.append('mobileNo', this.mobileNo);
    formData.append('allFiles', JSON.stringify(fileArr));
    formData.append('fileNames', fileArr.map(file => file.name).join(','));
    formData.append('turnOver', JSON.stringify(turnOverArr));

    this.uploadFile(formData, 1);
  }

  onKeyPress(event: KeyboardEvent, name: string) {
    const charCode = event.which ? event.which : event.keyCode;
    const charStr = String.fromCharCode(charCode);

    switch (name) {
      case 'Pan Card':
        // Pan Card: Allow only uppercase letters and numbers, max length 10
        if (!/[A-Z0-9]/.test(charStr) || this.manufactureDocument.get(this.getControlName(name)).value.length >= 10) {
          event.preventDefault();
        }
        break;

      case 'Aadhaar Card':
        // Aadhaar Card: Allow only numbers, max length 12
        if (!/[0-9]/.test(charStr) || this.manufactureDocument.get(this.getControlName(name)).value.length >= 12) {
          event.preventDefault();
        }
        break;

      case 'GST Registration':
        // GST Registration: Allow only uppercase letters, numbers, max length 15
        if (!/[A-Z0-9]/.test(charStr) || this.manufactureDocument.get(this.getControlName(name)).value.length >= 15) {
          event.preventDefault();
        }
        break;

      case 'DIC Registration':
        // DIC Registration: Allow only uppercase letters, numbers, max length 19
        if (!/[A-Z0-9]/.test(charStr) || this.manufactureDocument.get(this.getControlName(name)).value.length >= 19) {
          event.preventDefault();
        }
        break;

      case 'MSME Udyam No.':
        // MSME Udyam No: Allow only uppercase letters and numbers, max length 12
        if (!/[A-Z0-9]/.test(charStr) || this.manufactureDocument.get(this.getControlName(name)).value.length >= 19) {
          event.preventDefault();
        }
        break;

      default:
        break;
    }
  }
  onInputChange(value: string, itemName: string, index: number): void {
    const minLength = this.getMinLength(itemName);
    if (itemName == 'Aadhaar Card') {
      if (!this.vldChkLst.validAadhar(this.manufactureDocument.get('aadhaarCard').value)) {
        return
      }
    }
    if (+value.length < +minLength) {
      Swal.fire({
        icon: 'error',
        text: `Please enter a valid ${itemName}. The value should be of ${minLength} characters.`,
      }).then(() => {
        const inputFieldId = `inputField_${itemName}_${index}`;
        const inputElement = document.getElementById(inputFieldId) as HTMLInputElement;

        if (inputElement) {
          inputElement.focus();
        }
      });
      return;
    }
    const checkParam = {
      "profileId": this.profileId,
      "itemName": itemName,
      "value": value,
    };
    this.loading = true;
    this.api.checkDuplicateValue(checkParam).subscribe(res => {
      this.loading = false;
      this.respSts = res.status;
      if (this.respSts == 1) {
        this.respList = res.result[0];
        this.loading = false;
        if (this.respList.status == 1) {
          Swal.fire({
            icon: 'error',
            text: this.respList.msg
          }).then(() => {
            this.manufactureDocument.get(this.getControlName(itemName))?.patchValue('');
            const inputFieldId = `inputField_${itemName}_${index}`;
            const inputElement = document.getElementById(inputFieldId) as HTMLInputElement;

            if (inputElement) {
              inputElement.focus();
            }
          });
        }

      } else {
        this.loading = false;
      }

    });
  }
  isNumberKey(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const char = event.key;

    // Allow control keys (Backspace, Delete, Arrow keys)
    const controlKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (controlKeys.includes(event.key)) {
      return; // Allow control keys
    }

    // Prevent non-numeric characters, except for the decimal point
    if ((char < '0' || char > '9') && char !== '.') {
      event.preventDefault();
      return;
    }

    // Prevent starting the input with a decimal point
    if (value === '' && char === '.') {
      event.preventDefault();
      return;
    }

    // Allow only one decimal point
    if (char === '.' && value.includes('.')) {
      event.preventDefault();
      return;
    }

    // Allow only up to 2 digits after the decimal point
    const decimalIndex = value.indexOf('.');
    if (decimalIndex !== -1 && value.length - decimalIndex > 2 && input.selectionStart > decimalIndex) {
      event.preventDefault();
    }
  }

  onChange(event: any) {
    const input = event.target.value;

    // If input is empty, set it to '0'
    if (input === '') {
      event.target.value = '0';
      return;
    }

    // Ensure there's only one decimal point
    const parts = input.split('.');
    if (parts.length > 2) {
      event.target.value = parts[0] + '.' + parts.slice(1).join('');
    }

    // Handle removal of the integer part
    if (parts[0] === '') {
      event.target.value = '0.' + (parts[1] || '');
    } else {
      // Ensure correct formatting for cases like 1.2 to 0.2
      const integerPart = parts[0].replace(/^0+/, ''); // Remove leading zeros
      const decimalPart = parts[1] ? parts[1].slice(0, 2) : ''; // Limit to 2 decimal places

      if (integerPart === '') {
        event.target.value = '0.' + decimalPart; // Set to '0.xx' if integer part is empty
      } else {
        event.target.value = integerPart + (decimalPart ? '.' + decimalPart : ''); // Reassemble value
      }
    }

    // Remove trailing decimal point if exists
    if (event.target.value.endsWith('.')) {
      event.target.value = event.target.value.slice(0, -1);
    }
  }
  // Handle the blur event to remove trailing decimal points
  onBlur(event: any) {
    const input = event.target.value;

    // Remove trailing decimal point when the user leaves the input
    if (input.endsWith('.')) {
      event.target.value = input.slice(0, -1);
    }
  }
  formatDate(dateObj: any): string {
    return `${dateObj.year}-${this.padNumber(dateObj.month)}-${this.padNumber(dateObj.day)}`;
  }

  padNumber(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  uploadFile(formData: any, fileNum: number) {
    Swal.fire({
      icon:'warning',
      title: 'Do you want to Submit?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.fuService.uploadDocumentWithForManufacture(formData)
          .subscribe(event => {
            if (event.type === HttpEventType.UploadProgress) {
              this.percentUploaded[fileNum] = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.fileUploadSuccess();
              let upSts = event['body']['status'];
              let upMsg = event['body']['msg'];
              // start after uploaded
              if (upSts == 1) {
                this.loading = false;
                Swal.fire({
                  icon: 'success',
                  text: upMsg,
                }).then(() => {
                  this.setStep(2)
                });
              }
              else {
                this.loading = false;
                Swal.fire({
                  icon: 'error',
                  text: upMsg
                });
              }
              // end after uploaded
            }
          },
            err => console.log(err)
          );
      }
    })
  }

  getControlName(name: string): string {
    switch (name) {
      case 'Pan Card':
        return 'panCard';
      case 'Aadhaar Card':
        return 'aadhaarCard';
      case 'GST Registration':
        return 'gstRegistration';
      case 'DIC Registration':
        return 'dicRegistration';
      case 'MSME Udyam No.':
        return 'msmeUdyam';
      default:
        return '';
    }
  }
  getMaxLength(name: string): string {
    switch (name) {
      case 'Pan Card':
        return '10';
      case 'Aadhaar Card':
        return '12';
      case 'GST Registration':
        return '15';
      case 'DIC Registration':
        return '19';
      case 'MSME Udyam No.':
        return '19';
      default:
        return '';
    }
  }
  getMinLength(name: string): string {
    switch (name) {
      case 'Pan Card':
        return '10';
      case 'Aadhaar Card':
        return '12';
      case 'GST Registration':
        return '15';
      case 'DIC Registration':
        return '19';
      case 'MSME Udyam No.':
        return '19';
      default:
        return '';
    }
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
  goBack(event: Event) {
    event.preventDefault();
    window.history.back();
  }

  dateBind(isoDateString: string): NgbDateStruct {
    const [year, month, day] = isoDateString.split('-').map(Number);
    return { day, month, year };
  }
  
  // Method to validate input by removing invalid characters
  validateQualificationInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const invalidChars = /[%&^*#@!(){}[\]<>?/\\|+=~`$]/g;

    // Remove invalid characters as they are entered
    input.value = input.value.replace(invalidChars, '');
  }

  // validateDocumentLengths(): boolean {
  //   const requiredDocuments = ['Pan Card', 'Aadhaar Card', 'GST Registration', 'DIC Registration', 'MSME Udyam No.'];

  //   for (const docName of requiredDocuments) {
  //     const controlName = this.getControlName(docName);
  //     const inputValue = this.manufactureDocument.get(controlName)?.value || '';

  //     const minLength = this.getMinLength(docName);
  //     const maxLength = this.getMaxLength(docName);

  //     // Check for length
  //     if (inputValue.length < +minLength || inputValue.length > +maxLength) {
  //       Swal.fire({
  //         icon: 'error',
  //         text: `Please enter a valid ${docName} with length between ${minLength} and ${maxLength} characters.`
  //       });
  //       return false;
  //     }

  //     // Special validation for Aadhaar
  //     if (docName === 'Aadhaar Card' && !this.vldChkLst.validAadhar(inputValue)) {
  //       return false;
  //     }
  //   }

  //   return true; // All validations passed
  // }
}
