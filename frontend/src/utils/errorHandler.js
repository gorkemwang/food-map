import {ElNotification} from 'element-plus';
import router from '@/router';

export const handleError = (error, message) => {
    console.log(message, error);
    const options = {
        title: '错误',
        message,
        type: 'error',
        duration: 3000
    };

    if (error.response) {
        switch (error.response.status) {
            case 400:
                message = message ? message : 'Bad Request';
                break;
            case 401:
                message = 'Unauthorized';
                router.push({name: 'UserLogin'});
                break;
            case 403:
                message = 'Forbidden';
                break;
            case 404:
                message = 'Not Found';
                break;
            case 500:
                message = 'Internal Server Error';
                break;
            default:
                message = 'Unknown Error';
        }
        options.message = message;
        ElNotification.error(options);
    } else if (error.request) {
        ElNotification.error(message ? options : 'No Response');
    } else {
        ElNotification.error(`Error: ${error.message}`);
    }
};