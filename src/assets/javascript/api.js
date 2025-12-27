import api from './index';
// Employess
export const apiGetEmployees = () => api.get('/employees');
export const apiPostEmployee = (data) => api.post('/employees', data);
export const apiPatchEmployee = (id, data) => api.put(`/employees/${id}`, data);
export const apiDeleteEmployee = (id) => api.delete(`/employees/${id}`);

// case案子
export const apiGetCases = () => api.get('/cases?active=true');
export const apiPostCase = (data) => api.post('/cases', data);
export const apiPutCase = (id, data) => api.put(`/cases/${id}`, data);
export const apiDeleteCase = (id, data) => api.delete(`/cases/${id}`, data);

// Vendors
export const apiGetVendors = () => api.get('/vendors?active=true');
export const apiPostVendor = (data) => api.post('/vendors', data);
export const apiPatchVendor = (data, id) => api.put(`/vendors/${id}`, data);
export const apiDeleteVendor = (id) => api.delete(`/vendors/${id}`);
// export const apiGetVendor = (id) => api.get(`/api/Vendors/${id}`);

// WorkLog 工單
export const apiCreateWorkLog = (data) => api.post('/worklogs', data);
export const apiGetWorkLog = (params) => api.get('/worklogs', { params });
export const apiDeleteWorkLog = (id) => api.delete(`/worklogs/${id}`);
// Vendors
export const apiGetVendor = (id) => api.get(`/vendors/${id}`);

export const apiGetOrder = (id) => api.get(`/api/WorkOrders/${id}`);
export const apiPostOrder = (data) => api.post('/api/WorkOrders', data);
export const apiPatchOrder = (data, id) => api.put(`/api/WorkOrders/${id}`, data);
export const apiDeleteOrder = (id) => api.delete(`/api/WorkOrders/${id}`);

// 薪資
export const apiGetAllPayroll = (params) => api.get('/payroll/all', { params });
export const apiGetPayroll = (employeeId, params) => api.get(`/payroll/${employeeId}`, { params });
export const apiPostPayroll = (params) => api.post('/payroll/generate', null, { params });

// // admin
// // export const apiSignUp = (data) => api.post(`/admin/sign_up`, data);
export const apiSignIn = (data) => api.post('/auth/login', data);
