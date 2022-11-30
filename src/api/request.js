import axios from "axios";
import store from '@/store';

const request = axios.create({
    baseURL: '/api',
    timeout: 5000,
});

request.interceptors.request.use(config => {
    if (store.state.user.uuid_token) {
        config.headers.userTempId = store.state.user.uuid_token;
    }
    if(store.state.user.token){
        config.headers.token = store.state.user.token;
    }
    return config;
}
);
request.interceptors.response.use((res)=>{
    return res.data
},(error)=>{
    return Promise.reject(new Error(`Failed! ${error}`))
});

export default request;