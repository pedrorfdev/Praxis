import axios from 'axios'
import { translateServerMessage } from "@/lib/error-utils"

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api",
})

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('praxis:token') : null

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined") console.error("API error:", error?.response?.data || error?.message)

    const serverMessage = error?.response?.data?.message || error?.message
    const userMessage = translateServerMessage(serverMessage) || "Ocorreu um erro. Tente novamente."

    if (error?.response) {
      error.response.data = {
        ...(error.response.data || {}),
        userMessage,
      }
    } else {
      error.userMessage = userMessage
    }

    return Promise.reject(error)
  }
)