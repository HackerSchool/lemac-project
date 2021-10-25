import httpClient from './httpClient.api';
const ENDPOINT = '/loghours';

export const getHours = () => httpClient.get(ENDPOINT);

export const getHoursSelf = () => httpClient.get(`${ENDPOINT}/self`);

export const createHours = (data) => httpClient.post(ENDPOINT, data);

export const updateHours = (id, data) => httpClient.put(`${ENDPOINT}/${id}`, data);

export const deleteHours = (id) => httpClient.delete(`${ENDPOINT}/${id}`);