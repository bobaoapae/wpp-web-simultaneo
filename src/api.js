import axios from 'axios';

const api = axios.create({
    //baseURL: "http://192.168.0.104:1100",
    baseURL: 'http://zapia.com.br:1101',
    headers: {'Authorization': "Bearer "+sessionStorage.TOKEN}
});

localStorage.baseURL = api.defaults.baseURL;

export default api;