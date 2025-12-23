import axios from 'axios'

export const port = 3005

// backend path
export const api = axios.create({
    baseURL: `http://localhost:${port}`,
})
