import type { responseData } from '@/interfaces/responseData'
import type { office } from '@/interfaces/office'
import { getData } from '@/services/services'
import { handleError } from '@/services/handleErrors'
import { ref } from 'vue'

export function useOffice() {
  let officeArray = ref<office[] | null>(null)
  let error = ref('')
  let pageAmount = ref(0)
  async function fetchOfficesData(url: string): Promise<void> {
    try {
      const response = await getData<responseData>(url)
      pageAmount.value = response.totalPages
      officeArray.value = response.items as office[]
      error.value = ''
    } catch (err) {
      console.error(err)
      //@ts-ignore
      error.value = handleError(err.code)
    }
  }
  function deleteItems(): void {
    officeArray.value = null
  }

  return {
    officeArray,
    pageAmount,
    error,
    fetchOfficesData,
    deleteItems,
  }
}
