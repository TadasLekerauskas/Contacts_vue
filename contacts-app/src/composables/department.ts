import type { responseData } from '@/interfaces/responseData'
import type { department } from '@/interfaces/department'
import { getData } from '@/services/services'
import { handleError } from '@/services/handleErrors'
import { ref } from 'vue'

export function useDepartment() {
  let departmentArray = ref<department[] | null>(null)
  let error = ref('')
  let pageAmount = ref(0)
  async function fetchDepartmentsData(url: string): Promise<void> {
    try {
      const response = await getData<responseData>(url)
      pageAmount.value = response.totalPages
      departmentArray.value = response.items as department[]
      error.value = ''
    } catch (err) {
      console.error(err)
      //@ts-ignore
      error.value = handleError(err.code)
    }
  }
  function deleteItems(): void {
    departmentArray.value = null
  }

  return {
    departmentArray,
    pageAmount,
    error,
    fetchDepartmentsData,
    deleteItems,
  }
}
