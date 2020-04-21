const MOCK_URL = 'http://localhost:3001';
const LOCAL_URL = 'http://localhost:8080/api/v1';

// Auth endpoint
const AUTH_DEV_URL = `${LOCAL_URL}/auth/api/v1`;
const AUTH_STAGING_URL = `${LOCAL_URL}/auth/api/v1`;
const AUTH_PROD_URL = `${LOCAL_URL}/auth/api/v1`;

const AUTH_ENDPOINT_BASE_URL = AUTH_DEV_URL;
export { AUTH_ENDPOINT_BASE_URL };

// Locations endpoint
const LOCATIONS_DEV_URL = 'https://3rk3xtficb.execute-api.eu-west-1.amazonaws.com/dev/api/v1';
const LOCATIONS_STAGING_URL = 'https://7s2c5akwy2.execute-api.eu-west-1.amazonaws.com/staging/api/v1';
const LOCATIONS_PROD_URL = 'https://p4is2qdxnd.execute-api.eu-west-1.amazonaws.com/prod/api/v1';

const LOCATIONS_ENDPOINT_BASE_URL = LOCATIONS_DEV_URL;
export { LOCATIONS_ENDPOINT_BASE_URL };

// Products endpoint
const PRODUCTS_DEV_URL = 'https://1qie0vagy1.execute-api.eu-west-1.amazonaws.com/dev/api/v1';
const PRODUCTS_STAGING_URL = 'https://zu6wjlgc49.execute-api.eu-west-1.amazonaws.com/staging/api/v1';
const PRODUCTS_PROD_URL = 'https://cmcyj6c72l.execute-api.eu-west-1.amazonaws.com/prod/api/v1';

const PRODUCTS_ENDPOINT_BASE_URL = PRODUCTS_DEV_URL;
export { PRODUCTS_ENDPOINT_BASE_URL };


const OFFICES_DEV_URL = 'https://s7cnld7i7c.execute-api.eu-west-1.amazonaws.com/dev/api/v1';
const OFFICES_STAGING_URL = 'https://856c4yiakc.execute-api.eu-west-1.amazonaws.com/staging/api/v1';
const OFFICES_PROD_URL = 'https://s7cnld7i7c.execute-api.eu-west-1.amazonaws.com/dev/api/v1';

const OFFICES_ENDPOINT_BASE_URL = OFFICES_DEV_URL;
export { OFFICES_ENDPOINT_BASE_URL };

// function ReturnCondition() {
//   switch (process.env.STAGE) {
//     case 'mock':
//       return MOCK_URL;
//     case 'local':
//       return LOCAL_URL;
//     case 'dev':
//       return DEV_URL;
//     case 'staging':
//       return STAGING_URL;
//     case 'prod':
//       return PROD_URL;
//   }
//   return '';
// }
