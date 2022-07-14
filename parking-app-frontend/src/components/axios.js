import axios from 'axios'
const BASE_URL = 'http://localhost:9000'
const instance = axios.create({
  withCredentials: true,
  baseURL: BASE_URL,
})
export const privateInstance = axios.create({
  baseURL: BASE_URL,
  headers: {'Content-Type': 'application/json'},
  withCredentials: true,
})
export default instance