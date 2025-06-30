import axios from 'axios'
import type { loginData } from '@/interfaces/loginData'

const instance = axios.create({
  //@ts-ignore
  baseURL: BASE_URL,
  timeout: 1000,
})

export const getData = async <T>(resource: string): Promise<T> => {
  try {
    const response = await instance.get<T>(resource)
    return response.data
  } catch (error) {
    throw error
  }
}

export const getAdminData = async <T>(resource: string, token: string): Promise<T> => {
  try {
    const response = await instance.get(resource, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const postLogin = async <T>(resource: string, loginData: loginData): Promise<T> => {
  try {
    const response = await instance.post(resource, loginData)
    return response.data
  } catch (error) {
    throw error
  }
}

export const postRefresh = async <T>(resource: string, token: string): Promise<T> => {
  try {
    const response = await instance.post(resource, null, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const postData = async (resource: string, data: FormData): Promise<void> => {
  try {
    await instance.post(resource, data)
  } catch (error) {
    throw error
  }
}

export const postCreate = async <T>(resoure: string, data: FormData, token: string): Promise<T> => {
  try {
    const response = await instance.post(resoure, data, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const deleteItem = async (resoure: string, token: string): Promise<void> => {
  try {
    await instance.delete(resoure, {
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch (error) {
    throw error
  }
}

export const patchEdit = async <T>(resoure: string, data: FormData, token: string): Promise<T> => {
  try {
    const response = await instance.patch(resoure, data, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    throw error
  }
}
