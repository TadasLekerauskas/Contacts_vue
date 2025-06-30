import type { responseData } from '@/interfaces/responseData'
import type { contact } from '@/interfaces/contact'
import { getData } from '@/services/services'
import { handleError } from '@/services/handleErrors'
import { ref } from 'vue'

export function useContact() {
  let contactsArray = ref<contact[] | null>(null)
  let error = ref('')
  let allContactsCount = ref(0)
  let pageAmount = ref(0)
  async function fetchContactsData(url: string): Promise<void> {
    try {
      const response = await getData<responseData>(url)
      pageAmount.value = response.totalPages
      allContactsCount.value = response.totalItems
      contactsArray.value = response.items as contact[]
      error.value = ''
    } catch (err) {
      console.error(err)
      //@ts-ignore
      error.value = handleError(err.code)
    }
  }

  return {
    contactsArray,
    allContactsCount,
    pageAmount,
    error,
    fetchContactsData,
  }
}
