import axios from 'axios';

const instance = axios.create({
    baseURL: "http://live-cuad-highscores.pantheonsite.io/",
});

export default instance;