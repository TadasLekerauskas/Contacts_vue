import type { contact } from '@/interfaces/contact'
import { getData } from '@/services/services'
import { ref } from 'vue'

export function useSingleContact() {
  let contact = ref<contact | null>(null)
  let error = ref('')
  async function fetchContactData(url: string): Promise<void> {
    try {
      contact.value = await getData<contact>(url)
      error.value = ''
    } catch (err) {
      console.error(err)
      //@ts-ignore
      const errorCode = err.code
      if (errorCode == 'ERR_NETWORK') {
        error.value = 'Klaida jungiantis su serveriu'
      } else if (errorCode == 'ECONNABORTED') {
        error.value = 'Klaida, nutrauktas prisijungimas su serveriu'
      } else {
        error.value = 'Kontaktas neegzistuoja'
      }
    }
  }

  return {
    contact,
    error,
    fetchContactData,
  }
}
