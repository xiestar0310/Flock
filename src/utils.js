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

export {
    getRoom,
    setFireRoom,
    getFireTime,
};