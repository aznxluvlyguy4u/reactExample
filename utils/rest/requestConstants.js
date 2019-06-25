const MOCK_URL = 'http://localhost:3001';
const LOCAL_URL = 'http://localhost:8080/api/v1';
const DEV_URL = 'https://1qie0vagy1.execute-api.eu-west-1.amazonaws.com/dev/api/v1';
const STAGING_URL = 'https://zu6wjlgc49.execute-api.eu-west-1.amazonaws.com/staging/api/v1';
const PROD_URL = '';

// function ReturnCondition() {
//   switch (process.env.STAGE) {
//     case 'mock':
//       return MOCK_URL;
//     case 'local':
//       return LOCAL_URL;
//     case 'dev':
//       return DEV_URL;
//     case 'staging':
//       console.log('test');
//       return STAGING_URL;
//     case 'prod':
//       return PROD_URL;
//   }
//   return '';
// }

const BASE_URL = DEV_URL;
export { BASE_URL };
