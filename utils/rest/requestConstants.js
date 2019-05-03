const DEV_URL = 'http://localhost:3000'
const MOCK_URL = 'http://localhost:3001'
const LOCAL_URL = 'http://localhost:8080/api/v1'
const PROD_URL = ''

var URL = ''
switch (process.env.STAGE) {
  case "dev":
    URL = DEV_URL
  break;
  case "local":
    URL = LOCAL_URL
  break;
  case "prod":
    URL = PROD_URL
  break;
  case "mock":
    URL = MOCK_URL
  break;
}

export {LOCAL_URL}