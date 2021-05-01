import axios from './httpClient.api';

const ENDPOINT = '/auth';

const apiLogin = (code) => {
  axios.get(`${ENDPOINT}/fenix?=code${encodeURIComponent(code)}`, { skipInterceptor: true });
};

export default apiLogin;
