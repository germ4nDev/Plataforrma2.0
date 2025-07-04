import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  apiUrl: 'http://localhost:3000/api'
//   apiUrl: 'https://mock-data-api-nextjs.vercel.app'
};
