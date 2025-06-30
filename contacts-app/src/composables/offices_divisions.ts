import type { responseData } from '@/interfaces/responseData'
import type { offices_divisions } from '@/interfaces/offices_divisions'
import { getData } from '@/services/services'
import { handleError } from '@/services/handleErrors'
import { ref } from 'vue'

export function useOfficesDivisions() {
  let offices_divisions_array = ref<offices_divisions[] | null>(null)
  let error = ref('')
  async function fetchOfficesDivisionsData(url: string): Promise<void> {
    try {
      const response = await getData<responseData>(url)
      offices_divisions_array.value = response.items as offices_divisions[]
      error.value = ''
    } catch (err) {
      console.error(err)
      //@ts-ignore
      error.value = handleError(err.code)
    }
  }

  return {
    offices_divisions_array,
    error,
    fetchOfficesDivisionsData,
  }
}
