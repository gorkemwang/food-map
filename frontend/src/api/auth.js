import request from '@/utils/request';

const login = data => {
    return request.post('/auth/login', data);
}
const register = data => {
    return request.post('/auth/register', data);
}
export {
    login,
    register
}