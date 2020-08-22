import axios from "axios";

const getRoom = (fields) => {
    return axios.post(`/video/roomInfo`, fields);
}

export {
    getRoom,
};