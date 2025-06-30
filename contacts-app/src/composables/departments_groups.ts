import type { responseData } from '@/interfaces/responseData'
import type { departments_groups } from '@/interfaces/departments_groups'
import { getData } from '@/services/services'
import { handleError } from '@/services/handleErrors'
import { ref } from 'vue'

export function useDepartmentsGroups() {
  let departments_groups_array = ref<departments_groups[] | null>(null)
  let error = ref('')
  async function fetchDepartmentsGroupsData(url: string): Promise<void> {
    try {
      const response = await getData<responseData>(url)
      departments_groups_array.value = response.items as departments_groups[]
      error.value = ''
    } catch (err) {
      console.error(err)
      //@ts-ignore
      error.value = handleError(err.code)
    }
  }

  return {
    departments_groups_array,
    error,
    fetchDepartmentsGroupsData,
  }
}
