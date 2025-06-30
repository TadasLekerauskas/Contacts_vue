import { defineStore } from 'pinia'
import { type userData } from '@/interfaces/userData'
import { ref } from 'vue'
import { postLogin } from '@/services/services'
import type { loginData } from '@/interfaces/loginData'
import { jwtDecode } from 'jwt-decode'
import type { decodedToken } from '@/interfaces/decodedToken'
import { postRefresh } from '@/services/services'

export const useUser = defineStore('userStore', () => {
  let userData = ref<null | userData>(jsonToUserData())
  let decodedToken: decodedToken
  let error = ref('')

  if (userData.value) {
    decodedToken = jwtDecode(userData.value.token)
  }

  async function refresh() {
    if (userData.value) {
      userData.value = await postRefresh<userData>(
        `collections/users/auth-refresh`,
        userData.value.token,
      )
    }
  }

  function jsonToUserData(): userData | null {
    const data = localStorage.getItem('userData')
    if (data) {
      const userData: userData = JSON.parse(data)
      return userData
    }
    return null
  }

  async function login(resource: string, loginData: loginData) {
    try {
      userData.value = await postLogin<userData>(resource, loginData)
      error.value = ''
      localStorage.setItem('userData', JSON.stringify(userData.value))
      decodedToken = jwtDecode(userData.value.token)
    } catch (err) {
      //@ts-ignore
      if (err.code == 'ERR_NETWORK') {
        error.value = 'Neprisijungiama su serveriu'
        //@ts-ignore
      } else if (err.code == 'ECONNABORTED') {
        error.value = 'Nutrauktas prisijungimas su serveriu'
      } else {
        error.value = 'Neteisingas naudotojo vardas arba slaptažodis'
      }
    }
  }

  function logout(): void {
    userData.value = null
    error.value = ''
    localStorage.removeItem('userData')
  }

  return {
    userData,
    error,
    login,
    logout,
  }
})
