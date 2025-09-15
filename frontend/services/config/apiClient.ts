import axios, {AxiosError} from "axios"
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BASE_URL = "http://localhost:3001"

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
})

export const setHeader = (token: string| null) => {
  if (token){
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config // original req
      if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          const result = await apiClient.post("/api/auth/refresh-token")
          const newAccessToken = result.data.accessToken
          setHeader(newAccessToken)

          // Also store in AsyncStorage
          await AsyncStorage.setItem('accessToken', newAccessToken);

          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`

          return apiClient(originalRequest)
        } catch (e) {
          if (e instanceof AxiosError){
            if (e.response?.status == 401){
              // Clear auth data and handle logout in React Native
              await AsyncStorage.multiRemove(['accessToken', 'userData']);
              // You can emit an event here to handle navigation to login screen
              console.log('Authentication failed, user needs to login again');
            }
          }
          console.log(e)
        }
      }
      return Promise.reject(error);
    }
)

export default apiClient
