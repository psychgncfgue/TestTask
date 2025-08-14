import axios, { AxiosRequestConfig } from 'axios';

export async function fetcherWithCheck(
  url: string,
  config: AxiosRequestConfig = {}
) {
  try {
    await axios.get('/api/auth/check', { withCredentials: true });
  } catch {
  }

  const response = await axios({
    url,
    withCredentials: true,
    ...config,
  });
  return response.data;
}