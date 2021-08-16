import httpClient from './httpClient.api';
const ENDPOINT = '/users';

export const getUsers = () => httpClient.get(ENDPOINT);

export const createUser = (data) => httpClient.post(ENDPOINT, data);

export const updateUser = (id, data) => httpClient.put(`${ENDPOINT}/${id}`, data);

export const deleteUser = (id) => httpClient.delete(`${ENDPOINT}/${id}`);
