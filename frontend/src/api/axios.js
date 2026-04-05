import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5001/api', // Adjust if your backend port is different
});

// Add a request interceptor to include the JWT token in headers
API.interceptors.request.use((req) => {
    const profile = localStorage.getItem('profile');
    if (profile) {
        const { token } = JSON.parse(profile);
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;
