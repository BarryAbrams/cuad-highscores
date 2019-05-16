import axios from 'axios';

const instance = axios.create({
    baseURL: "https://cuadventures.com/",
});

export default instance;