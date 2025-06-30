import type { responseData } from '@/interfaces/responseData'
import type { divisions_departments } from '@/interfaces/divisions_departments'
import { getData } from '@/services/services'
import { handleError } from '@/services/handleErrors'
import { ref } from 'vue'

export function useDivisionsDepartments() {
  let divisions_departments_array = ref<divisions_departments[] | null>(null)
  let error = ref('')
  async function fetchDivisionsDepartmentsData(url: string): Promise<void> {
    try {
      const response = await getData<responseData>(url)
      divisions_departments_array.value = response.items as divisions_departments[]
      error.value = ''
    } catch (err) {
      console.error(err)
      //@ts-ignore
      error.value = handleError(err.code)
    }
  }

  return {
    divisions_departments_array,
    error,
    fetchDivisionsDepartmentsData,
  }
}
