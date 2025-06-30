import type { responseData } from '@/interfaces/responseData'
import type { division } from '@/interfaces/division'
import { getData } from '@/services/services'
import { handleError } from '@/services/handleErrors'
import { ref } from 'vue'

export function useDivision() {
  let divisionArray = ref<division[] | null>(null)
  let error = ref('')
  let pageAmount = ref(0)
  async function fetchDivisionsData(url: string): Promise<void> {
    try {
      const response = await getData<responseData>(url)
      pageAmount.value = response.totalPages
      divisionArray.value = response.items as division[]
      error.value = ''
    } catch (err) {
      console.error(err)
      //@ts-ignore
      error.value = handleError(err.code)
    }
  }
  function deleteItems(): void {
    divisionArray.value = null
  }

  return {
    divisionArray,
    pageAmount,
    error,
    fetchDivisionsData,
    deleteItems,
  }
}
