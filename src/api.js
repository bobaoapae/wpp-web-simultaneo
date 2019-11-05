import axios from 'axios';

const api = axios.create({
    //baseURL: "http://1bcc02a6.ngrok.io",
    baseURL: 'http://zapia.com.br:1100',
    headers: {'Authorization': "Bearer "+localStorage.TOKEN}
});

localStorage.baseURL = api.defaults.baseURL;

export default api;