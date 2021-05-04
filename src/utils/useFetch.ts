import useSWR from 'swr'
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333'
})

export function useFetch<Data = any, Error = any>(url: string) {
  const { data, error } = useSWR<Data, Error>(url, async url => {
    const response = await api.get(url);

    return response.data;
  })

  return { data, error }
}