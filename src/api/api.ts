import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.todoist.com/rest/v2',
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TODOIST_API_TOKEN}`,
  },
});

export default api;