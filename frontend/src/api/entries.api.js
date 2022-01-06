import httpClient from './httpClient.api';
const ENDPOINT = '/entries';

export const getEntries = (active = 0) =>
  httpClient.get(ENDPOINT, {
    params: {
      active,
    },
  });

export const addEntry = (data) => httpClient.post(ENDPOINT, data);

export const updateEntry = (id, data) => httpClient.put(`${ENDPOINT}/${id}`, data);

export const deleteEntry = (id) => httpClient.delete(`${ENDPOINT}/${id}`);
