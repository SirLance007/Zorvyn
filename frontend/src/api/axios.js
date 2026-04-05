import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
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
