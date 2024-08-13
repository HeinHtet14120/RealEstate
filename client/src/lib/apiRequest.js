import axios from "axios";

const apiRequest = axios.create({
    baseURL: "https://real-estate-api-navy.vercel.app/",
    withCredentials: true
});

export default apiRequest;
