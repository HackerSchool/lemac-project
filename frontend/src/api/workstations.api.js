import httpClient from './httpClient.api';
const ENDPOINT = '/workstations';

export const getWorkstations = () => httpClient.get(ENDPOINT);

export const createWorkstation = (data) => httpClient.post(ENDPOINT, data);

export const updateWorkstation = (id, data) => httpClient.put(`${ENDPOINT}/${id}`, data);

export const deleteWorkstation = (id) => httpClient.delete(`${ENDPOINT}/${id}`);
