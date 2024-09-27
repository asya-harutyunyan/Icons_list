import axios from 'axios';

const $apiClient = axios.create({
  baseURL: 'http://localhost:4000',
});

$apiClient.interceptors.response.use((response) => response.data);

export default $apiClient;
