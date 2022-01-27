import httpClient from './httpClient.api';
const ENDPOINT = '/publication';

export const getPublications = (active = 0) =>
  httpClient.get(ENDPOINT, {
    params: {
      active,
    },
  });

export const addPublication = (data) => httpClient.post(ENDPOINT, data);

export const updatePublications = (id, data) => httpClient.put(`${ENDPOINT}/${id}`, data);

export const deletePublications = (id) => httpClient.delete(`${ENDPOINT}/${id}`);
