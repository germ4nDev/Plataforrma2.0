import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  apiUrl: 'http://localhost:5111'
//   apiUrl: 'https://mock-data-api-nextjs.vercel.app'
};
