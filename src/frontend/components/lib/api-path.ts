import axios from 'axios'

// backend path
export const api = axios.create({
    baseURL: 'http://localhost:3000',
})
