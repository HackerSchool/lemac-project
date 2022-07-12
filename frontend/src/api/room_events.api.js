import httpClient from './httpClient.api';
const ENDPOINT = '/room-events';

export const getEvents = (start, finish) =>
  httpClient.get(`${ENDPOINT}`, {
    params: {
      start,
      finish,
    },
  });
export const createEvent = (data) => httpClient.post(ENDPOINT, data);
export const updateEvent = (id, data) => httpClient.put(`${ENDPOINT}/${id}`, data);
export const deleteEvent = (id) => httpClient.delete(`${ENDPOINT}/${id}`);
