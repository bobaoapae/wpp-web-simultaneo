import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VUE_APP_ENDPOINT || 'http://zapia.com.br:1100',
  headers: { 'Authorization': 'Bearer ' + sessionStorage.TOKEN }
});

localStorage.baseURL = api.defaults.baseURL;

export default api;
