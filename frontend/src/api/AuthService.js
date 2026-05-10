import request from '@/utils/request';

const login = ({username, password}) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    return request.post('/auth/login', formData);
};

const logout = () => {
    return request.post('/auth/logout');
};

const loginCheck = () => {
    return request.get('/auth/check');
};

const register = (registerInfo) => {
    return request.post('/auth/register', registerInfo);
};

export {
    login,
    logout,
    loginCheck,
    register
}