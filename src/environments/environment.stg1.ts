// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


export const environment = {
  production: true,
  url: '',


  // serviceURL: https://stg.csmpl.com/Fard_stg//admin/api/',
  // siteURL: https://stg.csmpl.com/Fard_stg//website/',
  // websiteserviceURL: https://stg.csmpl.com/Fard_stg//cms/api/',
  // fileUrl: https://stg.csmpl.com/Fard_stg//cms/storage/uploads/images/',
  // domainUrl:https://stg.csmpl.com/Fard_stg//admin/',
  // cmsdomainUrl:https://stg.csmpl.com/Fard_stg//cms/',


  // serviceURL: 'https://stg.csmpl.com/Fard_stg//admin/api/',
  // siteURL: 'https://stg.csmpl.com/Fard_stg//website/',
  // websiteserviceURL: 'https://stg.csmpl.com/Fard_stg//cms/api/',
  // fileUrl: 'https://stg.csmpl.com/Fard_stg//cms/storage/uploads/images/',
  // domainUrl:'https://stg.csmpl.com/Fard_stg//admin/',
  // cmsdomainUrl:'https://stg.csmpl.com/Fard_stg//cms/',



  // serviceURL: 'http://192.168.103.126:7001/fard/admin/api/',


  // siteURL: 'http://localhost:4200/',
  // websiteserviceURL: 'http://192.168.103.123:7002/fard/cms/api/',
  // fileUrl: 'http://192.168.103.126:7001/fard/cms/storage/uploads/images/',
  // domainUrl:'http://192.168.103.126:7001/fard/admin/',
  // cmsdomainUrl:'http://192.168.103.126:7001/fard/cms/',





  //siteURL: 'http://localhost:4200/',
  // siteURL: 'http://192.168.203.90:4200/',


  // serviceURL: 'http://192.168.201.94:7001/fard/admin/api/',
  // websiteserviceURL: 'http://192.168.103.126:7001/fard/cms/api/',
  // fileUrl: 'http://localhost:7001/fard/cms/storage/uploads/images/',
  // domainUrl:'http://localhost:7001/fard/admin/',
  // cmsdomainUrl:'http://localhost:7001/fard/cms/',


  // serviceURL: 'http://192.168.103.126:7001/fard/admin/api/',
  // websiteserviceURL: 'http://192.168.103.126:7001/fard/cms/api/',
  // fileUrl: 'http://192.168.103.126:7001/fard/cms/storage/uploads/images/',
  // domainUrl:'http://192.168.103.126:7001/fard/admin/',
  // cmsdomainUrl:'http://192.168.103.126:7001/fard/cms/',


  // serviceURL: 'http://192.168.150.222:7001/fard_pmksy/admin/api/',
  // websiteserviceURL: 'http://192.168.150.222:7001/fard_pmksy/cms/api/',
  // fileUrl: 'http://192.168.150.222:7001/fard_pmksy/cms/storage/uploads/images/',
  // domainUrl:'http://192.168.150.222:7001/fard_pmksy/admin/',
  // cmsdomainUrl:'http://192.168.150.222:7001/fard_pmksy/cms/',



  /*serviceURL: 'http://192.168.103.202:7001/fard_pmksy/admin/api/',
  websiteserviceURL: 'http://192.168.103.202:7001/fard_pmksy/cms/api/',
  fileUrl: 'http://192.168.103.202:7001/fard_pmksy/cms/storage/uploads/images/',
  domainUrl:'http://192.168.103.202:7001/fard_pmksy/admin/',
  cmsdomainUrl:'http://192.168.103.202:7001/fard_pmksy/csm/',
  servicePMKSYURL:'http://192.168.103.202:7001/fard_pmksy/admin/pmksy/',
  serviceAPICOLURL:'',
 */
  serviceURL: 'https://stg.csmpl.com/Fard_stg/admin/api/',
  siteURL: 'https://stg.csmpl.com/Fard_stg/website/',
  websiteserviceURL: 'https://stg.csmpl.com/Fard_stg/cms/api/',
  fileUrl: 'https://stg.csmpl.com/Fard_stg/cms/storage/uploads/images/',
  domainUrl:'https://stg.csmpl.com/Fard_stg/admin/',
  cmsdomainUrl:'https://stg.csmpl.com/Fard_stg/cms/',
  serviceAPICOLURL:'https://stg.csmpl.com/Fard_stg/admin/apicol/',
  servicePMKSYURL:'https://stg.csmpl.com/Fard_stg/admin/pmksy/',
  helpedeskserviceUrl:'https://stg.csmpl.com/Fard_stg/helpdesk/admin/',
  GRIEVANCE_URL:"",

  
  /*serviceURL: 'http://192.168.10.75/Fard_testI/admin/api/',
  siteURL: 'http://192.168.10.75/Fard_testI/website/',
  websiteserviceURL: 'http://192.168.10.75/Fard_testI/cms/api/',
  fileUrl: 'http://192.168.10.75/Fard_testI/cms/storage/uploads/images/',
  domainUrl:'http://192.168.10.75/Fard_testI/admin/',
  cmsdomainUrl:'http://192.168.10.75/Fard_testI/cms/',
  serviceAPICOLURL:'http://192.168.10.75/Fard_testI/admin/apicol/',
  servicePMKSYURL:'http://192.168.10.75/Fard_testI/admin/pmksy/',
  helpedeskserviceUrl:'http://192.168.10.75/Fard_testI/helpdesk/admin/',
  GRIEVANCE_URL:"",    //For Testing*/
  
  // fileUrl: 'http://192.168.103.126:7001/fard/cms/storage/uploads/images/',
  // domainUrl:'http://192.168.103.126:7001/fard/admin/',
  // cmsdomainUrl:'http://192.168.103.126:7001/fard/cms/',



  apiUrl: '',

  GOPAlAN:99,
  encryptKey: 'AA74CDCC2BBRT935136',
  encryptIV: '26102021@qwI',
  my_bearer_auth: 'Bearer ' + sessionStorage.getItem('loggedtoken'),
  my_auth: 'Basic ' + btoa('admin' + ':' + 'admin'),
  errorMsg: 'Some Error Occured',
  constScheme: 1,
  constService: 2,
  IS_PRE_POST:1,//1=Active,2=InActive

  constDrftSts: 1,
  constDocSts: 2,
  constPrevwSts: 3,


  constQrySts: 6,
  constRsmSts: 3,
  constMatchValue:0.7,
  sujogPortal:36,
  agricultureDirectory:6,
  directoryListicons:{'1':'fish.png','2':'animal-care.png','3':'apicol.png','4':'horticulture.png','5':'shovel.png','6':'planting.png','7':'paresram.jpg','8':'odisha-govt-ogo.png','9':'sujog.jpg','10':'mosarkar.png','11':'ospcb-logo.png'},
  APICOL_Directorate:3,
  how_to_use_yt_link:'https://www.youtube.com/embed/F6FpHQPjP0Q',
  redirectMsg:'This will be redirected to external URL for filling up rest of the information',
  seedDBT:55,
  seedDBTPre:59,
  seedDBTTOTHECTValdn:3,
  maxNoOfTimeSeedDbtToBeApplied:4,
  prefixArr:{'344':'ANG', '345':'BOL', '346':'BAL', '347':'BAR', '348':'BHA', '349':'BOU', '350':'CUT', '351':'DEO', '352':'DHE', '353':'GAJ', '354':'GAN', '355':'JAG', '356':'JAJ', '357':'JHA', '358':'KAL', '359':'KAN', '360':'KEN', '361':'KEO', '362':'KHU', '363':'KOR', '364':'MAL', '365':'MAY', '366':'NAB', '367':'NAY', '368':'NUA', '369':'PUR', '370':'RAY', '371':'SAM', '372':'SON', '373':'SUN'},
  APICOL_SCHEME_IDS:['31','32','44'],
  APICOL_CAGE_CULTURE:62,
  APICOL_BHULKEH_LAND_INFO:'Bhulkeh_Land_Info',
  APICOL_CAGE_CULTURE_LAND_INFO:'Cage_Culture_Land_Info',
  seedDBTBOOKINGAMTPERCNT:25,
  KO_SCHEME_IDS:['31','28','29','30','42','41','40','86','87','90'],
  MKUY_SELF:'NO',
  NO_NET_PROFIT_YEAR :'7',
  AIFPortal:58,
  APP_CANCEL_REQUEST:49,
  APPROVE_APP_CANCEL:50,
  APP_CANCEL_BY_DNO:51,
  INTER_SECTOR_TYPE:86,
  INTRA_SECTOR_SECTOR:6,
  INTERSECTOR:5,
  INTER_SECTOR_SECTOR_INFO:'Sector_Details',
  INTRA_SECTOR_SECTOR_INFO:'intraSectorData',
  BANK_LOAN_10_PERCENT:10,
  NET_PROFIIT_SHG:100000,
  NET_PROFIIT_OTHER:200000,
  PAY_ENABLE:'YES',
  farmerType:{'1':'Small/Marginal Farmer', '2':'Big Farmer', '4':'Cluster', '5':'Institutions'},
  farmerTypeDetails:{'1':'Total land area < 2 Ha', '2':'Total land area greater than or equal to 2 Ha', '4':'Total Land area greater than 50 Ha', '5':'Organisation that are involved in agricultural activities in their own land / contract farming / land on lease'},
  clusterType:{'1':'Water User Association / Group', '2':'FPO (Farmer Producer Group)', '3':'Co-operative Societies', '4':'SHGs (Self Help Group)', '5':'Growers Association'},
  PMKSY_SCHEME:['86','87'],
  landArea:'',
  FMR_ACTIVITY_UPDATE:[1, 2],
  ADVANCECISSTATUS:58,
  CROP_OTHER:['11','12'],
  ko_categoryType:{'1':'Others', '2':'SC', '3':'ST', '4':'Others', '5':'Others'},
  MILLET_SERVICE_CENTER:114,
  RESUBMIT_MANUFACTURE:73,
  AADHAAR_BASED_LOGIN_SCHEME:['86','87'],
  AUTO_BIND_VERIFY_OTP : 1,
	formlist: [
	  { key: "Fisheries", value: "1"},
	  { key: "Animal Husbandry", value: "2"},
	  { key: "APICOL", value: "3"},
	  { key: "Horticulture", value: "4"},
	  { key: "Agriculture", value: "6"},
	  { key: "Factories & Boilers", value: "7"},
	  { key: "Revenue Department", value: "8"},
	  { key: "Housing & Urban Development", value: "9"},
	  { key: "Energy Department", value: "10"},
	  { key: "Pollution Control Board", value: "11"},
    ],
extensionType:{'1':'Due to medical issue', '2':'Farmer not interest', '3':'Due to some other issues', '4':'I have not interest', '5':'Farmer not supported'},
PERPAGEDATA:5,
fooderProcessId:107
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.