import request from '@/utils/request';

const getWorkspaceList = (page, pageSize, sort = {}, name) => {
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
    return request.get('/workspace/list', {params});
};

const deleteWorkspace = (ids) => {
    return request.delete(`/workspace/batchDelete`, { data: ids });
};

const getWorkspaceById = (id) => {
    return request.get(`/workspace/${id}`);
};

const updateWorkspace = (id, employee) => {
    return request.put(`/workspace/update`, employee);
};

const createWorkspace = (employee) => {
    return request.post('/workspace/add', employee);
};

const getUsers = () => {
    return request.get('/user/list');
};

export {
    getWorkspaceList,
    deleteWorkspace,
    getWorkspaceById,
    updateWorkspace,
    createWorkspace,
    getUsers,
}