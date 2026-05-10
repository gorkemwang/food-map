import request from '@/utils/request';

const getDBList = (page, pageSize, sort = {}, name) => {
    const params = {
        page: page || 1,
        pageSize: pageSize || 20
    };

    const {prop, order} = sort;
    if (prop && order) {
        Object.assign(params, sort);
    }
    if (name) {
        params.name = name;
    }
    return request.get('/dbSetting/list', {params});
};

const uploadCSV = (dbName,file) => {
    const formData = new FormData();
    formData.append('file', file.raw);
    formData.append('dbName', dbName);

    return request.post('/dbSetting/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

const exportCSV = (id) => {
  return request.get(`/dbSetting/export/${id}`);
};

const deleteDBSeting = (id) => {
    return request.delete(`/dbSetting/delete/${id}`);
};

export {
    uploadCSV,
    getDBList,
    exportCSV,
    deleteDBSeting
}