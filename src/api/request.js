import axios from "axios";

const userRequest = axios.create({
    baseURL: 'http://152.136.113.148:8081/',
    timeout: 5000,
});

const blogRequest = axios.create({
    baseURL: 'http://152.136.113.148:8083/',
    timeout: 5000,
});

userRequest.interceptors.request.use(config => {
    return config;
}
);
userRequest.interceptors.response.use((res) => {
    return res.data
}, (error) => {
    return Promise.reject(new Error(`Failed! ${error}`))
});

blogRequest.interceptors.request.use(config => {
    return config;
}
);
blogRequest.interceptors.response.use((res) => {
    return res.data
}, (error) => {
    return Promise.reject(new Error(`Failed! ${error}`))
}
);

export { userRequest, blogRequest };