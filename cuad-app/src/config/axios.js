import axios from 'axios';

const instance = axios.create({
    baseURL: "http://dev-cuad-highscores.pantheonsite.io/",
});

export default instance;