import httpClient from './httpClient.api';

const ENDPOINT = '/auth';

const apiLogin = (code) =>
  httpClient.get(`${ENDPOINT}/fenix?code=${encodeURIComponent(code)}`, { skipInterceptor: true });
export default apiLogin;
