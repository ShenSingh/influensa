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

// Flag to track if token has been initialized
let tokenInitialized = false;

// Initialize token from AsyncStorage (only when needed)
const initializeToken = async () => {
  if (tokenInitialized) return;

  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      setHeader(token);
      console.log('Token loaded from storage and set in API client');
    }
    tokenInitialized = true;
  } catch (error) {
    console.error('Error loading token from storage:', error);
    tokenInitialized = true; // Mark as initialized even if failed to prevent retry loops
  }
};

// Add request interceptor to ensure token is always attached
apiClient.interceptors.request.use(
  async (config) => {
    // Initialize token if not already done
    if (!tokenInitialized) {
      await initializeToken();
    }

    // If no Authorization header is set, try to get token from storage
    if (!config.headers.Authorization) {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error getting token in request interceptor:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config // original req
      console.log("code is : "+error.response?.status)
      if ((error.response?.status === 401 || error.response?.status === 403 ) && !originalRequest._retry) {
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
