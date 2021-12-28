import httpClient from './httpClient.api';
const ENDPOINT = '/entries';

export const getEntries = () => httpClient.get(ENDPOINT);

export const addEntry = (data) => httpClient.post(ENDPOINT, data);

export const updateEntry = (id, data) => httpClient.put(`${ENDPOINT}/${id}`, data);

export const deleteEntry = (id) => httpClient.delete(`${ENDPOINT}/${id}`);
