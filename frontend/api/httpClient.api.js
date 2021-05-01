import axios from 'axios';
import Vue from 'vue';
import router from '@/plugins/router';

const httpClient = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAuthToken = () => localStorage.getItem('token');

const authInterceptor = (config) => {
  const token = getAuthToken();

  if (token) config.headers['Authorization'] = `Bearer ${getAuthToken()}`;

  return config;
};

// interceptor to catch errors
const errorInterceptor = (error) => {
  // check if it's a server error
  if (!error.response) {
    Vue.notify({ type: 'warn', title: 'Network/Server error' });
    return Promise.reject(error);
  }

  if (error.config.skipInterceptor) {
    return Promise.reject(error);
  }

  // all the other error responses
  switch (error.response.status) {
    case 400:
      console.error(error.response.status, error.message);
      Vue.notify({
        type: 'warn',
        title: 'Invalid request',
        text: 'The server rejected the request',
      });
      break;

    case 401: // authentication error, logout the user
      // Will need update when login is finalized
      Vue.notify({ type: 'warn', title: 'Please login again', text: 'Session Expired' });
      localStorage.removeItem('token');
      router.push('login');
      break;

    case 500:
      console.error(error.response.status, error.message);
      Vue.notify({
        type: 'error',
        title: 'Server error',
        text: 'The server threw an error while handling the request',
      });
      break;

    default:
      console.error(error.response.status, error.message);
  }
  return Promise.reject(error);
};

// Interceptor for responses
// Useless for now but gotta be there i guess for axios' response interceptor, might update in the future for other success successful statuses
const responseInterceptor = (response) => {
  switch (response.status) {
    case 200:
      // yay!
      break;
    // any other cases
    default:
    // default case
  }

  return response;
};

httpClient.interceptors.request.use(authInterceptor);
httpClient.interceptors.response.use(responseInterceptor, errorInterceptor);

export default httpClient;
