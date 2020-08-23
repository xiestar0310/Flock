import axios from "axios";

const getRoom = (fields) => {
  return axios.post(`/video/roomInfo`, fields);
};

const setFireRoom = (fields) => {
  return axios.post(`/video/setFireRoom`, fields);
};

const getFireTime = (fields) => {
  return axios.post(`/video/getFireTime`, fields);
};

const setFireParticipants = (fields) => {
  return axios.post(`/video/setFireParticipants`, fields);
};

const getFireParticipants = (fields) => {
  return axios.post(`/video/getFireParticipants`, fields);
};

export {
  getRoom,
  setFireRoom,
  getFireTime,
  setFireParticipants,
  getFireParticipants,
};
