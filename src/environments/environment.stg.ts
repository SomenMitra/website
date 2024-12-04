export const environment = {
  production: true,
 
  url: '',
  serviceURL: 'http://117.247.252.112/Fard_stg/admin/api/',
  siteURL: 'http://117.247.252.112/Fard_stg/website/',
  websiteserviceURL: 'http://117.247.252.112/Fard_stg/cms/api/',
  fileUrl: 'http://117.247.252.112/Fard_stg/cms/storage/uploads/images/',
  domainUrl:'http://117.247.252.112/Fard_stg/admin/',
  cmsdomainUrl:'http://117.247.252.112/Fard_stg/cms/',

  // serviceURL: 'http://164.164.122.169:8060/Fard_AI/admin/api/',
  // siteURL: 'http://164.164.122.169:8060/Fard_AI/website/',
  // websiteserviceURL: 'http://164.164.122.169:8060/Fard_AI/cms/api/',
  // fileUrl: 'http://164.164.122.169:8060/Fard_AI/cms/storage/uploads/images/',
  // domainUrl:'http://164.164.122.169:8060/Fard_AI/admin/',
  // cmsdomainUrl:'http://164.164.122.169:8060/Fard_AI/cms/',

  // serviceURL: 'http://164.164.122.169:8060/Fard_testI/admin/api/',
  // siteURL: 'http://164.164.122.169:8060/Fard_testI/website/',
  // websiteserviceURL: 'http://164.164.122.169:8060/Fard_testI/cms/api/',
  // fileUrl: 'http://164.164.122.169:8060/Fard_testI/cms/storage/uploads/images/',
  // domainUrl:'http://164.164.122.169:8060/Fard_testI/admin/',
  // cmsdomainUrl:'http://164.164.122.169:8060/Fard_testI/cms/',
  apiUrl:'',

  encryptKey: 'AA74CDCC2BBRT935136',
  encryptIV: '26102021@qwI',
  my_bearer_auth : 'Bearer ' + sessionStorage.getItem('loggedtoken'),
  my_auth : 'Basic ' + btoa('admin' + ':' + 'admin'),
  errorMsg:'Some Error Occured',
  constScheme:1,
  constService:2,

  constDrftSts:1,
  constDocSts:2,
  constPrevwSts:3,

  constQrySts:6,
  constRsmSts:3,
  constMatchValue:0.7,
  sujogPortal:46,
  agricultureDirectory:6,
  directoryListicons:{'1':'fish.png','2':'animal-care.png','3':'apicol.png','4':'horticulture.png','5':'shovel.png','6':'planting.png','7':'paresram.jpg','8':'odisha-govt-ogo.png','9':'sujog.jpg','10':'mosarkar.png','11':'ospcb-logo.png'},
  APICOL_Directorate:3,
  how_to_use_yt_link:'https://www.youtube.com/embed/F6FpHQPjP0Q',
  redirectMsg:'This will be redirected to external URL for filling up rest of the information',
  seedDBT:51,
  KO_SCHEME_IDS:['28','29','30','31','42','41','40'],
  MKUY_SELF:'NO',
  NO_NET_PROFIT_YEAR :'7',
  AIFPortal:58

};
