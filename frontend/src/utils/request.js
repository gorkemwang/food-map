import axios from 'axios';
import {ElMessage} from 'element-plus';
import router from '@/router';

const service = axios.create({
    baseURL: '/api',
    timeout: 10000
});

// 请求拦截器
service.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
},
error => {
    console.log(error);
    return Promise.reject(error);
});

//响应拦截器
service.interceptors.response.use(response => {
    if (response.status != 200) {
        ElMessage.error('请求失败')
    } else if (response.status == 401) {
        localStorage.removeItem('token');
        router.push('/login');
        return Promise.reject(new Error('请求失败'));
    } else {
        return response.data;
    }
},
error => {
    if (error.response) {
        if (error.response.status === 401) {
            localStorage.removeItem('token');
            router.push('/login');
        }
    }
    console.log(error);
    return Promise.reject(error);
});

export default service;